import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    FlatList,
    Modal,
    SafeAreaView,
    Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HOT_WHEELS_CARS } from '../utils/constants';
import { THEMES } from '../utils/themes';
import { saveUserData, loadLeaderboard } from '../utils/storage';
import GameButton from '../components/GameButton';

const { width, height } = Dimensions.get('window');

const GAME_MODES = [
    { id: 'race', name: 'Yarış', emoji: '🏎️' },
    { id: 'time-trial', name: 'Zamana Karşı', emoji: '⏱️' }
];

const WelcomeScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [selectedMode, setSelectedMode] = useState('race');
    const [selectedTheme, setSelectedTheme] = useState('jungle');
    const [leaderboard, setLeaderboard] = useState([]);
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    useEffect(() => {
        loadLeaderboardData();
    }, []);

    const loadLeaderboardData = async () => {
        const data = await loadLeaderboard();
        setLeaderboard(data);
    };

    const handleStart = async () => {
        if (username) {
            await saveUserData({ username });
            await saveUserData({ username });
            navigation.navigate('SubjectSelection', {
                username,
                gameMode: selectedMode,
                themeId: selectedTheme
            });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={THEMES[selectedTheme].backgroundColors} style={styles.gradient}>
                <View style={styles.welcomeContainer}>
                    <Text style={styles.gameTitle}>🏎️ VROOM 🏎️</Text>
                    <Text style={styles.gameSubtitle}>Hot Wheels Çarpım Yarışı</Text>

                    <View style={styles.welcomeCard}>
                        <Text style={styles.welcomeLabel}>Pilot İsmi</Text>
                        <TextInput
                            style={styles.usernameInput}
                            placeholder="Adın..."
                            value={username}
                            onChangeText={setUsername}
                            maxLength={15}
                        />

                        {/* Oyun Modu Seçimi */}
                        <Text style={styles.sectionLabel}>Oyun Modu</Text>
                        <View style={styles.modeSelector}>
                            {GAME_MODES.map((mode) => (
                                <TouchableOpacity
                                    key={mode.id}
                                    style={[
                                        styles.modeButton,
                                        selectedMode === mode.id && styles.modeButtonActive
                                    ]}
                                    onPress={() => setSelectedMode(mode.id)}
                                >
                                    <Text style={styles.modeEmoji}>{mode.emoji}</Text>
                                    <Text style={[
                                        styles.modeText,
                                        selectedMode === mode.id && styles.modeTextActive
                                    ]}>{mode.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Tema Seçimi */}
                        <Text style={styles.sectionLabel}>Yarış Pisti</Text>
                        <View style={styles.themeSelector}>
                            {Object.values(THEMES).map((theme) => (
                                <TouchableOpacity
                                    key={theme.id}
                                    style={[
                                        styles.themeButton,
                                        selectedTheme === theme.id && styles.themeButtonActive
                                    ]}
                                    onPress={() => setSelectedTheme(theme.id)}
                                >
                                    <Text style={styles.themeEmoji}>{theme.emoji}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <GameButton
                            title="🏁 Başla"
                            size="lg"
                            colors={['#4ECDC4', '#2BAE9F']}
                            lipColor="#1E7F74"
                            disabled={!username}
                            onPress={handleStart}
                            style={styles.startButton}
                        />

                        <View style={styles.footerButtons}>
                            <TouchableOpacity
                                style={styles.footerLink}
                                onPress={() => setShowLeaderboard(true)}
                            >
                                <Text style={styles.footerLinkText}>🏆 Sıralama</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.footerLink}
                                onPress={() => navigation.navigate('ParentDashboard')}
                            >
                                <Text style={styles.footerLinkText}>👨‍👩‍👦 Veli Paneli</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </LinearGradient>

            {/* Liderlik Tablosu Modal */}
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
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    welcomeContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    gameTitle: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFF',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 5,
        marginBottom: 5,
    },
    gameSubtitle: {
        fontSize: 18,
        color: '#FFF',
        fontWeight: '600',
        marginBottom: 20,
    },
    welcomeCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 25,
        padding: 25,
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
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666',
        marginTop: 10,
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    usernameInput: {
        width: '100%',
        height: 45,
        borderWidth: 2,
        borderColor: '#4ECDC4',
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#FFF',
    },
    modeSelector: {
        flexDirection: 'row',
        gap: 10,
        width: '100%',
        marginBottom: 5,
    },
    modeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#eee',
        backgroundColor: '#f9f9f9',
    },
    modeButtonActive: {
        borderColor: '#4ECDC4',
        backgroundColor: '#E0F7FA',
    },
    modeEmoji: {
        fontSize: 20,
        marginRight: 5,
    },
    modeText: {
        fontWeight: '600',
        color: '#666',
    },
    modeTextActive: {
        color: '#00796B',
    },
    themeSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 25,
    },
    themeButton: {
        width: 60,
        height: 60,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#eee',
        backgroundColor: '#f9f9f9',
    },
    themeButtonActive: {
        borderColor: '#FFD700',
        backgroundColor: '#FFF8E1',
        transform: [{ scale: 1.1 }],
    },
    themeEmoji: {
        fontSize: 30,
    },
    startButton: {
        width: '100%',
        marginBottom: 15,
    },
    footerButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginTop: 10
    },
    footerLink: {
        paddingVertical: 5,
    },
    footerLinkText: {
        fontSize: 14,
        color: '#4ECDC4',
        fontWeight: 'bold',
    },
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
});

export default WelcomeScreen;
