import React from 'react';
import { Pressable, StyleSheet, Text, View, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const LIP = 6; // Butonun altındaki 3D kenar yüksekliği

const SIZES = {
    sm: { face: { paddingVertical: 10, paddingHorizontal: 16 }, text: { fontSize: 16 } },
    md: { face: { paddingVertical: 14, paddingHorizontal: 20 }, text: { fontSize: 20 } },
    lg: { face: { paddingVertical: 18, paddingHorizontal: 24 }, text: { fontSize: 24 } },
    answer: { face: { height: 72 }, text: { fontSize: 30 } },
};

const GameButton = ({
    title,
    onPress,
    colors = ['#FF8E53', '#FF6B6B'],
    lipColor = '#C94B4B',
    disabled = false,
    size = 'md',
    style,
    children,
}) => {
    const pressed = useSharedValue(0);
    const sizeStyle = SIZES[size] || SIZES.md;

    const faceStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: pressed.value * (LIP - 1) }],
    }));

    const handlePressIn = () => {
        pressed.value = withTiming(1, { duration: 60 });
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handlePressOut = () => {
        pressed.value = withSpring(0, { damping: 12, stiffness: 320 });
    };

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}
            accessibilityRole="button"
            style={[styles.wrapper, disabled && styles.disabled, style]}
        >
            <View style={[styles.lip, { backgroundColor: disabled ? '#9E9E9E' : lipColor }]} />
            <Animated.View style={faceStyle}>
                <LinearGradient
                    colors={disabled ? ['#D6D6D6', '#BDBDBD'] : colors}
                    style={[styles.face, sizeStyle.face]}
                >
                    <View style={styles.shine} />
                    {children ?? <Text style={[styles.title, sizeStyle.text]}>{title}</Text>}
                </LinearGradient>
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        paddingBottom: LIP,
    },
    disabled: {
        opacity: 0.6,
    },
    lip: {
        position: 'absolute',
        top: LIP,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 20,
    },
    face: {
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        overflow: 'hidden',
    },
    shine: {
        position: 'absolute',
        top: 4,
        left: 10,
        right: 10,
        height: '35%',
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.22)',
    },
    title: {
        color: '#FFF',
        fontWeight: '700',
        textShadowColor: 'rgba(0, 0, 0, 0.18)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 0,
    },
});

export default GameButton;
