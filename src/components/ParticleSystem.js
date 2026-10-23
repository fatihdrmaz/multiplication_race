import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';

const ParticleSystem = ({ active = false, type = 'dust' }) => {
    const particles = useRef([...Array(12)].map(() => ({
        x: new Animated.Value(0),
        y: new Animated.Value(0),
        opacity: new Animated.Value(1),
        scale: new Animated.Value(1),
    }))).current;

    useEffect(() => {
        if (active) {
            const animations = particles.map((particle) => {
                return Animated.parallel([
                    Animated.timing(particle.x, {
                        toValue: -100 - Math.random() * 50,
                        duration: 800 + Math.random() * 400,
                        easing: Easing.out(Easing.quad),
                        useNativeDriver: true,
                    }),
                    Animated.timing(particle.y, {
                        toValue: (Math.random() - 0.5) * 40,
                        duration: 800 + Math.random() * 400,
                        easing: Easing.out(Easing.quad),
                        useNativeDriver: true,
                    }),
                    Animated.timing(particle.opacity, {
                        toValue: 0,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(particle.scale, {
                        toValue: type === 'spark' ? 0.2 : 1.5,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ]);
            });

            animations.forEach((anim, i) => {
                setTimeout(() => anim.start(() => {
                    particle.x.setValue(0);
                    particle.y.setValue(0);
                    particle.opacity.setValue(1);
                    particle.scale.setValue(1);
                }), i * 100);
            });
        }
    }, [active, type, particles]);

    return (
        <View style={styles.particleContainer}>
            {particles.map((particle, i) => (
                <Animated.Text
                    key={i}
                    style={[
                        styles.particle,
                        {
                            transform: [
                                { translateX: particle.x },
                                { translateY: particle.y },
                                { scale: particle.scale },
                            ],
                            opacity: particle.opacity,
                        },
                    ]}
                >
                    {type === 'spark' ? '✨' : type === 'fire' ? '🔥' : '💨'}
                </Animated.Text>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    particleContainer: {
        position: 'absolute',
        bottom: 5,
        left: 0,
        zIndex: -1,
    },
    particle: {
        position: 'absolute',
        fontSize: 10,
        color: '#FFF',
    },
});

export default ParticleSystem;
