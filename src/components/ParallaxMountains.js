import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, Text, Dimensions } from 'react-native';
import { THEMES } from '../utils/themes';

const { width } = Dimensions.get('window');

const ParallaxMountains = ({ themeId }) => {
    const theme = THEMES[themeId] || THEMES.jungle;
    const scroll = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(scroll, {
                toValue: 1,
                duration: 15000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const translateX = scroll.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -width * 0.3],
    });

    return (
        <Animated.View style={[styles.mountainsLayer, { transform: [{ translateX }] }]}>
            {[...Array(5)].map((_, i) => (
                <View key={i} style={styles.mountain}>
                    <Text style={styles.mountainEmoji}>{theme.items.mountains}</Text>
                </View>
            ))}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    mountainsLayer: {
        position: 'absolute',
        top: 30,
        left: 0,
        flexDirection: 'row',
        gap: 150,
        opacity: 0.3,
    },
    mountain: {
        alignItems: 'center',
    },
    mountainEmoji: {
        fontSize: 64,
    },
});

export default ParallaxMountains;
