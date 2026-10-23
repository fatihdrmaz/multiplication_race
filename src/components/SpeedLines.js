import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const SpeedLines = ({ boost = false }) => {
    const lines = useRef([...Array(8)].map(() => new Animated.Value(0))).current;

    useEffect(() => {
        const animations = lines.map((line, i) => {
            return Animated.loop(
                Animated.timing(line, {
                    toValue: 1,
                    duration: boost ? 300 : 600,
                    delay: i * 50,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            );
        });
        animations.forEach(anim => anim.start());
        return () => animations.forEach(anim => anim.stop());
    }, [boost]);

    return (
        <View style={styles.speedLinesContainer}>
            {lines.map((line, i) => {
                const translateX = line.interpolate({
                    inputRange: [0, 1],
                    outputRange: [width, -50],
                });
                return (
                    <Animated.View
                        key={i}
                        style={[
                            styles.speedLine,
                            {
                                top: `${15 + i * 10}%`,
                                transform: [{ translateX }],
                                opacity: boost ? 0.8 : 0.4,
                            },
                        ]}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    speedLinesContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 10,
        pointerEvents: 'none',
    },
    speedLine: {
        position: 'absolute',
        width: 50,
        height: 2,
        backgroundColor: '#FFF',
        borderRadius: 1,
    },
});

export default SpeedLines;
