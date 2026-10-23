import React from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import HotWheelsCar from './HotWheelsCar';
import { HOT_WHEELS_CARS } from '../utils/constants';
import { THEMES } from '../utils/themes';

const RaceTrack = ({
    playerPosition,
    opponentPosition,
    selectedCar,
    playerBoost,
    username,
    shakeAnim,
    themeId,
    gameMode = 'race'
}) => {
    const theme = THEMES[themeId] || THEMES.jungle;
    const env = theme.trackEnvironment;

    return (
        <View style={[styles.trackContainer, {
            backgroundColor: env.colors[0],
            borderColor: env.colors[1]
        }]}>
            <View style={styles.startLine}>
                <Text style={styles.startText}>START</Text>
                <Text style={styles.startFlag}>🏁</Text>
            </View>

            {/* Rakip Lane - Time Trial'da gizle */}
            <View style={[styles.topLane, { backgroundColor: env.laneColor }]}>
                {gameMode === 'race' && (
                    <Animated.View style={[styles.carWrapper, { left: `${opponentPosition}%` }]}>
                        <HotWheelsCar
                            car={{
                                ...HOT_WHEELS_CARS[1],
                                color: '#FF6B9D',
                                secondaryColor: '#C71585',
                                name: 'AI Racer'
                            }}
                            isPlayer={false}
                        />
                        <Text style={styles.carLabel}>AI Rakip</Text>
                    </Animated.View>
                )}
            </View>

            <View style={[styles.centerDivider, { backgroundColor: env.dividerColor }]} />

            {/* Oyuncu Lane */}
            <View style={[styles.bottomLane, { backgroundColor: env.laneColor }]}>
                <Animated.View
                    style={[
                        styles.carWrapper,
                        {
                            left: `${playerPosition}%`,
                            transform: [{ translateX: shakeAnim }],
                        },
                    ]}
                >
                    <HotWheelsCar car={selectedCar} boost={playerBoost} isPlayer={true} />
                    <Text style={styles.carLabel}>{username}</Text>
                </Animated.View>
            </View>

            <View style={styles.finishLine}>
                <Text style={styles.finishFlag}>🏁</Text>
                <Text style={styles.finishText}>FİNİŞ</Text>
                <Text style={styles.finishFlag}>🏁</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    trackContainer: {
        flex: 1,
        borderRadius: 20,
        position: 'relative',
        overflow: 'hidden',
        borderWidth: 6,
    },
    startLine: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 4,
        borderRightColor: '#000',
    },
    startText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        transform: [{ rotate: '90deg' }],
        marginBottom: 10,
    },
    startFlag: {
        fontSize: 32,
    },
    finishLine: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 60,
        backgroundColor: '#FFD700',
        justifyContent: 'center',
        alignItems: 'center',
    },
    finishFlag: {
        fontSize: 28,
    },
    finishText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        transform: [{ rotate: '90deg' }],
        marginTop: 10,
    },
    topLane: {
        position: 'absolute',
        left: 70,
        right: 70,
        top: '28%',
        height: 110,
        borderRadius: 10,
    },
    bottomLane: {
        position: 'absolute',
        left: 70,
        right: 70,
        bottom: '28%',
        height: 110,
        borderRadius: 10,
    },
    centerDivider: {
        position: 'absolute',
        left: 70,
        right: 70,
        top: '50%',
        height: 4,
    },
    carWrapper: {
        position: 'absolute',
        width: 130,
        height: 110,
    },
    carLabel: {
        position: 'absolute',
        bottom: -18,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 11,
        fontWeight: 'bold',
        color: '#FFF',
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
});

export default RaceTrack;
