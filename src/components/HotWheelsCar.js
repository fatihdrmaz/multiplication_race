import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ParticleSystem from './ParticleSystem';

const HotWheelsCar = ({ car, position = 0, boost = false, isPlayer = true }) => {
    const wheelRotate = useRef(new Animated.Value(0)).current;
    const bounceAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(wheelRotate, {
                toValue: 1,
                duration: boost ? 300 : 500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim, {
                    toValue: -3,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(bounceAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [boost]);

    const wheelSpin = wheelRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const glowOpacity = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.8],
    });

    return (
        <View style={styles.carContainer}>
            {/* Gölge */}
            <View style={styles.carShadow} />

            <Animated.View style={[
                styles.hotWheelsCar,
                { transform: [{ translateY: bounceAnim }] }
            ]}>
                {boost && <ParticleSystem active={boost} type="fire" />}
                <ParticleSystem active={true} type="dust" />

                <LinearGradient
                    colors={[car.color, car.secondaryColor]}
                    style={styles.carBody}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Animated.View style={[styles.carGlow, { opacity: glowOpacity }]} />

                    <View style={styles.carWindshield}>
                        <Text style={styles.driverEmoji}>{isPlayer ? '😎' : '🤖'}</Text>
                    </View>

                    {/* Araba Emojisi - Kimlik için */}
                    <View style={styles.carIdentity}>
                        <Text style={styles.identityEmoji}>{car.emoji}</Text>
                    </View>

                    <View style={styles.carDetails}>
                        <View style={styles.carStripe} />
                        <Text style={styles.carName}>{car.name}</Text>
                    </View>

                    <View style={styles.spoiler}>
                        <View style={styles.spoilerWing} />
                    </View>
                </LinearGradient>

                <View style={styles.wheelsRow}>
                    <Animated.View style={[styles.carWheel, { transform: [{ rotate: wheelSpin }] }]}>
                        <View style={styles.wheelRim}>
                            <Text style={styles.rimDetail}>⚙</Text>
                        </View>
                    </Animated.View>
                    <Animated.View style={[styles.carWheel, { transform: [{ rotate: wheelSpin }] }]}>
                        <View style={styles.wheelRim}>
                            <Text style={styles.rimDetail}>⚙</Text>
                        </View>
                    </Animated.View>
                </View>

                {boost && (
                    <View style={styles.sparkles}>
                        <ParticleSystem active={boost} type="spark" />
                    </View>
                )}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    carContainer: {
        width: 130,
        height: 110,
    },
    carShadow: {
        position: 'absolute',
        bottom: 0,
        left: 15,
        right: 15,
        height: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 50,
        transform: [{ scaleX: 1.2 }],
    },
    hotWheelsCar: {
        width: 130,
        height: 90,
        position: 'relative',
    },
    carBody: {
        position: 'absolute',
        top: 15,
        left: 10,
        right: 10,
        height: 55,
        borderRadius: 12,
        borderWidth: 3,
        borderColor: '#000',
        overflow: 'hidden',
    },
    carGlow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
    },
    carWindshield: {
        position: 'absolute',
        left: 8,
        top: 8,
        width: 38,
        height: 38,
        backgroundColor: 'rgba(100, 200, 255, 0.6)',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000',
    },
    driverEmoji: {
        fontSize: 22,
    },
    carDetails: {
        position: 'absolute',
        right: 8,
        top: 8,
        bottom: 8,
        left: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    carIdentity: {
        position: 'absolute',
        left: 45,
        top: -15,
        zIndex: 10,
    },
    identityEmoji: {
        fontSize: 32,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    carStripe: {
        width: '80%',
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 3,
        marginBottom: 5,
    },
    carName: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#FFF',
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    spoiler: {
        position: 'absolute',
        right: 5,
        top: 5,
        width: 8,
        height: 45,
        backgroundColor: '#000',
        borderRadius: 2,
    },
    spoilerWing: {
        position: 'absolute',
        top: 0,
        right: -8,
        width: 16,
        height: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 8,
    },
    wheelsRow: {
        position: 'absolute',
        bottom: 2,
        left: 15,
        right: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    carWheel: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#1a1a1a',
        borderWidth: 4,
        borderColor: '#444',
        justifyContent: 'center',
        alignItems: 'center',
    },
    wheelRim: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#888',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rimDetail: {
        fontSize: 18,
        color: '#CCC',
    },
    sparkles: {
        position: 'absolute',
        bottom: 10,
        left: -15,
    },
});

export default HotWheelsCar;
