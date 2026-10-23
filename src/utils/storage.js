import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadUserData = async () => {
    try {
        const data = await AsyncStorage.getItem('userData');
        if (data) {
            return JSON.parse(data);
        }
        return null;
    } catch (error) {
        console.log('Load error:', error);
        return null;
    }
};

export const saveUserData = async (data) => {
    try {
        const existing = await AsyncStorage.getItem('userData');
        const parsed = existing ? JSON.parse(existing) : {};
        const updated = { ...parsed, ...data };
        await AsyncStorage.setItem('userData', JSON.stringify(updated));
        return updated;
    } catch (error) {
        console.log('Save error:', error);
        return null;
    }
};

export const loadLeaderboard = async () => {
    try {
        const data = await AsyncStorage.getItem('leaderboard');
        if (data) {
            return JSON.parse(data);
        }
        return [];
    } catch (error) {
        console.log('Leaderboard load error:', error);
        return [];
    }
};

export const updateLeaderboard = async (username, newScore) => {
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
        return board;
    } catch (error) {
        console.log('Leaderboard update error:', error);
        return [];
    }
};

export const saveGameResult = async (result) => {
    try {
        const history = await loadGameHistory();
        const newHistory = [result, ...history];
        await AsyncStorage.setItem('gameHistory', JSON.stringify(newHistory));
        return newHistory;
    } catch (error) {
        console.log('Save history error:', error);
        return [];
    }
};

export const loadGameHistory = async () => {
    try {
        const data = await AsyncStorage.getItem('gameHistory');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.log('Load history error:', error);
        return [];
    }
};
