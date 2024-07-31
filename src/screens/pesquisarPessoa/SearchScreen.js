import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, Image, Modal, ActivityIndicator, Alert } from 'react-native';
import { apiFetch } from '../../services/apiFetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
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

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await apiFetch(`/pessoa/lista?nome=${query}`);
      setResults(response.listPessoa);
    } catch (error) {
      console.error(error);
      setError(error); 
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (idAmigo) => {
    try {
      await apiFetch(`/amizade/${userId}/${idAmigo}`, {
        method: 'POST',
      });
      Alert.alert('', 'Solicitação de amizade enviada!');
      setError('');
    } catch (error) {
      console.error(error);
      setError(error);
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
      <Icon name="person" size={40} color="#fff" />
    );
  };

  const renderEmptyList = () => {
    return (
      <View style={styles.emptyListContainer}>
        <Text style={styles.emptyListText}>Nenhum resultado encontrado</Text>
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
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Pesquisar pessoas"
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Icon name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorMessage}>{error}</Text>}
      <FlatList
        data={results}
        keyExtractor={(item) => item.idPessoa.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.imageContainer}>
              {renderImage(item.imagem)}
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.nome}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
            <TouchableOpacity
              style={styles.requestButton}
              onPress={() => sendFriendRequest(item.idPessoa)}
            >
              <Text style={styles.requestButtonText}>Solicitar</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={renderEmptyList}
      />
    </View>
  );
};

export default SearchScreen;
