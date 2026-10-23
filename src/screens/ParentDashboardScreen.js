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
import { loadGameHistory } from '../utils/storage';

const ParentDashboardScreen = ({ navigation }) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        const data = await loadGameHistory();
        setHistory(data);
    };

    const renderItem = ({ item }) => (
        <View style={styles.historyCard}>
            <View style={styles.cardHeader}>
                <Text style={styles.dateText}>{new Date(item.timestamp).toLocaleDateString()}</Text>
                <Text style={styles.scoreText}>{item.score} Puan</Text>
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.topicText}>Konu: {item.topic}</Text>
                <Text style={styles.statsText}>✅ {item.correct}  ❌ {item.wrong}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Kapat</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Veli Paneli 👨‍👩‍👦</Text>
            </View>

            <View style={styles.statsOverview}>
                <LinearGradient colors={['#6C5CE7', '#a29bfe']} style={styles.statBox}>
                    <Text style={styles.statValue}>{history.length}</Text>
                    <Text style={styles.statLabel}>Toplam Oyun</Text>
                </LinearGradient>
                <LinearGradient colors={['#00b894', '#55efc4']} style={styles.statBox}>
                    <Text style={styles.statValue}>
                        {history.reduce((acc, curr) => acc + (curr.correct || 0), 0)}
                    </Text>
                    <Text style={styles.statLabel}>Toplam Doğru</Text>
                </LinearGradient>
            </View>

            <Text style={styles.sectionTitle}>Son Aktiviteler</Text>
            <FlatList
                data={history}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={<Text style={styles.emptyText}>Henüz kayıtlı oyun yok.</Text>}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    closeButton: { padding: 5 },
    closeButtonText: { color: '#007AFF', fontSize: 16 },
    title: { fontSize: 20, fontWeight: 'bold' },
    statsOverview: {
        flexDirection: 'row',
        padding: 20,
        gap: 15
    },
    statBox: {
        flex: 1,
        padding: 20,
        borderRadius: 15,
        alignItems: 'center'
    },
    statValue: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
    statLabel: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 20,
        marginBottom: 10,
        color: '#333'
    },
    listContent: { paddingHorizontal: 20, paddingBottom: 20 },
    historyCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        elevation: 2
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    dateText: { color: '#888', fontSize: 12 },
    scoreText: { fontWeight: 'bold', color: '#6C5CE7' },
    cardBody: { flexDirection: 'row', justifyContent: 'space-between' },
    topicText: { fontSize: 15, fontWeight: '500' },
    statsText: { fontSize: 14, color: '#555' },
    emptyText: { textAlign: 'center', marginTop: 30, color: '#999' }
});

export default ParentDashboardScreen;
