import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const AddTimerScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');

  const saveTimer = async () => {
    if (!name || !duration || !category) {
      alert("Please fill all fields");
      return;
    }

    const newTimer = {
      id: Date.now(),
      name,
      duration: parseInt(duration),
      remaining: parseInt(duration),
      category,
      status: 'Paused',
    };

    let timers = await AsyncStorage.getItem('timers');
    timers = timers ? JSON.parse(timers) : [];
    timers.push(newTimer);
    await AsyncStorage.setItem('timers', JSON.stringify(timers));

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Timer</Text>
      
      <TextInput
        placeholder="Timer Name"
        placeholderTextColor="#888" 
        value={name || undefined} 
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Duration (seconds)"
        placeholderTextColor="#888" 
        value={duration || undefined} 
        onChangeText={setDuration}
        keyboardType="numeric"
        style={styles.input}
      />

      <View style={styles.pickerContainer}>
      <Picker
  selectedValue={category}
  onValueChange={setCategory}
  mode="dropdown" // Forces dropdown mode
  style={styles.picker}
  dropdownIconColor="#007BFF"
>
  <Picker.Item label="Select Category" value="" />
  <Picker.Item label="Workout" value="Workout" />
  <Picker.Item label="Study" value="Study" />
  <Picker.Item label="Break" value="Break" />
</Picker>

      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveTimer}>
        <Text style={styles.saveButtonText}>Save Timer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#F5F5F5', 
    justifyContent: 'center' 
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: { 
    height: 50, 
    borderColor: '#ccc', 
    borderWidth: 1, 
    borderRadius: 8, 
    paddingHorizontal: 10, 
    marginBottom: 15, 
    backgroundColor: '#fff',
    color: '#000',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
    marginBottom: 20,
  },
  picker: {
    height: 55,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddTimerScreen;
