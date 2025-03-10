
import React from 'react';
import { StyleSheet } from 'react-native';
import Navigation from './src/navigation/navigation';
import HomeScreen from './src/screens/HomeScreen';
import AddTimerScreen from './src/screens/AddTimerScreen';

const App = () => {
  return <Navigation/>
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
