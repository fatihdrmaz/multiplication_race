import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withDelay,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';

const COLORS = ['#FFD93D', '#FF6B6B', '#4ECDC4', '#6C5CE7', '#FF8E53', '#55EFC4'];

const Piece = ({ x, delay, duration, color, size, spin, height }) => {
    const fall = useSharedValue(0);

    useEffect(() => {
        fall.value = withDelay(delay, withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1));
    }, []);

    const style = useAnimatedStyle(() => ({
        transform: [
            { translateY: fall.value * (height + 60) - 40 },
            { translateX: Math.sin(fall.value * Math.PI * 4) * 18 },
            { rotate: `${fall.value * spin}deg` },
        ],
    }));

    return (
        <Animated.View
            style={[styles.piece, { left: x, width: size, height: size * 0.45, backgroundColor: color }, style]}
        />
    );
};

const Confetti = ({ count = 36 }) => {
    const { width, height } = Dimensions.get('window');

    const pieces = useMemo(() => Array.from({ length: count }, (_, i) => ({
        key: i,
        x: Math.random() * width,
        delay: Math.random() * 1500,
        duration: 2600 + Math.random() * 1800,
        color: COLORS[i % COLORS.length],
        size: 8 + Math.random() * 8,
        spin: (Math.random() < 0.5 ? -1 : 1) * (360 + Math.random() * 720),
    })), [count, width]);

    return (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            {pieces.map(({ key, ...p }) => <Piece key={key} {...p} height={height} />)}
        </View>
    );
};

const styles = StyleSheet.create({
    piece: {
        position: 'absolute',
        top: 0,
        borderRadius: 2,
    },
});

export default Confetti;
