import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';

const AnimatedCrowd = () => {
    const [waveIndex, setWaveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setWaveIndex((prev) => (prev + 1) % 8);
        }, 200);
        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.crowdRow}>
            {[...Array(8)].map((_, i) => (
                <Text
                    key={i}
                    style={[
                        styles.crowdPerson,
                        waveIndex === i && styles.crowdPersonActive,
                    ]}
                >
                    {['🙋', '🙋‍♂️', '🙋‍♀️', '👏', '🎉', '🥳', '👋', '🤩'][i]}
                </Text>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    crowdRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: 12,
        paddingHorizontal: 10,
    },
    crowdPerson: {
        fontSize: 24,
        opacity: 0.7,
    },
    crowdPersonActive: {
        fontSize: 32,
        opacity: 1,
    },
});

export default AnimatedCrowd;
