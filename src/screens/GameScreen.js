import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Animated,
    Dimensions,
    StatusBar,
    SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';

// Components
import TrackBackground from '../components/TrackBackground';
import RaceTrack from '../components/RaceTrack';
import SpeedLines from '../components/SpeedLines';
import TrackDecorations from '../components/TrackDecorations';
import AnimatedCrowd from '../components/AnimatedCrowd';
import RaceProgressBar from '../components/RaceProgressBar';
import PowerUp from '../components/PowerUp';

// Utils
import { QuestionEngine } from '../utils/QuestionEngine';
import { useAudio } from '../utils/audioManager';
import { THEMES } from '../utils/themes';
import { saveUserData, updateLeaderboard, saveGameResult } from '../utils/storage';

const { width } = Dimensions.get('window');

const GameScreen = ({ navigation, route }) => {
    const { username, selectedCar, userCoins, gameMode = 'race', themeId = 'jungle', gameConfig } = route.params;
    const theme = THEMES[themeId] || THEMES.jungle;

    // Game State
    // Use gameConfig.level as base, but game state 'level' might increase in time-trial
    // Actually, gameConfig handles the difficulty type.
    const [currentConfig, setCurrentConfig] = useState(gameConfig || { type: 'multiplication', level: 1 });
    const [question, setQuestion] = useState(QuestionEngine.generate(gameConfig));
    const [playerPosition, setPlayerPosition] = useState(0);
    const [opponentPosition, setOpponentPosition] = useState(0);
    const [score, setScore] = useState(0);
    const [coins, setCoins] = useState(userCoins || 0);
    const [level, setLevel] = useState(1);
    const [gameStatus, setGameStatus] = useState('playing');
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
    const [playerBoost, setPlayerBoost] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    const [reward, setReward] = useState({ score: 0, coins: 0 });

    // Power-Ups State
    const [activePowerUp, setActivePowerUp] = useState(null); // Ekranda beliren (henüz alınmamış)
    const [heldPowerUp, setHeldPowerUp] = useState(null); // Oyuncunun sahip olduğu
    const [aiFrozen, setAiFrozen] = useState(false); // Canavar/Timer dondu mu?

    // Time Trial State
    const [timeLeft, setTimeLeft] = useState(60);

    // Audio
    const {
        playSoundEffect,
        playBackgroundMusic,
        pauseBackgroundMusic,
        toggleMusic,
        isMusicPlaying
    } = useAudio();

    // Animations
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const coinAnim = useRef(new Animated.Value(0)).current;
    const cameraShake = useRef(new Animated.Value(0)).current;
    const cameraZoom = useRef(new Animated.Value(1)).current;

    // Power-up Spawn Logic
    useEffect(() => {
        if (gameStatus === 'playing' && !activePowerUp && Math.random() < 0.3) {
            // %30 şansla power-up belirir (biraz bekledikten sonra)
            const timeout = setTimeout(() => {
                const types = ['shield', 'boost', 'freeze'];
                const randomType = types[Math.floor(Math.random() * types.length)];
                setActivePowerUp(randomType);
            }, Math.random() * 5000 + 3000);
            return () => clearTimeout(timeout);
        }
    }, [gameStatus, activePowerUp, level]); // Level artınca tekrar dene

    useEffect(() => {
        playBackgroundMusic();
        return () => {
            pauseBackgroundMusic();
        };
    }, []);

    // Time Trial Timer
    useEffect(() => {
        if (gameMode === 'time-trial' && gameStatus === 'playing' && !aiFrozen) {
            const interval = setInterval(() => {
                setTimeLeft((prev) => Math.max(prev - 1, 0));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [gameMode, gameStatus, aiFrozen]);

    // Bitiş koşulları (süre doldu / rakip finişe ulaştı)
    useEffect(() => {
        if (gameStatus !== 'playing') return;
        if (gameMode === 'time-trial' && timeLeft === 0) {
            setGameStatus('won');
        } else if (gameMode === 'race' && opponentPosition >= 100) {
            setGameStatus('lost');
        }
    }, [timeLeft, opponentPosition]);

    // Oyun sonu: ödülleri hesapla ve kaydet (tüm bitiş yolları buradan geçer)
    useEffect(() => {
        if (gameStatus === 'playing') return;

        const won = gameStatus === 'won';
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
            topic: currentConfig.type === 'multiplication' ? 'Çarpma' : currentConfig.type === 'division' ? 'Bölme' : 'İleri Çarpma',
            score: finalScore,
            correct: correctCount,
            wrong: wrongCount
        });

        if (won) {
            if (gameMode === 'race') setLevel((prev) => prev + 1);
            Animated.timing(cameraZoom, { toValue: 1.2, duration: 1000, useNativeDriver: true }).start();
        }
    }, [gameStatus]);

    // AI Hareketi
    useEffect(() => {
        if (gameMode === 'race' && gameStatus === 'playing' && !aiFrozen) {
            const interval = setInterval(() => {
                setOpponentPosition((prev) => {
                    let aiSpeed = 1.5 + (level * 0.3);

                    const positionDiff = playerPosition - prev;
                    if (positionDiff > 20) aiSpeed *= 1.5;
                    else if (positionDiff > 10) aiSpeed *= 1.2;
                    else if (positionDiff < -10) aiSpeed *= 0.8;

                    if (selectedCar) {
                        const carSpeedFactor = selectedCar.speed / 10;
                        aiSpeed *= (1 + carSpeedFactor * 0.3);
                    }

                    const randomFactor = 1 + Math.random() * 0.5;
                    aiSpeed *= randomFactor;

                    return Math.min(prev + aiSpeed, 100);
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [gameStatus, level, playerPosition, selectedCar, gameMode, aiFrozen]);

    const resetGame = () => {
        setPlayerPosition(0);
        setOpponentPosition(0);
        setGameStatus('playing');
        setQuestion(QuestionEngine.generate(currentConfig));
        setSelectedAnswer(null);
        setShowFeedback(false);
        setTimeLeft(60);
        setConsecutiveCorrect(0);
        setHeldPowerUp(null);
        setActivePowerUp(null);
        setAiFrozen(false);
        setCorrectCount(0);
        setWrongCount(0);
        cameraZoom.setValue(1);
    };

    const triggerCameraShake = (intensity = 10) => {
        Animated.sequence([
            Animated.timing(cameraShake, { toValue: intensity, duration: 50, useNativeDriver: true }),
            Animated.timing(cameraShake, { toValue: -intensity, duration: 50, useNativeDriver: true }),
            Animated.timing(cameraShake, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    const triggerBoostZoom = () => {
        Animated.sequence([
            Animated.timing(cameraZoom, { toValue: 1.1, duration: 200, useNativeDriver: true }),
            Animated.timing(cameraZoom, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();
    };

    const usePowerUp = () => {
        if (!heldPowerUp) return;

        if (heldPowerUp === 'boost') {
            setPlayerPosition(prev => Math.min(prev + 20, 100)); // Anında 20 birim ileri
            triggerBoostZoom();
            playSoundEffect('boost');
        } else if (heldPowerUp === 'freeze') {
            setAiFrozen(true);
            setTimeout(() => setAiFrozen(false), 5000); // 5 saniye dondur
        }
        // Shield pasif (yanlış cevapta kullanılır)

        if (heldPowerUp !== 'shield') { // Shield hemen tükenmez
            setHeldPowerUp(null);
        }
    };

    const handleAnswer = async (answer) => {
        if (showFeedback) return;

        setSelectedAnswer(answer);
        setShowFeedback(true);

        if (answer === question.correctAnswer) {
            playSoundEffect('correct');

            // Power-up toplama
            if (activePowerUp) {
                setHeldPowerUp(activePowerUp);
                setActivePowerUp(null); // Pistten sil
                playSoundEffect('coin'); // Özel ses eklenebilir
            }

            setConsecutiveCorrect((prev) => prev + 1);
            setCorrectCount((prev) => prev + 1);

            let boost = 12;
            if (consecutiveCorrect > 0) {
                boost += consecutiveCorrect * 1.5;
                boost = Math.min(boost, 25);
            }

            setPlayerBoost(true);
            triggerCameraShake(5);
            triggerBoostZoom();

            setTimeout(() => setPlayerBoost(false), 1000);

            const newPos = playerPosition + boost;
            if (gameMode === 'race' && newPos >= 100) {
                setPlayerPosition(100);
                setGameStatus('won'); // Kayıt oyun sonu effect'inde yapılır
            } else if (gameMode === 'time-trial' && newPos >= 100) {
                setLevel(level + 1); // Tur tamamlandı
                setPlayerPosition(newPos % 100);
            } else {
                setPlayerPosition(newPos);
            }

            updateScoreAndCoins();

        } else {
            // YANLIŞ CEVAP
            if (heldPowerUp === 'shield') {
                // Kalkan korur
                setHeldPowerUp(null); // Kalkan kırılır
                playSoundEffect('boost'); // Kalkan sesi gibi düşünelim
            } else {
                playSoundEffect('wrong');
                setConsecutiveCorrect(0);
                setWrongCount((prev) => prev + 1);
                setPlayerPosition((prev) => Math.max(0, prev - 8));
                triggerCameraShake(15);

                Animated.sequence([
                    Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                    Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
                    Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
                ]).start();
            }
        }

        setTimeout(() => {
            if (gameStatus === 'playing' && (gameMode === 'race' || timeLeft > 0)) {
                setQuestion(QuestionEngine.generate(currentConfig));
                setSelectedAnswer(null);
                setShowFeedback(false);
            }
        }, 1500);
    };

    const updateScoreAndCoins = () => {
        const newScore = score + 10 + consecutiveCorrect * 5;
        const newCoins = coins + 1;
        setScore(newScore);
        setCoins(newCoins);
        playSoundEffect('coin');
        Animated.spring(coinAnim, { toValue: 1, useNativeDriver: true }).start(() => {
            Animated.timing(coinAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
        });
    }

    const coinScale = coinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.5],
    });

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient colors={theme.backgroundColors} style={styles.gradient}>
                <Animated.View style={[
                    styles.gameContainer,
                    {
                        transform: [
                            { translateX: cameraShake },
                            { scale: cameraZoom },
                        ],
                    },
                ]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <Text style={styles.backButtonText}>←</Text>
                        </TouchableOpacity>

                        {/* Power-Up Göstergesi */}
                        {heldPowerUp && (
                            <TouchableOpacity style={styles.powerUpSlot} onPress={usePowerUp}>
                                <Text style={styles.powerUpEmoji}>
                                    {heldPowerUp === 'shield' ? '🛡️' : heldPowerUp === 'boost' ? '🚀' : '❄️'}
                                </Text>
                                <Text style={styles.powerUpLabel}>
                                    {heldPowerUp === 'shield' ? 'Koru' : 'Kullan!'}
                                </Text>
                            </TouchableOpacity>
                        )}

                        {gameMode === 'time-trial' ? (
                            <View style={styles.scoreBox}>
                                <Text style={styles.scoreEmoji}>⏱️</Text>
                                <Text style={[styles.scoreValue, timeLeft < 10 && styles.timerWarning]}>{timeLeft}</Text>
                            </View>
                        ) : (
                            <View style={styles.scoreBox}>
                                <Text style={styles.scoreEmoji}>🏆</Text>
                                <Text style={styles.scoreValue}>{level}</Text>
                            </View>
                        )}

                        <Animated.View style={[styles.scoreBox, { transform: [{ scale: coinScale }] }]}>
                            <Text style={styles.scoreEmoji}>🪙</Text>
                            <Text style={styles.scoreValue}>{coins}</Text>
                        </Animated.View>

                        <TouchableOpacity style={styles.musicButton} onPress={toggleMusic}>
                            <Text style={styles.musicButtonText}>{isMusicPlaying ? '🔊' : '🔇'}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Yarış Progress Bar */}
                    {gameMode === 'race' && (
                        <RaceProgressBar playerPosition={playerPosition} opponentPosition={opponentPosition} />
                    )}

                    {/* Yarış Alanı */}
                    <View style={styles.raceArea}>
                        <TrackBackground themeId={themeId} />
                        <SpeedLines boost={playerBoost} />
                        <TrackDecorations />

                        {/* Power Up Spawn */}
                        {activePowerUp && (
                            <View style={[styles.activePowerUpContainer, { left: '50%' }]}>
                                <PowerUp type={activePowerUp} />
                            </View>
                        )}

                        <View style={styles.topCrowd}><AnimatedCrowd /></View>

                        <RaceTrack
                            playerPosition={playerPosition}
                            opponentPosition={opponentPosition}
                            selectedCar={selectedCar}
                            playerBoost={playerBoost}
                            username={username}
                            shakeAnim={shakeAnim}
                            themeId={themeId}
                            gameMode={gameMode}
                        />

                        <View style={styles.bottomCrowd}><AnimatedCrowd /></View>
                    </View>

                    {/* Soru Paneli */}
                    <View style={styles.questionPanel}>
                        <LinearGradient colors={['#FFD93D', '#FFF4A3']} style={styles.questionCard}>
                            <View style={styles.questionHeader}>
                                <Text style={styles.questionIcon}>🧮</Text>
                                <Text style={styles.questionTitle}>
                                    {currentConfig.type === 'division' ? 'Bölme Zamanı!' : 'Çarpım Sorusu!'}
                                </Text>
                                <Text style={styles.questionIcon}>🧮</Text>
                            </View>

                            <View style={styles.questionDisplay}>
                                <Text style={styles.questionNumber}>{question.num1}</Text>
                                <Text style={styles.questionOperator}>{question.operator || '×'}</Text>
                                <Text style={styles.questionNumber}>{question.num2}</Text>
                                <Text style={styles.questionOperator}>=</Text>
                                <Text style={styles.questionMark}>?</Text>
                            </View>
                        </LinearGradient>

                        <View style={styles.answersGrid}>
                            {question.answers.map((answer, index) => {
                                const isSelected = selectedAnswer === answer;
                                const isCorrect = answer === question.correctAnswer;
                                const showResult = showFeedback && isSelected;
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.answerButton}
                                        onPress={() => handleAnswer(answer)}
                                        disabled={showFeedback || (gameMode === 'time-trial' && timeLeft === 0)}
                                    >
                                        <LinearGradient
                                            colors={showResult && isCorrect ? ['#4CAF50', '#45B649'] : showResult && !isCorrect ? ['#EF5350', '#E53935'] : ['#FF6B6B', '#FF8E53']}
                                            style={styles.answerGradient}
                                        >
                                            <Text style={styles.answerText}>{answer}</Text>
                                            {showResult && <Text style={styles.answerEmoji}>{isCorrect ? '✅' : '❌'}</Text>}
                                        </LinearGradient>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Oyun Sonu */}
                    {gameStatus !== 'playing' && (
                        <View style={styles.gameOverOverlay}>
                            <LinearGradient colors={gameStatus === 'won' ? ['#FFD93D', '#FF6B6B'] : ['#A8DADC', '#457B9D']} style={styles.gameOverCard}>
                                <Text style={styles.gameOverEmoji}>{gameStatus === 'won' ? '🏆🎉' : '😊💪'}</Text>
                                <Text style={styles.gameOverTitle}>
                                    {gameMode === 'time-trial' ? `Süre Doldu! Skor: ${score}` : (gameStatus === 'won' ? `${username} KAZANDI!` : 'Tekrar Dene!')}
                                </Text>

                                {gameStatus === 'won' && (
                                    <View style={styles.rewardsContainer}>
                                        <View style={styles.rewardItem}><Text style={styles.rewardIcon}>⭐</Text><Text style={styles.rewardValue}>+{reward.score}</Text></View>
                                        <View style={styles.rewardItem}><Text style={styles.rewardIcon}>🪙</Text><Text style={styles.rewardValue}>+{reward.coins}</Text></View>
                                    </View>
                                )}

                                <View style={styles.gameOverButtons}>
                                    <TouchableOpacity style={styles.gameOverButton} onPress={resetGame}>
                                        <LinearGradient colors={['#4ECDC4', '#44A08D']} style={styles.gameOverButtonGradient}>
                                            <Text style={styles.gameOverButtonText}>{gameMode === 'time-trial' ? '🏁 Tekrar Yarış' : (gameStatus === 'won' ? '🏁 Sonraki' : '🔄 Tekrar')}</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.gameOverButton} onPress={() => navigation.navigate('CarSelection')}>
                                        <LinearGradient colors={['#FF6B6B', '#FF8E53']} style={styles.gameOverButtonGradient}>
                                            <Text style={styles.gameOverButtonText}>🏎️ Araba Değiştir</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>
                        </View>
                    )}
                </Animated.View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    gradient: { flex: 1 },
    gameContainer: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    backButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 15,
    },
    backButtonText: { fontSize: 16, fontWeight: 'bold' },
    scoreBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 15,
        gap: 4,
    },
    scoreEmoji: { fontSize: 18 },
    scoreValue: { fontSize: 16, fontWeight: 'bold', color: '#FF6B6B' },
    timerWarning: { color: '#D32F2F', fontWeight: '900' },
    musicButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 15,
    },
    musicButtonText: { fontSize: 20 },
    powerUpSlot: {
        backgroundColor: '#FFF',
        padding: 5,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#FFD700',
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
    },
    powerUpEmoji: { fontSize: 24 },
    powerUpLabel: { fontSize: 10, fontWeight: 'bold' },
    raceArea: { flex: 1, marginHorizontal: 10, marginVertical: 10 },
    topCrowd: { height: 40, marginBottom: 5 },
    bottomCrowd: { height: 40, marginTop: 5 },
    activePowerUpContainer: {
        position: 'absolute',
        top: '40%',
        zIndex: 20,
    },
    questionPanel: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.2,
        elevation: 15,
    },
    questionCard: {
        borderRadius: 20,
        padding: 15,
        marginBottom: 15,
        borderWidth: 4,
        borderColor: '#FFB900',
    },
    questionHeader: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 5 },
    questionIcon: { fontSize: 20 },
    questionTitle: { fontSize: 16, fontWeight: 'bold', color: '#FF6B6B' },
    questionDisplay: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
    questionNumber: { fontSize: 36, fontWeight: 'bold', color: '#1976D2' },
    questionOperator: { fontSize: 32, fontWeight: 'bold', color: '#FF6B6B' },
    questionMark: { fontSize: 36, fontWeight: 'bold', color: '#4CAF50' },
    answersGrid: { flexDirection: 'row', gap: 10 },
    answerButton: {
        flex: 1,
        height: 70,
        borderRadius: 15,
        overflow: 'hidden',
        elevation: 6,
    },
    answerGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    answerText: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
    answerEmoji: { fontSize: 20, marginTop: 4 },
    gameOverOverlay: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center', alignItems: 'center', zIndex: 100,
    },
    gameOverCard: {
        width: width * 0.9, borderRadius: 30, padding: 30, alignItems: 'center',
    },
    gameOverEmoji: { fontSize: 60, marginBottom: 15 },
    gameOverTitle: {
        fontSize: 28, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 20,
    },
    rewardsContainer: { flexDirection: 'row', gap: 20, marginBottom: 25 },
    rewardItem: { alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.3)', padding: 15, borderRadius: 15 },
    rewardIcon: { fontSize: 24, marginBottom: 5 },
    rewardValue: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
    gameOverButtons: { width: '100%', gap: 10 },
    gameOverButton: { borderRadius: 20, overflow: 'hidden' },
    gameOverButtonGradient: { paddingVertical: 14, alignItems: 'center' },
    gameOverButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
});

export default GameScreen;
