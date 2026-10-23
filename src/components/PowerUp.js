import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, Text, Easing } from 'react-native';

const POWER_UPS = {
    shield: '🛡️',
    boost: '🚀',
    freeze: '❄️'
};

const PowerUp = ({ type = 'shield', onCollect }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Spawn animation
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
        }).start();

        // Rotate animation loop
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <Animated.View style={[
            styles.container,
            { transform: [{ scale: scaleAnim }, { rotate: spin }] }
        ]}>
            <Text style={styles.emoji}>{POWER_UPS[type] || '❓'}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 50,
        height: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
    },
    emoji: {
        fontSize: 28,
    }
});

export default PowerUp;
