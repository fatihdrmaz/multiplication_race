import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

export const GATE_HEIGHT = 64;

const LOOKS = {
    idle: { bg: '#FFFFFF', border: '#FF8E53', text: '#2D3436' },
    correct: { bg: '#6BD66F', border: '#2E7D32', text: '#FFFFFF' },
    wrong: { bg: '#FF7B7B', border: '#A82828', text: '#FFFFFF' },
};

// Bir sıra cevap tabelası; gate.distance anında arabanın burnuna ulaşır
const AnswerGate = ({ gate, distance, passY, roadLeft, laneWidth }) => {
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: passY - (gate.distance - distance.value) - GATE_HEIGHT }],
    }), [gate.distance, passY]);

    const passed = gate.chosen !== undefined;

    return (
        <Animated.View pointerEvents="none" style={[styles.row, { left: roadLeft }, animatedStyle]}>
            {gate.answers.map((answer, lane) => {
                const isCorrect = lane === gate.correctLane;
                const state = !passed ? 'idle' : isCorrect ? 'correct' : lane === gate.chosen ? 'wrong' : 'idle';
                const look = LOOKS[state];
                return (
                    <View key={lane} style={[styles.cell, { width: laneWidth }]}>
                        <View style={[styles.sign, { backgroundColor: look.bg, borderColor: look.border, opacity: passed && state === 'idle' ? 0.45 : 1 }]}>
                            <Text style={[styles.answer, { color: look.text }]}>{answer}</Text>
                        </View>
                        <View style={[styles.stripe, { backgroundColor: look.border }]} />
                    </View>
                );
            })}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    row: {
        position: 'absolute',
        top: 0,
        flexDirection: 'row',
        height: GATE_HEIGHT,
    },
    cell: {
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    sign: {
        minWidth: '72%',
        paddingHorizontal: 10,
        height: 46,
        borderRadius: 14,
        borderWidth: 4,
        borderBottomWidth: 7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    answer: {
        fontSize: 26,
        fontWeight: '800',
    },
    stripe: {
        marginTop: 6,
        width: '86%',
        height: 6,
        borderRadius: 3,
        opacity: 0.55,
    },
});

export default AnswerGate;
