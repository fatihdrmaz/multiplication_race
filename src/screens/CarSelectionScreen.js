import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HOT_WHEELS_CARS } from '../utils/constants';
import { loadUserData, saveUserData } from '../utils/storage';
import GameButton from '../components/GameButton';

const CarSelectionScreen = ({ navigation, route }) => {
    const { username, gameMode, themeId, gameConfig } = route.params || {};
    const [selectedCar, setSelectedCar] = useState(null);
    const [unlockedCars, setUnlockedCars] = useState([1]);
    const [coins, setCoins] = useState(0);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await loadUserData();
        if (data) {
            setCoins(data.coins || 0);
            setUnlockedCars(data.unlockedCars || [1]);
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

    const handleRaceStart = () => {
        if (selectedCar) {
            navigation.navigate('Game', {
                username,
                selectedCar,
                userCoins: coins,
                gameMode,
                themeId,
                gameConfig
            });
        }
    };

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

                    <GameButton
                        title="🏁 Yarışa Başla!"
                        size="lg"
                        disabled={!selectedCar}
                        onPress={handleRaceStart}
                        style={styles.raceButton}
                    />
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
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
    },
});

export default CarSelectionScreen;
