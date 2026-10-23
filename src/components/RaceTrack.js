import React, { useState } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import Reanimated, { useAnimatedStyle } from 'react-native-reanimated';
import HotWheelsCar from './HotWheelsCar';
import { HOT_WHEELS_CARS } from '../utils/constants';
import { THEMES } from '../utils/themes';
import { useSmoothPosition } from '../utils/useSmoothPosition';

const CAR_WIDTH = 130;
const CAR_HEIGHT = 110;
const LABEL_SPACE = 16; // Arabanın altındaki isim etiketi

// Arabayı şeride sığacak kadar küçültüp 0-100 konumuna göre akıcı şekilde kaydırır
const LaneCar = ({ position, lane, linear, duration, children }) => {
    const progress = useSmoothPosition(position, { linear, duration });

    const scale = lane.height > 0 ? Math.min(1, lane.height / (CAR_HEIGHT + LABEL_SPACE)) : 1;
    const travel = Math.max(lane.width - CAR_WIDTH * scale, 0);
    // scale merkezden uygulandığı için sol kenarı şeridin başına hizala
    const offset = -((1 - scale) * CAR_WIDTH) / 2;
    const top = (lane.height - LABEL_SPACE * scale - CAR_HEIGHT) / 2;

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: offset + (progress.value / 100) * travel },
            { scale },
        ],
    }), [offset, travel, scale]);

    return <Reanimated.View style={[styles.carWrapper, { top }, animatedStyle]}>{children}</Reanimated.View>;
};

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
    const [lane, setLane] = useState({ width: 0, height: 0 });

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
            <View
                style={[styles.topLane, { backgroundColor: env.laneColor }]}
                onLayout={(e) => {
                    const { width, height } = e.nativeEvent.layout;
                    setLane({ width, height });
                }}
            >
                {gameMode === 'race' && (
                    // AI her saniye ilerler; 1 sn'lik doğrusal geçiş kesintisiz sürüş verir
                    <LaneCar position={opponentPosition} lane={lane} linear duration={1000}>
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
                    </LaneCar>
                )}
            </View>

            <View style={[styles.centerDivider, { backgroundColor: env.dividerColor }]} />

            {/* Oyuncu Lane */}
            <View style={[styles.bottomLane, { backgroundColor: env.laneColor }]}>
                <LaneCar position={playerPosition} lane={lane} duration={700}>
                    <Animated.View style={[styles.carInner, { transform: [{ translateX: shakeAnim }] }]}>
                        <HotWheelsCar car={selectedCar} boost={playerBoost} isPlayer={true} />
                        <Text style={styles.carLabel}>{username}</Text>
                    </Animated.View>
                </LaneCar>
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
    // Şeritler pist yüksekliğini paylaşır; kısa ekranlarda çakışmaz
    topLane: {
        position: 'absolute',
        left: 70,
        right: 70,
        top: '5%',
        height: '42%',
        borderRadius: 10,
    },
    bottomLane: {
        position: 'absolute',
        left: 70,
        right: 70,
        bottom: '5%',
        height: '42%',
        borderRadius: 10,
    },
    centerDivider: {
        position: 'absolute',
        left: 70,
        right: 70,
        top: '50%',
        height: 4,
        marginTop: -2,
    },
    carWrapper: {
        position: 'absolute',
        left: 0,
        width: CAR_WIDTH,
        height: CAR_HEIGHT,
    },
    carInner: {
        flex: 1,
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
