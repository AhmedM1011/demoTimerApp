import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, SectionList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const [timers, setTimers] = useState([]);

  // Load timers when screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadTimers = async () => {
        const storedTimers = JSON.parse(await AsyncStorage.getItem('timers')) || [];
        setTimers(storedTimers);
      };
      loadTimers();
    }, [])
  );

  // Save timers to AsyncStorage whenever they change
  useEffect(() => {
    const saveTimers = async () => {
      await AsyncStorage.setItem('timers', JSON.stringify(timers));
    };
    saveTimers();
  }, [timers]);

  // Start Timer
  const startTimer = (id) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === id ? { ...timer, status: 'Running' } : timer
      )
    );
  };

  // Pause Timer
  const pauseTimer = (id) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === id ? { ...timer, status: 'Paused' } : timer
      )
    );
  };

  // Reset Timer
  const resetTimer = (id) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === id
          ? { ...timer, remaining: timer.duration, status: '' }
          : timer
      )
    );
  };

  // Countdown Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) =>
        prevTimers.map((timer) => {
          if (timer.status === 'Running' && timer.remaining > 0) {
            return { ...timer, remaining: timer.remaining - 1 };
          } else if (timer.status === 'Running' && timer.remaining === 0) {
            saveHistory(timer); // Save to history when completed
            return { ...timer, status: 'Completed' };
          }
          return timer;
        })
      );
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [timers]);

  // Save completed timer to history
  const saveHistory = async (timer) => {
    const currentHistory = JSON.parse(await AsyncStorage.getItem('history')) || [];
    const updatedHistory = [
      ...currentHistory,
      {
        ...timer,
        completionTime: new Date().toISOString(),
      },
    ];
    await AsyncStorage.setItem('history', JSON.stringify(updatedHistory));
  };

  // Group timers by category
  const groupedTimers = timers.reduce((acc, timer) => {
    if (!acc[timer.category]) acc[timer.category] = [];
    acc[timer.category].push(timer);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <SectionList
        sections={Object.keys(groupedTimers).map((category) => ({
          title: category,
          data: groupedTimers[category],
        }))}
        renderItem={({ item }) => (
            <View style={styles.timerCard}>
              <Text style={styles.timerText}>
                {item.name} - <Text style={styles.time}>{item.remaining}s</Text> 
              </Text>
              <Text style={styles.status}>{item.status}</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.button, styles.startButton, item.status === 'Completed' && styles.disabledButton]} 
                  onPress={() => startTimer(item.id)}
                  disabled={item.status === 'Completed'}
                >
                  <Text style={styles.buttonText}>Start</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.pauseButton, item.status === 'Completed' && styles.disabledButton]} 
                  onPress={() => pauseTimer(item.id)}
                  disabled={item.status === 'Completed'}
                >
                  <Text style={styles.buttonText}>Pause</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.resetButton, item.status === 'Completed' && styles.disabledButton]} 
                  onPress={() => resetTimer(item.id)}
                  disabled={item.status === 'Completed'}
                >
                  <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={styles.footerButtons}>
        <TouchableOpacity style={styles.mainButton} onPress={() => navigation.navigate('Add Timer')}>
          <Text style={styles.mainButtonText}>Add Timer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mainButton} onPress={() => navigation.navigate('History')}>
          <Text style={styles.mainButtonText}>History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#F5F5F5' 
  },
  timerCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  time: {
    fontWeight: 'bold',
    color: '#FF5733',
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  pauseButton: {
    backgroundColor: '#FFC107',
  },
  resetButton: {
    backgroundColor: '#FF5733',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 10,
    color: '#333',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  mainButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc', 
    opacity: 0.6,
  },
});

export default HomeScreen;
