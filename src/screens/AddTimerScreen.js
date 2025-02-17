import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';

const AddTimerScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Workout', value: 'Workout' },
    { label: 'Study', value: 'Study' },
    { label: 'Break', value: 'Break' },
  ]);

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
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Duration (seconds)"
        placeholderTextColor="#888" 
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        style={styles.input}
      />

      <View style={styles.pickerContainer}>
        <DropDownPicker
          open={open}
          value={category}
          items={items}
          setOpen={setOpen}
          setValue={setCategory}
          setItems={setItems}
          placeholder="Select Category"
          containerStyle={{ height: 50 }}
          style={styles.picker}
          itemSeparator={<View style={styles.separator} />} // Adding line between items
        />
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
    marginBottom: 10,
  },
  picker: {
    borderColor: '#ccc',
    borderWidth: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
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
