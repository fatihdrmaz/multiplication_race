import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';

export const useAudio = () => {
    const [backgroundMusic, setBackgroundMusic] = useState(null);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const [soundEffects, setSoundEffects] = useState({
        boost: null,
        correct: null,
        wrong: null,
        coin: null,
    });

    useEffect(() => {
        setupAudio();
        loadSoundEffects();
        return () => {
            if (backgroundMusic) {
                backgroundMusic.unloadAsync();
            }
            Object.values(soundEffects).forEach(sound => {
                if (sound) sound.unloadAsync();
            });
        };
    }, []);

    const setupAudio = async () => {
        try {
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
            });
        } catch (error) {
            console.log('Audio setup error:', error);
        }
    };

    const loadSoundEffects = async () => {
        try {
            const [boostSound, correctSound, wrongSound, coinSound] = await Promise.all([
                Audio.Sound.createAsync(require('../../assets/sounds/boost-sound.wav')),
                Audio.Sound.createAsync(require('../../assets/sounds/correct-answer.wav')),
                Audio.Sound.createAsync(require('../../assets/sounds/wrong-answer.mp3')),
                Audio.Sound.createAsync(require('../../assets/sounds/coin-collect.wav')),
            ]);

            setSoundEffects({
                boost: boostSound.sound,
                correct: correctSound.sound,
                wrong: wrongSound.sound,
                coin: coinSound.sound,
            });
        } catch (error) {
            console.log('Sound effects load error:', error);
        }
    };

    const playSoundEffect = async (soundType) => {
        try {
            const sound = soundEffects[soundType];
            if (sound) {
                await sound.replayAsync();
            }
        } catch (error) {
            console.log(`Sound effect ${soundType} error:`, error);
        }
    };

    const playBackgroundMusic = async () => {
        try {
            if (backgroundMusic) {
                await backgroundMusic.playAsync();
                setIsMusicPlaying(true);
            } else {
                const { sound } = await Audio.Sound.createAsync(
                    require('../../assets/sounds/music_zapsplat_astro_race.mp3'),
                    {
                        isLooping: true,
                        volume: 0.3,
                    }
                );
                setBackgroundMusic(sound);
                await sound.playAsync();
                setIsMusicPlaying(true);
            }
        } catch (error) {
            console.log('Music play error:', error);
        }
    };

    const pauseBackgroundMusic = async () => {
        try {
            if (backgroundMusic) {
                await backgroundMusic.pauseAsync();
                setIsMusicPlaying(false);
            }
        } catch (error) {
            console.log('Music pause error:', error);
        }
    };

    const toggleMusic = async () => {
        if (isMusicPlaying) {
            await pauseBackgroundMusic();
        } else {
            await playBackgroundMusic();
        }
    };

    return {
        playSoundEffect,
        playBackgroundMusic,
        pauseBackgroundMusic,
        toggleMusic,
        isMusicPlaying
    };
};
