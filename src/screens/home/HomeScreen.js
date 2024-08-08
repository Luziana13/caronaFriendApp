import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../../services/apiFetch';
import styles from './styles';

const HomeScreen = ({ navigation }) => {
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('@App:id');
      setUserId(id);
      fetchUserData(id); // Chama a função para buscar os dados do usuário
    };

    const fetchUserData = async (id) => {
      try {
        const response = await apiFetch(`/pessoa/${id}`);
        setUser(response.pessoa);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    fetchUserId();
  }, []);

  const renderImage = (base64) => {
    if (base64) {
      return (
        <Image 
          source={{ uri: `data:image/png;base64,${base64}` }} 
          style={styles.image} 
        />
      );
    }
    return null;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileCircle}>
          {renderImage(user.imagem)}
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.name}>{user.nome}</Text>
          <Text style={styles.email}>{user.email}</Text>
          {user.telefone && <Text style={styles.phone}>Telefone: {user.telefone}</Text>}
          {user.sexo && <Text style={styles.sexo}>Sexo: {user.sexo}</Text>}
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
