import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, Text, Dimensions } from 'react-native';
import ParallaxMountains from './ParallaxMountains';
import { THEMES } from '../utils/themes';

const { width } = Dimensions.get('window');

const TrackBackground = ({ themeId = 'jungle' }) => {
    const theme = THEMES[themeId] || THEMES.jungle;
    const cloudAnim = useRef(new Animated.Value(0)).current;
    const treeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(cloudAnim, {
                toValue: 1,
                duration: 20000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        Animated.loop(
            Animated.timing(treeAnim, {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, [themeId]);

    const cloudTranslate = cloudAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -width],
    });

    const treeTranslate = treeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -100],
    });

    return (
        <View style={styles.trackEnvironment}>
            {/* Paralaks Arkaplan (Dağ/Bina vb) */}
            <ParallaxMountains themeId={themeId} />

            {/* Gökyüzü Objeleri (Bulut/Yıldız/Gezegen) */}
            <Animated.View style={[styles.clouds, { transform: [{ translateX: cloudTranslate }] }]}>
                {[...Array(8)].map((_, i) => (
                    <Text key={i} style={styles.cloud}>
                        {theme.items.clouds[i % theme.items.clouds.length]}
                    </Text>
                ))}
            </Animated.View>

            {/* Üst Dekorasyon (Ağaç/Bina/UFO) */}
            <Animated.View style={[styles.treesTop, { transform: [{ translateX: treeTranslate }] }]}>
                {[...Array(15)].map((_, i) => (
                    <Text key={i} style={styles.tree}>
                        {theme.items.topDecor[i % theme.items.topDecor.length]}
                    </Text>
                ))}
            </Animated.View>

            {/* Alt Dekorasyon (Taş/Tabela/Robot) */}
            <Animated.View style={[styles.treesBottom, { transform: [{ translateX: treeTranslate }] }]}>
                {[...Array(15)].map((_, i) => (
                    <Text key={i} style={styles.tree}>
                        {theme.items.bottomDecor[i % theme.items.bottomDecor.length]}
                    </Text>
                ))}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    trackEnvironment: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    clouds: {
        position: 'absolute',
        top: 20,
        flexDirection: 'row',
        gap: 80,
    },
    cloud: {
        fontSize: 32,
        opacity: 0.7,
    },
    treesTop: {
        position: 'absolute',
        top: 50,
        flexDirection: 'row',
        gap: 40,
    },
    treesBottom: {
        position: 'absolute',
        bottom: 50,
        flexDirection: 'row',
        gap: 40,
    },
    tree: {
        fontSize: 28,
    },
});

export default TrackBackground;
