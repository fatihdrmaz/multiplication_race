import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Platform, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useFrameCallback,
    runOnJS,
    withSpring,
    withTiming,
    withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import ScrollingRoad from '../game/ScrollingRoad';
import AnswerGate from '../game/AnswerGate';
import { CAR_SPRITES, RIVAL_SPRITES, CAR_ASPECT } from '../game/laneAssets';
import GameOverCard from '../components/GameOverCard';
import { QuestionEngine } from '../utils/QuestionEngine';
import { useAudio } from '../utils/audioManager';
import { saveUserData, updateLeaderboard, saveGameResult } from '../utils/storage';

const LANES = 3;
const GATES_TO_FINISH = 10;
const MAX_ROAD_WIDTH = 360;
const NITRO = { factor: 1.8, ms: 1500 };
const SLOW = { factor: 0.45, ms: 1200 };

// Kapının ekranın üstünden arabaya ulaşma süresi; seviye arttıkça kısalır
const answerSeconds = (level) => Math.max(3.2, 5 - (level - 1) * 0.4);
const rivalFactor = (level) => Math.min(1.1 + (level - 1) * 0.05, 1.35);

const TOPICS = { multiplication: 'Çarpma', division: 'Bölme', advanced_mult: 'İleri Çarpma' };

const vibrate = (fn) => {
    if (Platform.OS !== 'web') fn();
};

// Arabanın üstünde yükselip kaybolan kısa geri bildirim yazısı
const FloatText = ({ text, color, x, y }) => {
    const t = useSharedValue(0);
    useEffect(() => {
        t.value = withTiming(1, { duration: 900 });
    }, []);
    const style = useAnimatedStyle(() => ({
        opacity: 1 - t.value * t.value,
        transform: [{ translateY: -t.value * 60 }, { scale: 0.8 + Math.min(t.value * 3, 1) * 0.4 }],
    }));
    return (
        <Animated.Text pointerEvents="none" style={[styles.floatText, { color, left: x - 80, top: y }, style]}>
            {text}
        </Animated.Text>
    );
};

// Başlıktaki ince ilerleme çubuğu; araba ikonları doğrudan oyun döngüsünden akar
const MiniProgress = ({ distance, rivalDistance, finishDistance, playerSprite, rivalSprite }) => {
    const [width, setWidth] = useState(0);
    const marker = (d) => {
        'worklet';
        return { transform: [{ translateX: Math.min(d.value / finishDistance.value, 1) * width - 9 }, { rotate: '90deg' }] };
    };
    const playerStyle = useAnimatedStyle(() => marker(distance), [width]);
    const rivalStyle = useAnimatedStyle(() => marker(rivalDistance), [width]);

    return (
        <View style={styles.miniTrack} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
            <Animated.Image source={rivalSprite} style={[styles.miniCar, { opacity: 0.75 }, rivalStyle]} />
            <Animated.Image source={playerSprite} style={[styles.miniCar, playerStyle]} />
            <Text style={styles.miniFlag}>🏁</Text>
        </View>
    );
};

const LaneRaceScreen = ({ navigation, route }) => {
    const { username, selectedCar, userCoins, gameConfig } = route.params;
    const config = gameConfig || { type: 'multiplication', level: 1 };

    const [layout, setLayout] = useState(null);
    const [status, setStatus] = useState('countdown'); // countdown | playing | won | lost
    const [countdown, setCountdown] = useState(3);
    const [level, setLevel] = useState(1);
    const [lane, setLane] = useState(1);
    const [gate, setGate] = useState(null);
    const [prevGate, setPrevGate] = useState(null);
    const [score, setScore] = useState(0);
    const [coins, setCoins] = useState(userCoins || 0);
    const [streak, setStreak] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    const [reward, setReward] = useState({ score: 0, coins: 0 });
    const [popup, setPopup] = useState(null);

    const { playSoundEffect, playBackgroundMusic, pauseBackgroundMusic, toggleMusic, isMusicPlaying } = useAudio();

    // Dünya durumu UI thread'inde akar; JS yalnızca olaylarda devreye girer
    const distance = useSharedValue(0);
    const rivalDistance = useSharedValue(0);
    const speed = useSharedValue(0);
    const targetSpeed = useSharedValue(0);
    const rivalSpeed = useSharedValue(0);
    const finishDistance = useSharedValue(1);
    const gateDistance = useSharedValue(0);
    const gateActive = useSharedValue(false);
    const running = useSharedValue(false);
    const laneX = useSharedValue(0);
    const tilt = useSharedValue(0);
    const boost = useSharedValue(0);
    const shake = useSharedValue(0);

    const laneRef = useRef(1);
    const gateRef = useRef(null);
    const metricsRef = useRef(null);
    const timers = useRef([]);
    const handlers = useRef({});
    const idCounter = useRef(0); // Kapı ve yazı kimlikleri; Date.now() aynı ms'de çakışıyordu
    const nextId = () => ++idCounter.current;

    const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
    const clearTimers = () => {
        timers.current.forEach(clearTimeout);
        timers.current = [];
    };

    // Yerleşim: yol genişliği, şerit merkezleri ve arabanın konumu ekrana göre hesaplanır
    let metrics = null;
    if (layout) {
        const roadWidth = Math.min(layout.width - 2 * 56, MAX_ROAD_WIDTH);
        const roadLeft = (layout.width - roadWidth) / 2;
        const laneWidth = roadWidth / LANES;
        const carW = laneWidth * 0.5;
        const carH = carW * CAR_ASPECT;
        const carY = layout.height - carH - 24;
        const spawnDistance = carY + 80; // Kapı ekranın hemen üstünde doğar
        const baseSpeed = spawnDistance / answerSeconds(level);
        metrics = {
            roadWidth, roadLeft, laneWidth, carW, carH, carY, spawnDistance, baseSpeed,
            laneCenters: Array.from({ length: LANES }, (_, i) => roadLeft + laneWidth * (i + 0.5)),
        };
    }
    metricsRef.current = metrics;

    const spawnGate = () => {
        const m = metricsRef.current;
        const q = QuestionEngine.generate(config);
        const next = {
            id: nextId(),
            distance: distance.value + m.spawnDistance,
            question: q,
            answers: q.answers,
            correctLane: q.answers.indexOf(q.correctAnswer),
        };
        gateRef.current = next;
        gateDistance.value = next.distance;
        gateActive.value = true;
        setGate(next);
    };

    const moveToLane = (target) => {
        const m = metricsRef.current;
        if (!m || status !== 'playing') return;
        const nextLane = Math.max(0, Math.min(LANES - 1, target));
        if (nextLane === laneRef.current) return;
        const dir = nextLane > laneRef.current ? 1 : -1;
        laneRef.current = nextLane;
        setLane(nextLane);
        laneX.value = withSpring(m.laneCenters[nextLane], { damping: 15, stiffness: 190 });
        tilt.value = withSequence(withTiming(dir * 14, { duration: 110 }), withSpring(0, { damping: 10 }));
        vibrate(() => Haptics.selectionAsync());
    };

    const showPopup = (text, color) => {
        const m = metricsRef.current;
        setPopup({ id: nextId(), text, color, x: m.laneCenters[laneRef.current], y: m.carY - 50 });
    };

    const onGatePassed = () => {
        const m = metricsRef.current;
        const passed = gateRef.current;
        const chosen = laneRef.current;
        setPrevGate({ ...passed, chosen });

        if (chosen === passed.correctLane) {
            playSoundEffect('boost');
            vibrate(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
            setScore((s) => s + 10 + streak * 5);
            setCoins((c) => c + 1);
            setStreak((s) => s + 1);
            setCorrectCount((c) => c + 1);
            showPopup(streak >= 2 ? `🔥 Seri x${streak + 1}!` : '🚀 Nitro!', '#FFD93D');

            targetSpeed.value = m.baseSpeed * NITRO.factor;
            boost.value = withTiming(1, { duration: 120 });
            later(() => {
                targetSpeed.value = m.baseSpeed;
                boost.value = withTiming(0, { duration: 300 });
            }, NITRO.ms);
        } else {
            playSoundEffect('wrong');
            vibrate(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
            setStreak(0);
            setWrongCount((c) => c + 1);
            showPopup(`Doğrusu ${passed.question.correctAnswer}`, '#FFFFFF');

            targetSpeed.value = m.baseSpeed * SLOW.factor;
            shake.value = withSequence(
                withTiming(10, { duration: 50 }),
                withTiming(-10, { duration: 50 }),
                withTiming(6, { duration: 50 }),
                withTiming(0, { duration: 50 })
            );
            later(() => { targetSpeed.value = m.baseSpeed; }, SLOW.ms);
        }

        spawnGate();
    };

    const onFinish = (result) => {
        clearTimers();
        boost.value = withTiming(0, { duration: 200 });
        playSoundEffect(result === 'won' ? 'correct' : 'wrong');
        setStatus(result);
    };

    handlers.current = { onGatePassed, onFinish };
    const gatePassedJS = useCallback(() => handlers.current.onGatePassed(), []);
    const finishJS = useCallback((result) => handlers.current.onFinish(result), []);

    // Oyun döngüsü (UI thread): hız yumuşak değişir, kapı ve bitiş kontrolleri burada
    const tick = useCallback((frame) => {
        'worklet';
        if (!running.value) return;
        const dt = Math.min((frame.timeSincePreviousFrame ?? 16) / 1000, 0.05);
        speed.value += (targetSpeed.value - speed.value) * Math.min(1, dt * 5);
        distance.value += speed.value * dt;
        rivalDistance.value += rivalSpeed.value * dt;

        if (gateActive.value && distance.value >= gateDistance.value) {
            gateActive.value = false;
            runOnJS(gatePassedJS)();
        }
        if (distance.value >= finishDistance.value) {
            running.value = false;
            runOnJS(finishJS)('won');
        } else if (rivalDistance.value >= finishDistance.value) {
            running.value = false;
            runOnJS(finishJS)('lost');
        }
    }, []);
    useFrameCallback(tick, true);

    // Yarışı hazırla ve 3-2-1 geri sayımı başlat
    useEffect(() => {
        if (!metrics || status !== 'countdown') return;
        const m = metrics;
        clearTimers();
        running.value = false;
        distance.value = 0;
        rivalDistance.value = 0;
        speed.value = 0;
        targetSpeed.value = m.baseSpeed;
        rivalSpeed.value = m.baseSpeed * rivalFactor(level);
        finishDistance.value = m.spawnDistance * GATES_TO_FINISH;
        laneRef.current = 1;
        setLane(1);
        laneX.value = m.laneCenters[1];
        setGate(null);
        setPrevGate(null);
        setCountdown(3);

        [2, 1, 0].forEach((n, i) => later(() => setCountdown(n), (i + 1) * 700));
        later(() => {
            setStatus('playing');
            running.value = true;
            spawnGate();
        }, 2800);
        return clearTimers;
    }, [status, layout, level]);

    // Oyun sonu: ödülleri hesapla ve kaydet
    useEffect(() => {
        if (status !== 'won' && status !== 'lost') return;
        const won = status === 'won';
        const bonusScore = won ? 100 + level * 10 : 0;
        const bonusCoins = won ? 5 + level : 0;
        const finalScore = score + bonusScore;
        const finalCoins = coins + bonusCoins;

        setReward({ score: bonusScore, coins: bonusCoins });
        setScore(finalScore);
        setCoins(finalCoins);
        saveUserData({ username, coins: finalCoins });
        updateLeaderboard(username, finalScore);
        saveGameResult({
            timestamp: Date.now(),
            username,
            topic: TOPICS[config.type] || 'Çarpma',
            score: finalScore,
            correct: correctCount,
            wrong: wrongCount,
        });
    }, [status]);

    useEffect(() => {
        playBackgroundMusic();
        return () => {
            clearTimers();
            running.value = false;
            pauseBackgroundMusic();
        };
    }, []);

    // Web'de ok tuşlarıyla da sürülebilsin
    useEffect(() => {
        if (Platform.OS !== 'web') return;
        const onKey = (e) => {
            if (e.key === 'ArrowLeft') moveToLane(laneRef.current - 1);
            if (e.key === 'ArrowRight') moveToLane(laneRef.current + 1);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    });

    // Skor, klasik yarıştaki gibi oturum boyunca birikir
    const restart = (nextLevel) => {
        setStreak(0);
        setCorrectCount(0);
        setWrongCount(0);
        if (nextLevel) setLevel((l) => l + 1);
        setStatus('countdown');
    };

    const playerStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: laneX.value + shake.value }, { rotate: `${tilt.value}deg` }],
    }));

    const flameStyle = useAnimatedStyle(() => ({
        opacity: boost.value,
        transform: [{ scaleY: 0.6 + boost.value * 0.6 }],
    }));

    const carY = metrics ? metrics.carY : 0;
    const rivalStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: carY - (rivalDistance.value - distance.value) }],
    }), [carY]);

    const q = gate?.question;
    const rivalSprite = selectedCar?.id === 5 ? RIVAL_SPRITES.alt : RIVAL_SPRITES.default;
    const playerSprite = CAR_SPRITES[selectedCar?.id] || CAR_SPRITES[1];
    const rivalLane = 2;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.iconText}>←</Text>
                </TouchableOpacity>
                <MiniProgress
                    distance={distance}
                    rivalDistance={rivalDistance}
                    finishDistance={finishDistance}
                    playerSprite={playerSprite}
                    rivalSprite={rivalSprite}
                />
                <View style={styles.coinBox}>
                    <Text style={styles.coinText}>🪙 {coins}</Text>
                </View>
                <TouchableOpacity style={styles.iconButton} onPress={toggleMusic}>
                    <Text style={styles.iconText}>{isMusicPlaying ? '🔊' : '🔇'}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.playArea} onLayout={(e) => setLayout(e.nativeEvent.layout)}>
                {metrics && (
                    <>
                        <ScrollingRoad
                            distance={distance}
                            width={layout.width}
                            height={layout.height}
                            roadLeft={metrics.roadLeft}
                            roadWidth={metrics.roadWidth}
                            lanes={LANES}
                        />

                        {prevGate && (
                            <AnswerGate key={`gate-${prevGate.id}`} gate={prevGate} distance={distance} passY={metrics.carY}
                                roadLeft={metrics.roadLeft} laneWidth={metrics.laneWidth} />
                        )}
                        {gate && (
                            <AnswerGate key={`gate-${gate.id}`} gate={gate} distance={distance} passY={metrics.carY}
                                roadLeft={metrics.roadLeft} laneWidth={metrics.laneWidth} />
                        )}

                        {/* Rakip: kendi şeridinde, mesafe farkına göre ileride/geride görünür */}
                        <Animated.Image
                            source={rivalSprite}
                            style={[styles.car, styles.rival, {
                                left: metrics.laneCenters[rivalLane] - metrics.carW / 2,
                                width: metrics.carW,
                                height: metrics.carH,
                            }, rivalStyle]}
                        />

                        <Animated.View style={[styles.car, { top: metrics.carY, left: -metrics.carW / 2, width: metrics.carW, height: metrics.carH }, playerStyle]}>
                            <Animated.View style={[styles.flame, { width: metrics.carW * 0.5, left: metrics.carW * 0.25, top: metrics.carH - 6 }, flameStyle]} />
                            <Animated.Image source={playerSprite} style={{ width: metrics.carW, height: metrics.carH }} />
                        </Animated.View>

                        {popup && <FloatText key={`popup-${popup.id}`} {...popup} />}

                        {/* Dokunma alanları: şeride dokun, araba oraya geçsin */}
                        <View style={[styles.touchRow, { left: metrics.roadLeft - 40, width: metrics.roadWidth + 80 }]}>
                            {Array.from({ length: LANES }, (_, i) => (
                                <Pressable key={i} style={styles.touchLane} onPressIn={() => moveToLane(i)} />
                            ))}
                        </View>

                        {/* Soru tabelası */}
                        {status === 'playing' && q && (
                            <View pointerEvents="none" style={styles.questionWrap}>
                                <View style={styles.questionPill}>
                                    <Text style={styles.questionText}>
                                        {q.num1} {q.operator} {q.num2} = <Text style={styles.questionMark}>?</Text>
                                    </Text>
                                </View>
                                <Text style={styles.hint}>Doğru cevabın şeridine geç!</Text>
                            </View>
                        )}

                        {status === 'countdown' && (
                            <View pointerEvents="none" style={styles.countdownWrap}>
                                <Text style={styles.countdownText}>{countdown > 0 ? countdown : 'BAŞLA!'}</Text>
                                <Text style={styles.hint}>Şeride dokunarak araba değiştir</Text>
                            </View>
                        )}
                    </>
                )}
            </View>

            {(status === 'won' || status === 'lost') && (
                <GameOverCard
                    status={status}
                    gameMode="race"
                    username={username}
                    score={score}
                    reward={reward}
                    correct={correctCount}
                    wrong={wrongCount}
                    onPrimary={() => restart(status === 'won')}
                    onChangeCar={() => navigation.navigate('CarSelection')}
                    onHome={() => navigation.popToTop()}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E8449',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: '#1E8449',
    },
    miniTrack: {
        flex: 1,
        height: 12,
        marginHorizontal: 8,
        marginRight: 26,
        borderRadius: 6,
        backgroundColor: 'rgba(0, 0, 0, 0.22)',
        justifyContent: 'center',
    },
    miniCar: {
        position: 'absolute',
        left: 0,
        width: 18,
        height: 33,
    },
    miniFlag: {
        position: 'absolute',
        right: -26,
        fontSize: 20,
    },
    iconButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        width: 40,
        height: 40,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: {
        fontSize: 18,
        fontWeight: '700',
    },
    coinBox: {
        backgroundColor: '#FFF',
        borderRadius: 14,
        paddingHorizontal: 10,
        height: 40,
        justifyContent: 'center',
    },
    coinText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#E17055',
    },
    playArea: {
        flex: 1,
        overflow: 'hidden',
    },
    car: {
        position: 'absolute',
        top: 0,
    },
    rival: {
        opacity: 0.9,
    },
    flame: {
        position: 'absolute',
        height: 34,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        backgroundColor: '#FFB300',
        borderWidth: 4,
        borderColor: '#FF6D00',
    },
    floatText: {
        position: 'absolute',
        width: 160,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '800',
        textShadowColor: 'rgba(0, 0, 0, 0.35)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 0,
    },
    touchRow: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        flexDirection: 'row',
    },
    touchLane: {
        flex: 1,
    },
    questionWrap: {
        position: 'absolute',
        top: 12,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    questionPill: {
        backgroundColor: '#FFD93D',
        borderRadius: 22,
        borderWidth: 4,
        borderBottomWidth: 7,
        borderColor: '#E1A100',
        paddingHorizontal: 22,
        paddingVertical: 2,
    },
    questionText: {
        fontSize: 34,
        fontWeight: '800',
        color: '#1976D2',
    },
    questionMark: {
        color: '#2E7D32',
    },
    hint: {
        marginTop: 6,
        fontSize: 14,
        fontWeight: '600',
        color: '#FFF',
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    countdownWrap: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
    },
    countdownText: {
        fontSize: 96,
        fontWeight: '800',
        color: '#FFF',
        textShadowColor: 'rgba(0, 0, 0, 0.35)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 0,
    },
});

export default LaneRaceScreen;
