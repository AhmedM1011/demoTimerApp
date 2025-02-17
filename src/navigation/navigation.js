// Navigation.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddTimerScreen from '../screens/AddTimerScreen';
import HistoryScreen from '../screens/HistoryScreen';

// Import your screens


// Create a stack navigator
const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Home Screen */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Timer App' }} // Customize the header title
        />
        {/* History Screen */}
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: 'Timer History' }} // Customize the header title
        />
        <Stack.Screen
          name="Add Timer"
          component={AddTimerScreen}
          options={{ title: 'Add Timer' }} // Customize the header title
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;