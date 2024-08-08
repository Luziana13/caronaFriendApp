import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, Image, Modal, ActivityIndicator, Alert } from 'react-native';
import { apiFetch } from '../../services/apiFetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons }  from '@expo/vector-icons';
import styles from './styles';

const FriendRequestsScreen = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('@App:id');
      setUserId(id);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchRequests();
    }
  }, [userId]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await apiFetch(`/amizade/solicitacoes/${userId}`);
      setRequests(response.listaAmizade);
      setError('');
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (idAmizade, action) => {
    setLoading(true);
    try {
      await apiFetch(`/amizade/${action}/${idAmizade}`, {
        method: 'POST',
      });
      Alert.alert('', `Solicitação de amizade ${action === 'aceitar' ? 'aceita' : 'recusada'}!`);
      setError('');
      fetchRequests(); 
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const renderImage = (base64) => {
    if (base64) {
      return (
        <Image 
          source={{ uri: `data:image/png;base64,${base64}` }} 
          style={styles.image} 
        />
      );
    }
    return (
      <MaterialIcons name="person" size={40} color="#fff" />
    );
  };

  const renderEmptyList = () => {
    return (
      <View style={styles.emptyListContainer}>
        <Text style={styles.emptyListText}>Nenhuma solicitação encontrada</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Modal
        transparent={true}
        animationType="none"
        visible={loading}
        onRequestClose={() => {}}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b8aad" />
        </View>
      </Modal>
      {error && <Text style={styles.errorMessage}>{error}</Text>}
      <FlatList
        data={requests}
        keyExtractor={(item) => item.idAmizade.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.imageContainer}>
              {renderImage(item.amigo.imagem)}
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.amigo.nome}</Text>
              <Text style={styles.email}>{item.amigo.email}</Text>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleRequest(item.idAmizade, 'aceitar')}
              >
                <MaterialIcons name="check" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => handleRequest(item.idAmizade, 'recusar')}
              >
                <MaterialIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={renderEmptyList}
      />
    </View>
  );
};

export default FriendRequestsScreen;
