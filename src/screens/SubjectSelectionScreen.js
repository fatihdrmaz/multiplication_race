import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const SUBJECTS = [
    {
        id: 'multiplication',
        title: 'Çarpma',
        emoji: '✖️',
        description: 'Klasik çarpım tablosu',
        colors: ['#FFD93D', '#FF6B6B'],
        levels: [
            { id: 1, name: 'Seviye 1', desc: 'Basit (2-5)', config: { type: 'multiplication', level: 1 } },
            { id: 2, name: 'Seviye 2', desc: 'Orta (2-9)', config: { type: 'multiplication', level: 2 } },
            { id: 3, name: 'Seviye 3', desc: 'Zor (Karışık)', config: { type: 'multiplication', level: 3 } }
        ]
    },
    {
        id: 'division',
        title: 'Bölme',
        emoji: '➗',
        description: 'Bölme işlemleri',
        colors: ['#4ECDC4', '#45B7D1'],
        levels: [
            { id: 1, name: 'Başlangıç', desc: 'Tam Bölünenler', config: { type: 'division', level: 1 } },
            { id: 2, name: 'Usta', desc: 'Karışık', config: { type: 'division', level: 2 } }
        ]
    },
    {
        id: 'advanced_mult',
        title: 'İleri Çarpma',
        emoji: '🧠',
        description: '2 Basamaklı sayılar',
        colors: ['#A8DADC', '#1D3557'],
        levels: [
            { id: 1, name: 'Giriş', desc: 'Kolay 2 Basamak', config: { type: 'advanced_mult', level: 1 } },
            { id: 2, name: 'Profesör', desc: 'Zor 2 Basamak', config: { type: 'advanced_mult', level: 2 } }
        ]
    }
];

const SubjectSelectionScreen = ({ navigation, route }) => {
    const { username, gameMode, themeId } = route.params;
    const [selectedSubject, setSelectedSubject] = useState(null);

    const handleLevelSelect = (levelConfig) => {
        navigation.navigate('CarSelection', {
            username,
            gameMode,
            themeId,
            gameConfig: levelConfig
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#eee', '#fff']} style={styles.gradient}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Ders Seçimi</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.welcomeText}>Merhaba, {username}! 👋</Text>
                    <Text style={styles.subtitle}>Bugün ne çalışmak istersin?</Text>

                    {SUBJECTS.map((subject) => (
                        <View key={subject.id} style={styles.subjectCardWrapper}>
                            <TouchableOpacity
                                style={styles.subjectCard}
                                onPress={() => setSelectedSubject(selectedSubject === subject.id ? null : subject.id)}
                            >
                                <LinearGradient colors={subject.colors} style={styles.subjectGradient}>
                                    <View style={styles.subjectInfo}>
                                        <Text style={styles.subjectEmoji}>{subject.emoji}</Text>
                                        <View>
                                            <Text style={styles.subjectTitle}>{subject.title}</Text>
                                            <Text style={styles.subjectDesc}>{subject.description}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.expandIcon}>{selectedSubject === subject.id ? '🔼' : '🔽'}</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            {selectedSubject === subject.id && (
                                <View style={styles.levelsContainer}>
                                    {subject.levels.map((lvl) => (
                                        <TouchableOpacity
                                            key={lvl.id}
                                            style={styles.levelButton}
                                            onPress={() => handleLevelSelect(lvl.config)}
                                        >
                                            <Text style={styles.levelName}>{lvl.name}</Text>
                                            <Text style={styles.levelDesc}>{lvl.desc}</Text>
                                            <Text style={styles.playIcon}>▶️</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    gradient: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    backButton: {
        padding: 10,
        backgroundColor: '#FFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        elevation: 2,
    },
    backButtonText: { fontSize: 20, fontWeight: 'bold' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    scrollContent: { padding: 20 },
    welcomeText: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    subtitle: { fontSize: 16, color: '#666', marginBottom: 25 },
    subjectCardWrapper: { marginBottom: 15 },
    subjectCard: {
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
    },
    subjectGradient: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    subjectInfo: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    subjectEmoji: { fontSize: 40 },
    subjectTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
    subjectDesc: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
    expandIcon: { fontSize: 20, color: '#FFF' },
    levelsContainer: {
        backgroundColor: '#FFF',
        marginHorizontal: 10,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        padding: 10,
        elevation: 2,
    },
    levelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    levelName: { fontSize: 16, fontWeight: 'bold', color: '#333', width: 80 },
    levelDesc: { fontSize: 14, color: '#666', flex: 1 },
    playIcon: { fontSize: 18 },
});

export default SubjectSelectionScreen;
