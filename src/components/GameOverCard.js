import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withDelay,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import GameButton from './GameButton';
import Confetti from './Confetti';

// İsabet oranına göre 0-3 yıldız; kaybedilen yarışta en fazla 1
const getStars = (won, accuracy) => {
    let stars = accuracy >= 0.9 ? 3 : accuracy >= 0.7 ? 2 : accuracy > 0 ? 1 : 0;
    return won ? Math.max(stars, 1) : Math.min(stars, 1);
};

const Star = ({ filled, index }) => {
    const scale = useSharedValue(0);

    useEffect(() => {
        scale.value = withDelay(350 + index * 220, withSpring(1, { damping: 7, stiffness: 160 }));
    }, []);

    const style = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }, { rotate: `${(1 - scale.value) * -45}deg` }],
    }));

    return (
        <Animated.Text style={[styles.star, index === 1 && styles.starMiddle, !filled && styles.starEmpty, style]}>
            ⭐
        </Animated.Text>
    );
};

const Stat = ({ icon, label, value }) => (
    <View style={styles.stat}>
        <Text style={styles.statIcon}>{icon}</Text>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const GameOverCard = ({
    status,
    gameMode,
    username,
    score,
    reward,
    correct,
    wrong,
    onPrimary,
    onChangeCar,
    onHome,
}) => {
    const won = status === 'won';
    const total = correct + wrong;
    const accuracy = total > 0 ? correct / total : 0;
    const stars = getStars(won, accuracy);

    const cardScale = useSharedValue(0.7);
    const cardOpacity = useSharedValue(0);
    const heroBounce = useSharedValue(0);

    useEffect(() => {
        cardOpacity.value = withTiming(1, { duration: 200 });
        cardScale.value = withSpring(1, { damping: 11, stiffness: 140 });
        heroBounce.value = withRepeat(
            withSequence(withTiming(-10, { duration: 500 }), withTiming(0, { duration: 500 })),
            -1
        );
    }, []);

    const cardStyle = useAnimatedStyle(() => ({
        opacity: cardOpacity.value,
        transform: [{ scale: cardScale.value }],
    }));

    const heroStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: heroBounce.value }],
    }));

    const title = gameMode === 'time-trial'
        ? 'Süre Doldu!'
        : won ? `Kazandın, ${username}!` : 'Az kaldı!';
    const subtitle = gameMode === 'time-trial'
        ? 'Harika bir tur çıkardın'
        : won ? 'Rakibini geride bıraktın' : 'Bir daha dene, bu sefer yakalarsın';

    return (
        <View style={styles.overlay}>
            {won && <Confetti />}

            <Animated.View style={[styles.card, cardStyle]}>
                <LinearGradient
                    colors={won ? ['#FFD93D', '#FF8E53'] : ['#74B9FF', '#6C5CE7']}
                    style={styles.hero}
                >
                    <Animated.Text style={[styles.heroEmoji, heroStyle]}>{won ? '🏆' : '💪'}</Animated.Text>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                </LinearGradient>

                <View style={styles.body}>
                    <View style={styles.stars}>
                        {[0, 1, 2].map((i) => <Star key={i} index={i} filled={i < stars} />)}
                    </View>

                    <View style={styles.stats}>
                        <Stat icon="✅" label="Doğru" value={correct} />
                        <Stat icon="❌" label="Yanlış" value={wrong} />
                        <Stat icon="🎯" label="İsabet" value={`%${Math.round(accuracy * 100)}`} />
                        <Stat icon="⭐" label="Skor" value={score} />
                    </View>

                    {won && (
                        <View style={styles.rewards}>
                            <Text style={styles.rewardText}>+{reward.score} puan</Text>
                            <View style={styles.rewardDot} />
                            <Text style={styles.rewardText}>+{reward.coins} 🪙</Text>
                        </View>
                    )}

                    <View style={styles.buttons}>
                        <GameButton
                            title={gameMode === 'time-trial' ? '🏁 Tekrar Yarış' : won ? '🏁 Sonraki Yarış' : '🔄 Tekrar Dene'}
                            colors={['#4ECDC4', '#2BAE9F']}
                            lipColor="#1E7F74"
                            size="lg"
                            onPress={onPrimary}
                        />
                        <View style={styles.secondaryRow}>
                            <GameButton
                                title="🏎️ Araba"
                                colors={['#FF8E53', '#FF6B6B']}
                                lipColor="#C94B4B"
                                size="sm"
                                style={styles.secondaryButton}
                                onPress={onChangeCar}
                            />
                            <GameButton
                                title="🏠 Menü"
                                colors={['#A29BFE', '#6C5CE7']}
                                lipColor="#4B3FB5"
                                size="sm"
                                style={styles.secondaryButton}
                                onPress={onHome}
                            />
                        </View>
                    </View>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15, 23, 42, 0.72)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        zIndex: 100,
    },
    card: {
        width: '100%',
        maxWidth: 420,
        borderRadius: 32,
        backgroundColor: '#FFF',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 20,
    },
    hero: {
        alignItems: 'center',
        paddingTop: 24,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    heroEmoji: {
        fontSize: 64,
        marginBottom: 6,
    },
    title: {
        fontSize: 30,
        fontWeight: '700',
        color: '#FFF',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 0,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.92)',
        marginTop: 4,
        textAlign: 'center',
    },
    body: {
        padding: 20,
        gap: 16,
    },
    stars: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: 8,
        marginTop: -6,
    },
    star: {
        fontSize: 40,
    },
    starMiddle: {
        fontSize: 52,
    },
    starEmpty: {
        opacity: 0.18,
    },
    stats: {
        flexDirection: 'row',
        gap: 8,
    },
    stat: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F4F6FB',
        borderRadius: 16,
        paddingVertical: 10,
    },
    statIcon: {
        fontSize: 18,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2D3436',
        marginTop: 2,
    },
    statLabel: {
        fontSize: 12,
        color: '#636E72',
    },
    rewards: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: '#FFF8E1',
        borderRadius: 16,
        paddingVertical: 10,
    },
    rewardText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#E17055',
    },
    rewardDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FDCB6E',
    },
    buttons: {
        gap: 10,
    },
    secondaryRow: {
        flexDirection: 'row',
        gap: 10,
    },
    secondaryButton: {
        flex: 1,
    },
});

export default GameOverCard;
