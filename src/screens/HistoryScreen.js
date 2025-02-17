import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      const historyData = await AsyncStorage.getItem('history');
      setHistory(historyData ? JSON.parse(historyData) : []);
    };
    loadHistory();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed Timers</Text>

      {history.length === 0 ? (
        <Text style={styles.emptyMessage}>No history available</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text style={styles.timerName}>{item.name}</Text>
              <Text style={styles.time}>
                Completed on: {new Date(item.completionTime).toLocaleString()}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#F5F5F5' 
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 50,
  },
  historyItem: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Shadow for Android
  },
  timerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  time: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
});

export default HistoryScreen;
