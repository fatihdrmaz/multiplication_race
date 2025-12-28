import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  SafeAreaView,
  TextInput,
  FlatList,
  Modal,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// HOT WHEELS ARABA KOLEKSİYONU
const HOT_WHEELS_CARS = [
  {
    id: 1,
    name: 'Speed Demon',
    emoji: '🏎️',
    color: '#FF0000',
    secondaryColor: '#990000',
    speed: 5,
    unlockCost: 0,
    description: 'Klasik kırmızı yarış arabası',
  },
  {
    id: 2,
    name: 'Blue Lightning',
    emoji: '🚗',
    color: '#0066FF',
    secondaryColor: '#003399',
    speed: 6,
    unlockCost: 50,
    description: 'Mavi şimşek gibi hızlı',
  },
  {
    id: 3,
    name: 'Nitro Beast',
    emoji: '🏁',
    color: '#00FF00',
    secondaryColor: '#009900',
    speed: 7,
    unlockCost: 100,
    description: 'Yeşil nitro canavarı',
  },
  {
    id: 4,
    name: 'Turbo King',
    emoji: '🚙',
    color: '#FFD700',
    secondaryColor: '#FFA500',
    speed: 8,
    unlockCost: 200,
    description: 'Altın turbo kral',
  },
  {
    id: 5,
    name: 'Shadow Racer',
    emoji: '🚕',
    color: '#800080',
    secondaryColor: '#4B0082',
    speed: 9,
    unlockCost: 300,
    description: 'Mor gölge yarışçısı',
  },
  {
    id: 6,
    name: 'Mega Monster',
    emoji: '🚚',
    color: '#FF1493',
    secondaryColor: '#C71585',
    speed: 10,
    unlockCost: 500,
    description: 'Pembe mega canavar',
  },
];

// Çarpım soruları oluşturma
const generateQuestion = (level = 1) => {
  const maxNum = Math.min(5 + level, 10);
  const num1 = Math.floor(Math.random() * maxNum) + 2;
  const num2 = Math.floor(Math.random() * maxNum) + 2;
  const correctAnswer = num1 * num2;
  
  const wrongAnswers = [];
  while (wrongAnswers.length < 2) {
    const offset = Math.floor(Math.random() * 20) - 10;
    const wrong = correctAnswer + offset;
    if (wrong !== correctAnswer && wrong > 0 && !wrongAnswers.includes(wrong)) {
      wrongAnswers.push(wrong);
    }
  }
  
  const allAnswers = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
  
  return { num1, num2, correctAnswer, answers: allAnswers };
};

// SPEED LINES BİLEŞENİ
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

// PARTİKÜL SİSTEMİ
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
  }, [active]);

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

// PARALAKS DAĞLAR
const ParallaxMountains = () => {
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
          <Text style={styles.mountainEmoji}>🏔️</Text>
        </View>
      ))}
    </Animated.View>
  );
};

// GELİŞMİŞ DEKORASYONLAR
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

// YARIŞ PROGRESS BAR
const RaceProgressBar = ({ playerPosition, opponentPosition }) => {
  return (
    <View style={styles.progressBar}>
      <View style={styles.progressTrack}>
        <Animated.View
          style={[styles.progressMarker, { left: `${playerPosition}%` }]}
        >
          <Text style={styles.progressEmoji}>🏎️</Text>
          <Text style={styles.progressLabel}>Sen</Text>
        </Animated.View>
        <Animated.View
          style={[styles.progressMarker, { left: `${opponentPosition}%` }]}
        >
          <Text style={styles.progressEmoji}>🤖</Text>
          <Text style={styles.progressLabel}>AI</Text>
        </Animated.View>
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

// Hot Wheels Araba Bileşeni (GÖLGELİ VERSİYON)
const HotWheelsCar = ({ car, position = 0, boost = false, isPlayer = true }) => {
  const wheelRotate = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(wheelRotate, {
        toValue: 1,
        duration: boost ? 300 : 500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [boost]);

  const wheelSpin = wheelRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={styles.carContainer}>
      {/* Gölge */}
      <View style={styles.carShadow} />
      
      <Animated.View style={[
        styles.hotWheelsCar,
        { transform: [{ translateY: bounceAnim }] }
      ]}>
        {boost && <ParticleSystem active={boost} type="fire" />}
        <ParticleSystem active={true} type="dust" />
        
        <LinearGradient
          colors={[car.color, car.secondaryColor]}
          style={styles.carBody}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View style={[styles.carGlow, { opacity: glowOpacity }]} />
          
          <View style={styles.carWindshield}>
            <Text style={styles.driverEmoji}>{isPlayer ? '😎' : '🤖'}</Text>
          </View>
          
          <View style={styles.carDetails}>
            <View style={styles.carStripe} />
            <Text style={styles.carName}>{car.name}</Text>
          </View>

          <View style={styles.spoiler}>
            <View style={styles.spoilerWing} />
          </View>
        </LinearGradient>
        
        <View style={styles.wheelsRow}>
          <Animated.View style={[styles.carWheel, { transform: [{ rotate: wheelSpin }] }]}>
            <View style={styles.wheelRim}>
              <Text style={styles.rimDetail}>⚙</Text>
            </View>
          </Animated.View>
          <Animated.View style={[styles.carWheel, { transform: [{ rotate: wheelSpin }] }]}>
            <View style={styles.wheelRim}>
              <Text style={styles.rimDetail}>⚙</Text>
            </View>
          </Animated.View>
        </View>

        {boost && (
          <View style={styles.sparkles}>
            <ParticleSystem active={boost} type="spark" />
          </View>
        )}
      </Animated.View>
    </View>
  );
};

// Gelişmiş Pist Bileşeni
const RaceTrack = () => {
  const cloudAnim = useRef(new Animated.Value(0)).current;
  const treeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(cloudAnim, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(treeAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

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
      {/* Paralaks Dağlar */}
      <ParallaxMountains />
      
      {/* Bulutlar */}
      <Animated.View style={[styles.clouds, { transform: [{ translateX: cloudTranslate }] }]}>
        {[...Array(10)].map((_, i) => (
          <Text key={i} style={styles.cloud}>☁️</Text>
        ))}
      </Animated.View>

      {/* Ağaçlar */}
      <Animated.View style={[styles.treesTop, { transform: [{ translateX: treeTranslate }] }]}>
        {[...Array(20)].map((_, i) => (
          <Text key={i} style={styles.tree}>🌳</Text>
        ))}
      </Animated.View>

      <Animated.View style={[styles.treesBottom, { transform: [{ translateX: treeTranslate }] }]}>
        {[...Array(20)].map((_, i) => (
          <Text key={i} style={styles.tree}>🌲</Text>
        ))}
      </Animated.View>
    </View>
  );
};

// Seyirci Bileşeni
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

export default function App() {
  // Oyun Durumu
  const [gameScreen, setGameScreen] = useState('welcome');
  const [username, setUsername] = useState('');
  const [selectedCar, setSelectedCar] = useState(null);
  const [unlockedCars, setUnlockedCars] = useState([1]);
  
  // Oyun State
  const [question, setQuestion] = useState(generateQuestion());
  const [playerPosition, setPlayerPosition] = useState(0);
  const [opponentPosition, setOpponentPosition] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameStatus, setGameStatus] = useState('playing');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [playerBoost, setPlayerBoost] = useState(false);
  
  // Leaderboard
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  // Ses
  const [backgroundMusic, setBackgroundMusic] = useState(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [soundEffects, setSoundEffects] = useState({
    boost: null,
    correct: null,
    wrong: null,
    coin: null,
  });

  // Animasyonlar
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const coinAnim = useRef(new Animated.Value(0)).current;
  const cameraShake = useRef(new Animated.Value(0)).current;
  const cameraZoom = useRef(new Animated.Value(1)).current;

  // Veri yükle
  useEffect(() => {
    loadUserData();
    loadLeaderboard();
    setupAudio();
    loadSoundEffects();
    return () => {
      // Cleanup müzik
      if (backgroundMusic) {
        backgroundMusic.unloadAsync();
      }
      // Cleanup ses efektleri
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

  // Ses efektlerini yükle
  const loadSoundEffects = async () => {
    try {
      const [boostSound, correctSound, wrongSound, coinSound] = await Promise.all([
        Audio.Sound.createAsync(require('./assets/sounds/boost-sound.wav')),
        Audio.Sound.createAsync(require('./assets/sounds/correct-answer.wav')),
        Audio.Sound.createAsync(require('./assets/sounds/wrong-answer.mp3')),
        Audio.Sound.createAsync(require('./assets/sounds/coin-collect.wav')),
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

  // Ses efekti çal
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
          require('./assets/sounds/music_zapsplat_astro_race.mp3'),
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

  useEffect(() => {
    if (gameScreen === 'game' && !isMusicPlaying) {
      playBackgroundMusic();
    }
  }, [gameScreen]);

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        const parsed = JSON.parse(data);
        setUsername(parsed.username || '');
        setCoins(parsed.coins || 0);
        setUnlockedCars(parsed.unlockedCars || [1]);
      }
    } catch (error) {
      console.log('Load error:', error);
    }
  };

  const saveUserData = async (data) => {
    try {
      const existing = await AsyncStorage.getItem('userData');
      const parsed = existing ? JSON.parse(existing) : {};
      const updated = { ...parsed, ...data };
      await AsyncStorage.setItem('userData', JSON.stringify(updated));
    } catch (error) {
      console.log('Save error:', error);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const data = await AsyncStorage.getItem('leaderboard');
      if (data) {
        setLeaderboard(JSON.parse(data));
      }
    } catch (error) {
      console.log('Leaderboard load error:', error);
    }
  };

  const updateLeaderboard = async (newScore) => {
    try {
      const data = await AsyncStorage.getItem('leaderboard');
      let board = data ? JSON.parse(data) : [];
      
      const userIndex = board.findIndex(u => u.username === username);
      if (userIndex >= 0) {
        if (newScore > board[userIndex].score) {
          board[userIndex].score = newScore;
        }
      } else {
        board.push({ username, score: newScore });
      }
      
      board.sort((a, b) => b.score - a.score);
      board = board.slice(0, 10);
      
      await AsyncStorage.setItem('leaderboard', JSON.stringify(board));
      setLeaderboard(board);
    } catch (error) {
      console.log('Leaderboard update error:', error);
    }
  };

  const unlockCar = async (carId) => {
    const car = HOT_WHEELS_CARS.find(c => c.id === carId);
    if (car && coins >= car.unlockCost && !unlockedCars.includes(carId)) {
      const newCoins = coins - car.unlockCost;
      const newUnlocked = [...unlockedCars, carId];
      setCoins(newCoins);
      setUnlockedCars(newUnlocked);
      await saveUserData({ coins: newCoins, unlockedCars: newUnlocked });
    }
  };

  // Kamera shake efekti
  const triggerCameraShake = (intensity = 10) => {
    Animated.sequence([
      Animated.timing(cameraShake, {
        toValue: intensity,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(cameraShake, {
        toValue: -intensity,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(cameraShake, {
        toValue: intensity / 2,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(cameraShake, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Boost zoom efekti
  const triggerBoostZoom = () => {
    Animated.sequence([
      Animated.timing(cameraZoom, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cameraZoom, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Rakip hareketi
  useEffect(() => {
    if (gameStatus === 'playing' && gameScreen === 'game') {
      const interval = setInterval(() => {
        setOpponentPosition((prev) => {
          const newPos = prev + Math.random() * 2 + 1;
          if (newPos >= 100) {
            setGameStatus('lost');
            return 100;
          }
          return newPos;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameStatus, gameScreen]);

  const resetGame = () => {
    setPlayerPosition(0);
    setOpponentPosition(0);
    setGameStatus('playing');
    setQuestion(generateQuestion(level));
    setSelectedAnswer(null);
    setShowFeedback(false);
    cameraZoom.setValue(1);
  };

  const handleAnswer = async (answer) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answer);
    setShowFeedback(true);

    if (answer === question.correctAnswer) {
      // ✅ DOĞRU CEVAP!
      
      // Ses efektleri
      playSoundEffect('correct');
      playSoundEffect('boost');
      
      setConsecutiveCorrect((prev) => prev + 1);
      const boost = 15 + consecutiveCorrect * 2;
      setPlayerBoost(true);
      
      // Kamera efektleri
      triggerCameraShake(5);
      triggerBoostZoom();
      
      setTimeout(() => setPlayerBoost(false), 1000);
      
      setPlayerPosition((prev) => {
        const newPos = prev + boost;
        if (newPos >= 100) {
          setGameStatus('won');
          const finalScore = score + 100 + level * 10;
          const finalCoins = coins + 5 + level;
          setScore(finalScore);
          setCoins(finalCoins);
          setLevel(level + 1);
          
          saveUserData({ username, coins: finalCoins });
          updateLeaderboard(finalScore);
          
          // Kazanma zoom
          Animated.timing(cameraZoom, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }).start();
          
          return 100;
        }
        return newPos;
      });
      
      const newScore = score + 10 + consecutiveCorrect * 5;
      const newCoins = coins + 1;
      setScore(newScore);
      setCoins(newCoins);
      
      // Coin ses efekti
      playSoundEffect('coin');
      
      Animated.spring(coinAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(coinAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
      
    } else {
      // ❌ YANLIŞ CEVAP
      
      // Yanlış cevap sesi
      playSoundEffect('wrong');
      
      setConsecutiveCorrect(0);
      setPlayerPosition((prev) => Math.max(0, prev - 5));
      
      // Yanlış cevap shake
      triggerCameraShake(15);
      
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }

    setTimeout(() => {
      if (gameStatus === 'playing') {
        setQuestion(generateQuestion(level));
        setSelectedAnswer(null);
        setShowFeedback(false);
      }
    }, 1500);
  };

  const coinScale = coinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });

  // HOŞGELDİN EKRANI (değişmedi, aynı kaldı)
  if (gameScreen === 'welcome') {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#FF6B6B', '#FFD93D', '#4ECDC4']} style={styles.gradient}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.gameTitle}>🏎️ VROOM 🏎️</Text>
            <Text style={styles.gameSubtitle}>Hot Wheels Çarpım Yarışı</Text>
            
            <View style={styles.welcomeCard}>
              <Text style={styles.welcomeLabel}>Adını Yaz</Text>
              <TextInput
                style={styles.usernameInput}
                placeholder="Pilot adın..."
                value={username}
                onChangeText={setUsername}
                maxLength={15}
              />
              
              <TouchableOpacity
                style={[styles.startButton, !username && styles.startButtonDisabled]}
                onPress={() => {
                  if (username) {
                    saveUserData({ username });
                    setGameScreen('carSelect');
                  }
                }}
                disabled={!username}
              >
                <LinearGradient
                  colors={username ? ['#4ECDC4', '#44A08D'] : ['#CCC', '#999']}
                  style={styles.startGradient}
                >
                  <Text style={styles.startButtonText}>🏁 Başla</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.leaderboardLinkButton}
                onPress={() => setShowLeaderboard(true)}
              >
                <Text style={styles.leaderboardLinkText}>🏆 Sıralama Tablosu</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.welcomeCars}>
              {HOT_WHEELS_CARS.slice(0, 3).map((car) => (
                <Text key={car.id} style={styles.welcomeCarEmoji}>{car.emoji}</Text>
              ))}
            </View>
          </View>
        </LinearGradient>

        <Modal visible={showLeaderboard} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.leaderboardModal}>
              <Text style={styles.leaderboardTitle}>🏆 En İyi Pilotlar</Text>
              <FlatList
                data={leaderboard}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <View style={styles.leaderboardItem}>
                    <Text style={styles.leaderboardRank}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                    </Text>
                    <Text style={styles.leaderboardName}>{item.username}</Text>
                    <Text style={styles.leaderboardScore}>{item.score} puan</Text>
                  </View>
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyLeaderboard}>Henüz kayıt yok! İlk sen ol! 🚀</Text>
                }
              />
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setShowLeaderboard(false)}
              >
                <Text style={styles.closeModalText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // ARABA SEÇİM EKRANI (değişmedi, aynı kaldı)
  if (gameScreen === 'carSelect') {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#4ECDC4', '#44A08D']} style={styles.gradient}>
          <View style={styles.carSelectContainer}>
            <Text style={styles.carSelectTitle}>🏎️ Arabını Seç</Text>
            <Text style={styles.carSelectCoins}>🪙 {coins} Coin</Text>
            
            <FlatList
              data={HOT_WHEELS_CARS}
              numColumns={2}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                const isUnlocked = unlockedCars.includes(item.id);
                const isSelected = selectedCar?.id === item.id;
                
                return (
                  <TouchableOpacity
                    style={[
                      styles.carCard,
                      isSelected && styles.carCardSelected,
                      !isUnlocked && styles.carCardLocked,
                    ]}
                    onPress={() => {
                      if (isUnlocked) {
                        setSelectedCar(item);
                      } else {
                        unlockCar(item.id);
                      }
                    }}
                  >
                    <LinearGradient
                      colors={[item.color, item.secondaryColor]}
                      style={styles.carCardGradient}
                    >
                      <Text style={styles.carCardEmoji}>{item.emoji}</Text>
                      <Text style={styles.carCardName}>{item.name}</Text>
                      <Text style={styles.carCardSpeed}>⚡ Hız: {item.speed}</Text>
                      
                      {!isUnlocked && (
                        <View style={styles.lockBadge}>
                          <Text style={styles.lockText}>🔒 {item.unlockCost} 🪙</Text>
                        </View>
                      )}
                      
                      {isSelected && (
                        <View style={styles.selectedBadge}>
                          <Text style={styles.selectedText}>✓ Seçildi</Text>
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                );
              }}
            />

            <TouchableOpacity
              style={[styles.raceButton, !selectedCar && styles.raceButtonDisabled]}
              onPress={() => {
                if (selectedCar) {
                  setGameScreen('game');
                  resetGame();
                }
              }}
              disabled={!selectedCar}
            >
              <LinearGradient
                colors={selectedCar ? ['#FF6B6B', '#FF8E53'] : ['#CCC', '#999']}
                style={styles.raceGradient}
              >
                <Text style={styles.raceButtonText}>🏁 Yarışa Başla!</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // OYUN EKRANI (GELİŞMİŞ VERSİYON)
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#87CEEB', '#E0F6FF']} style={styles.gradient}>
        <Animated.View style={[
          styles.gameContainer,
          {
            transform: [
              { translateX: cameraShake },
              { scale: cameraZoom },
            ],
          },
        ]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                pauseBackgroundMusic();
                setGameScreen('carSelect');
              }}
            >
              <Text style={styles.backButtonText}>← Geri</Text>
            </TouchableOpacity>
            
            <View style={styles.scoreBox}>
              <Text style={styles.scoreEmoji}>🏆</Text>
              <Text style={styles.scoreValue}>{level}</Text>
            </View>
            
            <Animated.View style={[styles.scoreBox, { transform: [{ scale: coinScale }] }]}>
              <Text style={styles.scoreEmoji}>🪙</Text>
              <Text style={styles.scoreValue}>{coins}</Text>
            </Animated.View>
            
            <View style={styles.scoreBox}>
              <Text style={styles.scoreEmoji}>⭐</Text>
              <Text style={styles.scoreValue}>{score}</Text>
            </View>

            <TouchableOpacity
              style={styles.musicButton}
              onPress={toggleMusic}
            >
              <Text style={styles.musicButtonText}>
                {isMusicPlaying ? '🔊' : '🔇'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Yarış Progress Bar */}
          <RaceProgressBar 
            playerPosition={playerPosition} 
            opponentPosition={opponentPosition} 
          />

          {/* Yarış Alanı */}
          <View style={styles.raceArea}>
            <RaceTrack />
            <SpeedLines boost={playerBoost} />
            <TrackDecorations />
            
            <View style={styles.topCrowd}>
              <AnimatedCrowd />
            </View>

            <View style={styles.trackContainer}>
              <View style={styles.startLine}>
                <Text style={styles.startText}>START</Text>
                <Text style={styles.startFlag}>🏁</Text>
              </View>

              {/* Rakip Lane */}
              <View style={styles.topLane}>
                <Animated.View style={[styles.carWrapper, { left: `${opponentPosition}%` }]}>
                  <HotWheelsCar
                    car={{ ...selectedCar, color: '#FF6B9D', secondaryColor: '#C71585' }}
                    isPlayer={false}
                  />
                  <Text style={styles.carLabel}>AI Rakip</Text>
                </Animated.View>
              </View>

              <View style={styles.centerDivider} />

              {/* Oyuncu Lane */}
              <View style={styles.bottomLane}>
                <Animated.View
                  style={[
                    styles.carWrapper,
                    {
                      left: `${playerPosition}%`,
                      transform: [{ translateX: shakeAnim }],
                    },
                  ]}
                >
                  <HotWheelsCar car={selectedCar} boost={playerBoost} isPlayer={true} />
                  <Text style={styles.carLabel}>{username}</Text>
                </Animated.View>
              </View>

              <View style={styles.finishLine}>
                <Text style={styles.finishFlag}>🏁</Text>
                <Text style={styles.finishText}>FİNİŞ</Text>
                <Text style={styles.finishFlag}>🏁</Text>
              </View>
            </View>

            <View style={styles.bottomCrowd}>
              <AnimatedCrowd />
            </View>
          </View>

          {/* Soru Paneli */}
          <View style={styles.questionPanel}>
            <LinearGradient colors={['#FFD93D', '#FFF4A3']} style={styles.questionCard}>
              <View style={styles.questionHeader}>
                <Text style={styles.questionIcon}>🧮</Text>
                <Text style={styles.questionTitle}>Çarpım Sorusu!</Text>
                <Text style={styles.questionIcon}>🧮</Text>
              </View>
              
              <View style={styles.questionDisplay}>
                <Text style={styles.questionNumber}>{question.num1}</Text>
                <Text style={styles.questionOperator}>×</Text>
                <Text style={styles.questionNumber}>{question.num2}</Text>
                <Text style={styles.questionOperator}>=</Text>
                <Text style={styles.questionMark}>?</Text>
              </View>
              
              {consecutiveCorrect > 1 && (
                <View style={styles.streakBadge}>
                  <Text style={styles.streakText}>🔥 {consecutiveCorrect} Kombo!</Text>
                </View>
              )}
            </LinearGradient>

            <View style={styles.answersGrid}>
              {question.answers.map((answer, index) => {
                const isSelected = selectedAnswer === answer;
                const isCorrect = answer === question.correctAnswer;
                const showResult = showFeedback && isSelected;
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.answerButton}
                    onPress={() => handleAnswer(answer)}
                    disabled={showFeedback}
                  >
                    <LinearGradient
                      colors={
                        showResult && isCorrect
                          ? ['#4CAF50', '#45B649']
                          : showResult && !isCorrect
                          ? ['#EF5350', '#E53935']
                          : ['#FF6B6B', '#FF8E53']
                      }
                      style={styles.answerGradient}
                    >
                      <Text style={styles.answerText}>{answer}</Text>
                      {showResult && (
                        <Text style={styles.answerEmoji}>{isCorrect ? '✅' : '❌'}</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Oyun Sonu */}
          {gameStatus !== 'playing' && (
            <View style={styles.gameOverOverlay}>
              <LinearGradient
                colors={gameStatus === 'won' ? ['#FFD93D', '#FF6B6B'] : ['#A8DADC', '#457B9D']}
                style={styles.gameOverCard}
              >
                <Text style={styles.gameOverEmoji}>
                  {gameStatus === 'won' ? '🏆🎉' : '😊💪'}
                </Text>
                <Text style={styles.gameOverTitle}>
                  {gameStatus === 'won' ? `${username} KAZANDI!` : 'Tekrar Dene!'}
                </Text>
                
                {gameStatus === 'won' && (
                  <View style={styles.rewardsContainer}>
                    <View style={styles.rewardItem}>
                      <Text style={styles.rewardIcon}>⭐</Text>
                      <Text style={styles.rewardValue}>+{100 + level * 10}</Text>
                    </View>
                    <View style={styles.rewardItem}>
                      <Text style={styles.rewardIcon}>🪙</Text>
                      <Text style={styles.rewardValue}>+{5 + level}</Text>
                    </View>
                  </View>
                )}
                
                <View style={styles.gameOverButtons}>
                  <TouchableOpacity style={styles.gameOverButton} onPress={resetGame}>
                    <LinearGradient colors={['#4ECDC4', '#44A08D']} style={styles.gameOverButtonGradient}>
                      <Text style={styles.gameOverButtonText}>
                        {gameStatus === 'won' ? '🏁 Sonraki' : '🔄 Tekrar'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.gameOverButton}
                    onPress={() => setGameScreen('carSelect')}
                  >
                    <LinearGradient colors={['#FF6B6B', '#FF8E53']} style={styles.gameOverButtonGradient}>
                      <Text style={styles.gameOverButtonText}>🏎️ Araba Değiştir</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          )}
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  gameContainer: {
    flex: 1,
  },

  // Welcome Screen (aynı)
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameTitle: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 5,
    marginBottom: 10,
  },
  gameSubtitle: {
    fontSize: 22,
    color: '#FFF',
    fontWeight: '600',
    marginBottom: 40,
  },
  welcomeCard: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    padding: 30,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  welcomeLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  usernameInput: {
    width: '100%',
    height: 50,
    borderWidth: 3,
    borderColor: '#4ECDC4',
    borderRadius: 15,
    paddingHorizontal: 20,
    fontSize: 18,
    marginBottom: 25,
    backgroundColor: '#F5F5F5',
  },
  startButton: {
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 15,
  },
  startButtonDisabled: {
    opacity: 0.5,
  },
  startGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  leaderboardLinkButton: {
    paddingVertical: 10,
  },
  leaderboardLinkText: {
    fontSize: 16,
    color: '#4ECDC4',
    fontWeight: 'bold',
  },
  welcomeCars: {
    flexDirection: 'row',
    gap: 30,
    marginTop: 40,
  },
  welcomeCarEmoji: {
    fontSize: 48,
  },

  // Car Select Screen (aynı)
  carSelectContainer: {
    flex: 1,
    padding: 20,
  },
  carSelectTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  carSelectCoins: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 20,
  },
  carCard: {
    flex: 1,
    margin: 8,
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  carCardSelected: {
    borderWidth: 4,
    borderColor: '#FFD700',
  },
  carCardLocked: {
    opacity: 0.7,
  },
  carCardGradient: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carCardEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  carCardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  carCardSpeed: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600',
  },
  lockBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  lockText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: 'bold',
  },
  selectedBadge: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: '#FFD700',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
  },
  selectedText: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  raceButton: {
    marginTop: 20,
    borderRadius: 25,
    overflow: 'hidden',
  },
  raceButtonDisabled: {
    opacity: 0.5,
  },
  raceGradient: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  raceButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },

  // Leaderboard Modal (aynı)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaderboardModal: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    padding: 25,
    width: width * 0.9,
    maxHeight: height * 0.7,
  },
  leaderboardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#FF6B6B',
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    marginBottom: 10,
  },
  leaderboardRank: {
    fontSize: 24,
    width: 50,
    fontWeight: 'bold',
  },
  leaderboardName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  leaderboardScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  emptyLeaderboard: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    padding: 40,
  },
  closeModalButton: {
    marginTop: 20,
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  closeModalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },

  // Game Screen - Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  musicButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  musicButtonText: {
    fontSize: 20,
  },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  scoreEmoji: {
    fontSize: 20,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },

  // Progress Bar
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

  // Speed Lines
  speedLinesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  speedLine: {
    position: 'absolute',
    width: 50,
    height: 3,
    backgroundColor: '#FFF',
    borderRadius: 2,
  },

  // Particle System
  particleContainer: {
    position: 'absolute',
    left: -30,
    top: 20,
    width: 100,
    height: 60,
  },
  particle: {
    position: 'absolute',
    fontSize: 16,
  },

  // Paralaks Mountains
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

  // Dekorasyon
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

  // Race Area
  raceArea: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 10,
  },
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
  topCrowd: {
    height: 40,
    marginBottom: 5,
  },
  bottomCrowd: {
    height: 40,
    marginTop: 5,
  },
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

  // Track
  trackContainer: {
    flex: 1,
    backgroundColor: '#2C1810',
    borderRadius: 20,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 6,
    borderColor: '#1A0F0A',
  },
  startLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 4,
    borderRightColor: '#000',
  },
  startText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    transform: [{ rotate: '90deg' }],
    marginBottom: 10,
  },
  startFlag: {
    fontSize: 32,
  },
  finishLine: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 60,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishFlag: {
    fontSize: 28,
  },
  finishText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    transform: [{ rotate: '90deg' }],
    marginTop: 10,
  },
  topLane: {
    position: 'absolute',
    left: 70,
    right: 70,
    top: '28%',
    height: 110,
    backgroundColor: 'rgba(139, 115, 85, 0.4)',
    borderRadius: 10,
  },
  bottomLane: {
    position: 'absolute',
    left: 70,
    right: 70,
    bottom: '28%',
    height: 110,
    backgroundColor: 'rgba(139, 115, 85, 0.4)',
    borderRadius: 10,
  },
  centerDivider: {
    position: 'absolute',
    left: 70,
    right: 70,
    top: '50%',
    height: 4,
    backgroundColor: '#FFD700',
  },
  carWrapper: {
    position: 'absolute',
    width: 130,
    height: 110,
  },
  carLabel: {
    position: 'absolute',
    bottom: -18,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  // Hot Wheels Car
  carContainer: {
    width: 130,
    height: 110,
  },
  carShadow: {
    position: 'absolute',
    bottom: 0,
    left: 15,
    right: 15,
    height: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 50,
    transform: [{ scaleX: 1.2 }],
  },
  hotWheelsCar: {
    width: 130,
    height: 90,
    position: 'relative',
  },
  carBody: {
    position: 'absolute',
    top: 15,
    left: 10,
    right: 10,
    height: 55,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#000',
    overflow: 'hidden',
  },
  carGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  carWindshield: {
    position: 'absolute',
    left: 8,
    top: 8,
    width: 38,
    height: 38,
    backgroundColor: 'rgba(100, 200, 255, 0.6)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  driverEmoji: {
    fontSize: 22,
  },
  carDetails: {
    position: 'absolute',
    right: 8,
    top: 8,
    bottom: 8,
    left: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carStripe: {
    width: '80%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 3,
    marginBottom: 5,
  },
  carName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  spoiler: {
    position: 'absolute',
    right: 5,
    top: 5,
    width: 8,
    height: 45,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  spoilerWing: {
    position: 'absolute',
    top: 0,
    right: -8,
    width: 16,
    height: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
  },
  wheelsRow: {
    position: 'absolute',
    bottom: 2,
    left: 15,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  carWheel: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1a1a1a',
    borderWidth: 4,
    borderColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelRim: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rimDetail: {
    fontSize: 18,
    color: '#CCC',
  },
  sparkles: {
    position: 'absolute',
    bottom: 10,
    left: -15,
  },

  // Question Panel
  questionPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 15,
  },
  questionCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 4,
    borderColor: '#FFB900',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  questionIcon: {
    fontSize: 22,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  questionDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  questionNumber: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  questionOperator: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  questionMark: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  streakBadge: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderRadius: 20,
    alignSelf: 'center',
  },
  streakText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  answersGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  answerButton: {
    flex: 1,
    height: 70,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  answerGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  answerEmoji: {
    fontSize: 22,
    marginTop: 4,
  },

  // Game Over
  gameOverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  gameOverCard: {
    width: width * 0.9,
    borderRadius: 30,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  gameOverEmoji: {
    fontSize: 70,
    marginBottom: 15,
  },
  gameOverTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 20,
  },
  rewardsContainer: {
    flexDirection: 'row',
    gap: 25,
    marginBottom: 25,
  },
  rewardItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 15,
  },
  rewardIcon: {
    fontSize: 30,
    marginBottom: 5,
  },
  rewardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  gameOverButtons: {
    width: '100%',
    gap: 12,
  },
  gameOverButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  gameOverButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  gameOverButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
