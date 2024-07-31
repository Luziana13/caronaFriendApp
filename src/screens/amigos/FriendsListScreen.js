import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Text, TouchableOpacity, Image, Modal, ActivityIndicator, Alert } from 'react-native';
import { apiFetch } from '../../services/apiFetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import styles from './styles';

const FriendsListScreen = () => {
  const [friends, setFriends] = useState([]);
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

  const fetchFriends = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await apiFetch(`/amizade/amigos/${userId}`);
      setFriends(response.listaAmizade);
      setError('');
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchFriends();
    }, [fetchFriends])
  );

  const handleDelete = async (idAmizade) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza de que deseja excluir esta amizade?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          onPress: async () => {
            setLoading(true);
            try {
              await apiFetch(`/amizade/recusar/${idAmizade}`, {
                method: 'POST',
              });
              Alert.alert('', 'Amizade excluída!');
              setError('');
              fetchFriends();
            } catch (error) {
              console.error(error);
              setError(error.message);
            } finally {
              setLoading(false);
            }
          } 
        },
      ]
    );
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
      <Icon name="person" size={40} color="#fff" />
    );
  };

  const renderEmptyList = () => {
    return (
      <View style={styles.emptyListContainer}>
        <Text style={styles.emptyListText}>Nenhum amigo encontrado</Text>
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
        data={friends}
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
                style={styles.rejectButton}
                onPress={() => handleDelete(item.idAmizade)}
              >
                <Icon name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={renderEmptyList}
      />
    </View>
  );
};

export default FriendsListScreen;
