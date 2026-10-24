import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import CarSelectionScreen from '../screens/CarSelectionScreen';
import SubjectSelectionScreen from '../screens/SubjectSelectionScreen';
import ParentDashboardScreen from '../screens/ParentDashboardScreen';
import GameScreen from '../screens/GameScreen';
import LaneRaceScreen from '../screens/LaneRaceScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Welcome"
                screenOptions={{
                    headerShown: false,
                    cardStyle: { backgroundColor: 'transparent' },
                    gestureEnabled: false, // Oyun sırasında yanlışlıkla geri gitmeyi engelle
                }}
            >
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="SubjectSelection" component={SubjectSelectionScreen} />
                <Stack.Screen name="ParentDashboard" component={ParentDashboardScreen} />
                <Stack.Screen name="CarSelection" component={CarSelectionScreen} />
                <Stack.Screen name="Game" component={GameScreen} />
                <Stack.Screen name="LaneRace" component={LaneRaceScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
