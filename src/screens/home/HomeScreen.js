// src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

const HomeScreen = ({ navigation }) => {
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('@App:id');
      setUserId(id);
    };

    fetchUserId();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text>ID do usuário: {userId}</Text>

    </View>
  );
};

export default HomeScreen;
