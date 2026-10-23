import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useSmoothPosition } from '../utils/useSmoothPosition';

const Marker = ({ position, trackWidth, linear, duration, children }) => {
    const progress = useSmoothPosition(position, { linear, duration });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: (progress.value / 100) * trackWidth }],
    }), [trackWidth]);

    return <Animated.View style={[styles.progressMarker, animatedStyle]}>{children}</Animated.View>;
};

const RaceProgressBar = ({ playerPosition, opponentPosition }) => {
    const [trackWidth, setTrackWidth] = useState(0);

    return (
        <View style={styles.progressBar}>
            <View style={styles.progressTrack} onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}>
                <Marker position={playerPosition} trackWidth={trackWidth} duration={700}>
                    <Text style={styles.progressEmoji}>🏎️</Text>
                    <Text style={styles.progressLabel}>Sen</Text>
                </Marker>
                <Marker position={opponentPosition} trackWidth={trackWidth} linear duration={1000}>
                    <Text style={styles.progressEmoji}>🤖</Text>
                    <Text style={styles.progressLabel}>AI</Text>
                </Marker>
                <View style={styles.finishMarker}>
                    <Text style={styles.finishMarkerText}>🏁</Text>
                </View>
            </View>
            <View style={styles.distanceInfo}>
                <Text style={styles.distanceText}>
                    📍 Finişe: {Math.round(100 - playerPosition)}m
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    progressBar: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        marginHorizontal: 10,
        marginVertical: 8,
        borderRadius: 15,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
    },
    progressTrack: {
        height: 40,
        backgroundColor: '#E0E0E0',
        borderRadius: 20,
        position: 'relative',
        overflow: 'visible',
    },
    progressMarker: {
        position: 'absolute',
        top: -5,
        left: 0,
        width: 50,
        height: 50,
        alignItems: 'center',
        marginLeft: -25,
    },
    progressEmoji: {
        fontSize: 28,
    },
    progressLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 2,
    },
    finishMarker: {
        position: 'absolute',
        right: -10,
        top: -5,
        alignItems: 'center',
    },
    finishMarkerText: {
        fontSize: 32,
    },
    distanceInfo: {
        marginTop: 8,
        alignItems: 'center',
    },
    distanceText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FF6B6B',
    },
});

export default RaceProgressBar;
