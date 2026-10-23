import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';

const TrackDecorations = () => {
    const [wave, setWave] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setWave((prev) => (prev + 1) % 3);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.decorationsContainer}>
            <View style={styles.topDecorations}>
                <Text style={[styles.decoration, wave === 0 && styles.decorationActive]}>🎪</Text>
                <Text style={[styles.decoration, wave === 1 && styles.decorationActive]}>🎡</Text>
                <Text style={[styles.decoration, wave === 2 && styles.decorationActive]}>🎠</Text>
                <Text style={[styles.decoration, wave === 0 && styles.decorationActive]}>🎆</Text>
            </View>
            <View style={styles.bottomDecorations}>
                <Text style={[styles.decoration, wave === 2 && styles.decorationActive]}>📢</Text>
                <Text style={[styles.decoration, wave === 1 && styles.decorationActive]}>💡</Text>
                <Text style={[styles.decoration, wave === 0 && styles.decorationActive]}>🎈</Text>
                <Text style={[styles.decoration, wave === 2 && styles.decorationActive]}>🏁</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    decorationsContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
    },
    topDecorations: {
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    bottomDecorations: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    decoration: {
        fontSize: 24,
        opacity: 0.6,
    },
    decorationActive: {
        fontSize: 32,
        opacity: 1,
    },
});

export default TrackDecorations;
