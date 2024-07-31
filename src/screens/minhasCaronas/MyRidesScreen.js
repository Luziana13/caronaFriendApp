import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Picker, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../../services/apiFetch';
import styles from './styles'; // Importando os estilos

const RideStatus = {
  COMPLETED: 'CONCLUIDA',
  ACTIVE: 'ATIVA',
  IN_PROGRESS: 'ANDAMENTO'
};

const MyRidesScreen = () => {
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState(RideStatus.ACTIVE);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('@App:id');
        setUserId(id);
        fetchRides(id, status);
      } catch (error) {
        console.error('Failed to fetch user ID:', error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchRides(userId, status);
    }
  }, [status]);

  const fetchRides = async (userId, status) => {
    setLoading(true);
    try {
      const response = await apiFetch(`/carona/lista?idPessoa=${userId}&statusCarona=${status}`);
      if (response) {
        setRides(response);
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar as caronas.');
    }
    setLoading(false);
  };

  const renderRideCard = ({ item }) => (
    <View style={styles.rideCard}>
      <Text style={styles.cardTitle}>Vaga: {item.vaga}</Text>
      <Text>Data: {new Date(item.dataCarona).toLocaleString()}</Text>
      <Text>Tipo: {item.tipoCarona}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={status}
        onValueChange={(itemValue) => setStatus(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Concluída" value={RideStatus.COMPLETED} />
        <Picker.Item label="Ativa" value={RideStatus.ACTIVE} />
        <Picker.Item label="Em Andamento" value={RideStatus.IN_PROGRESS} />
      </Picker>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={rides}
          renderItem={renderRideCard}
          keyExtractor={(item) => item.idCarona.toString()}
        />
      )}
    </View>
  );
};

export default MyRidesScreen;
