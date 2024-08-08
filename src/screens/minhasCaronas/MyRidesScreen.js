import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity, Modal, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../../services/apiFetch';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons }  from '@expo/vector-icons';
import styles from './styles';
import { format } from 'date-fns';

const RideStatus = {
    COMPLETED: 'CONCLUIDA',
    ACTIVE: 'ATIVA',
    IN_PROGRESS: 'ANDAMENTO',
    CANCELLED: 'CANCELADA'
};

const MyRidesScreen = () => {
    const [status, setStatus] = useState(RideStatus.ACTIVE);
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState('');
    const [expandedRideId, setExpandedRideId] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showInterceptionModal, setShowInterceptionModal] = useState(false);
    const [friendsList, setFriendsList] = useState([]);
    const [selectedRideId, setSelectedRideId] = useState(null);
    const [interceptions, setInterceptions] = useState([]);
    const [expandedInterceptionId, setExpandedInterceptionId] = useState(null);
    const [idCaronaPessoa, setIdCaronaPessoa] = useState('');

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
                setError('');
            }
        } catch (error) {
            console.error(error);
            setError('Falha ao carregar as caronas.');
        }
        setLoading(false);
    };

    const fetchFriendsList = async (idCarona) => {
        try {
            const response = await apiFetch(`/carona/lista/amigos/${idCarona}`);
            setFriendsList(response || []);
        } catch (error) {
            console.error('Failed to fetch friends list:', error);
        }
    };

    const fetchResponsavel = async (idCarona) => {
        try {
            const response = await apiFetch(`/carona/amigosResponsavel/${idCarona}`);
            if (response) {
                setFriendsList([response] || []);
              }
        } catch (error) {
            console.error('Failed amigo responsável:', error);
        }
    };

    const fetchInterceptions = async (idCarona) => {
        setLoading(true);
        try {

            const response = await apiFetch(`/carona/lista/interseccao?idPessoa=${userId}&idCaronaPessoa=${idCarona}`);

            if (response) {
                const peopleMap = {};
                const promises = response.map(async (response) => {

                    const personId = response.idPessoa;

    
                    const personResponse = await apiFetch(`/pessoa/${personId}`);
                    if (personResponse) {
                        peopleMap[response.idCarona] = {
                            nome: personResponse.pessoa.nome,
                            telefone: personResponse.pessoa.telefone,
                        };
                    }
                });

                await Promise.all(promises);

                setInterceptions(response.map(response => ({
                    ...response,
                    person: peopleMap[response.idCarona] || {}
                })));
                setError('');

            }
        } catch (error) {
            console.error('Failed to fetch interceptions:', error);
            setError('Falha ao carregar interseções.');
        }
        setLoading(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'dd/MM/yyyy, HH:mm');
    };

    const handleExpandCard = (idCarona) => {
        setExpandedRideId(expandedRideId === idCarona ? null : idCarona);
    };

    const handleCancelRide = async (idCarona) => {
        try {
            await apiFetch(`/carona/${idCarona}/cancelar`, {
                method: 'POST',
            });
            Alert.alert('', 'Carona cancelada!');
            fetchRides(userId, status);
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao cancelar a carona.');
        }
    };

    const handleCancelVacancy = async (idCarona) => {

        try {
            await apiFetch(`/carona/cancelar-vaga/${idCarona}`, {
                method: 'POST',
            });
            Alert.alert('', 'Carona cancelada!');
            fetchRides(userId, status);
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao cancelar a carona.');
        }

    }

    const handleStartRide = async (idCarona) => {
        try {
            await apiFetch(`/carona/${idCarona}/iniciar`, {
                method: 'POST',
            });
            Alert.alert('', 'Carona iniciada!');
            fetchRides(userId, status);
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao iniciar a carona.');
        }
    };

    const handleCompleteRide = async (idCarona) => {
        try {
            await apiFetch(`/carona/${idCarona}/finalizar`, {
                method: 'POST',
            });
            Alert.alert('', 'Carona finalizada!');
            fetchRides(userId, status);
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao finalizar a carona.');
        }
    };

    const acceptRide = async (idCaronaAmigo, idCaronaPessoa) => {
        try {
            const response = await apiFetch(`/carona/${idCaronaAmigo}/aceitar/${idCaronaPessoa}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                Alert.alert('Sucesso', 'Carona aceita com sucesso!');
                fetchRides(userId, status);
                closeModals();
            } else {
                Alert.alert('Erro', 'Não foi possível aceitar a carona.');
            }
        } catch (error) {
            console.log(error)
            Alert.alert('Erro', 'Houve um erro ao tentar aceitar a carona.');
        }
    };

    const openDetailsModal = (idCarona) => {
        setSelectedRideId(idCarona);
        fetchFriendsList(idCarona);
        setShowDetailsModal(true);
    };

    const openDetailsModalResponsavel = (idCarona) => {
        setSelectedRideId(idCarona);
        fetchResponsavel(idCarona);
        setShowDetailsModal(true);
    };

    const openInterceptionModal = (idCarona) => {
        setSelectedRideId(idCarona);
        fetchInterceptions(idCarona);
        setIdCaronaPessoa(idCarona);
        setShowInterceptionModal(true);
    };

    const closeModals = () => {
        setShowDetailsModal(false);
        setShowInterceptionModal(false);
    };

    const renderRideCard = ({ item }) => {
        const isActive = status === RideStatus.ACTIVE;
        const isInProgress = status === RideStatus.IN_PROGRESS;
        const isAndamento = status === RideStatus.IN_PROGRESS;
        const isComplete = status === RideStatus.COMPLETED;

        const handleDetailsPress = () => {
            if (item.tipoCarona === 'BUSCA' && (isInProgress || isComplete)) {
                openDetailsModalResponsavel(item.idCarona); 
            } else {
                openDetailsModal(item.idCarona);
            }
        };
        return (
            <View style={styles.card}>
                <TouchableOpacity onPress={() => handleExpandCard(item.idCarona)}>
                    <View style={styles.header}>
                        <Text style={styles.cardTitle}>{item.tipoCarona}</Text>
                        <Text style={styles.vagasDisponiveis}>Vagas Disponíveis: {item.vagasDisponivel}</Text>
                        <MaterialIcons
                            name={expandedRideId === item.idCarona ? 'keyboard-arrow-down' : 'keyboard-arrow-left'}
                            size={24}
                            color="#3b8aad"
                        />
                    </View>
                </TouchableOpacity>
                {expandedRideId === item.idCarona && (
                    <View style={styles.expandedContent}>
                        <Text>Vagas Totais: {item.vagasTotais}</Text>
                        <Text>Data: {new Date(item.dataCarona).toLocaleString()}</Text>

                        {isActive && (
                            <View style={styles.buttonsContainer}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => handleCancelRide(item.idCarona)}
                                >
                                    <Text style={styles.buttonText}>Cancelar</Text>
                                </TouchableOpacity>
                                {item.tipoCarona === 'OFERTA'&& (
                                    <TouchableOpacity
                                        style={styles.completeButton}
                                        onPress={() => handleStartRide(item.idCarona)}
                                    >
                                        <Text style={styles.buttonText}>Iniciar</Text>
                                    </TouchableOpacity>
                        )}


                            </View>
                        )}

                        {isAndamento &&  (
                            <View style={styles.buttonsContainer}>
                               {item.tipoCarona === 'BUSCA' &&(
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => handleCancelVacancy(item.idCarona)}
                                >
                                    <Text style={styles.buttonText}>cancelar vaga</Text>
                                </TouchableOpacity>
                            )}
                               
                            <TouchableOpacity
                                style={styles.completeButton}
                                onPress={() => handleCompleteRide(item.idCarona)}
                            >
                                <Text style={styles.buttonText}>Finalizar</Text>
                            </TouchableOpacity>

      
                            </View>
                        )}

                        {isActive && item.tipoCarona === 'BUSCA' && (
                            <TouchableOpacity onPress={() => openInterceptionModal(item.idCarona)}>
                                <Text style={styles.linkText}>Verificar Interceção</Text>
                            </TouchableOpacity>
                        )}

                        {(((isActive && item.tipoCarona === 'OFERTA')  || isInProgress || isComplete)) && (
                            <TouchableOpacity onPress={() => handleDetailsPress(item.idCarona)}>
                                <Text style={styles.linkText}>Ver Detalhes</Text>
                            </TouchableOpacity>
                        )}

                    </View>
                )}
            </View>
        );
    };

    const renderInterceptionCard = ({ item }) => {
        const isExpanded = expandedInterceptionId === item.idCarona;
        const formattedDate = item.dataCarona ? formatDate(item.dataCarona) : '';
        return (
            <View style={styles.card}>
                <TouchableOpacity onPress={() => setExpandedInterceptionId(isExpanded ? null : item.idCarona)}>
                    <View style={styles.header}>
                        <Text style={styles.cardTitle}>{item.tipoCarona}</Text>
                        <Text style={styles.vagasDisponiveis}>Vagas Disponíveis: {item.vagasDisponivel}</Text>
                        <MaterialIcons
                            name={isExpanded ? 'keyboard-arrow-down' : 'keyboard-arrow-left'}
                            size={24}
                            color="#3b8aad"
                        />
                    </View>
                </TouchableOpacity>
                {isExpanded ? (
                    <View style={styles.expandedContent}>
                        <Text>Data: {formattedDate}</Text>
                        <Text>Vagas Totais: {item.vagasTotais}</Text>
                        {item.person ? (
                            <>
                                <Text>Nome: {item.person.nome}</Text>
                                <Text>Telefone: {item.person.telefone}</Text>
                            </>
                        ) : (
                            <ActivityIndicator size="small" color="#3b8aad" />
                        )}

                        <TouchableOpacity
                            style={styles.acceptButton}
                            onPress={() => acceptRide(item.idCarona, idCaronaPessoa)}
                        >
                            <Text style={styles.acceptButtonText}>Aceitar Carona</Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
            </View>
        );
    };


    const renderEmptyList = () => (
        <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>Nenhum dado encontrado</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={status}
                    onValueChange={(itemValue) => setStatus(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Concluída" value={RideStatus.COMPLETED} />
                    <Picker.Item label="Ativa" value={RideStatus.ACTIVE} />
                    <Picker.Item label="Em Andamento" value={RideStatus.IN_PROGRESS} />
                    <Picker.Item label="Cancelada" value={RideStatus.CANCELLED} />
                </Picker>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#3b8aad" />
            ) : (
                <FlatList
                    data={rides}
                    keyExtractor={(item) => item.idCarona.toString()}
                    renderItem={renderRideCard}
                    ListEmptyComponent={renderEmptyList}
                />
            )}
            {error && <Text style={styles.errorMessage}>{error}</Text>}

            {/* Details Modal */}
            <Modal visible={showDetailsModal} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Amigos</Text>
                        <TouchableOpacity style={styles.closeButton} onPress={closeModals}>
                            <MaterialIcons name="close" size={24} color="#ffffff" />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={friendsList}
                        ListEmptyComponent={renderEmptyList}
                        keyExtractor={(item) => item.idPessoa.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.friendItem}>
                                <View style={styles.friendImageContainer}>
                                    {item.imagem ? (
                                        <Image source={{ uri: item.imagem }} style={styles.friendImage} />
                                    ) : (
                                        <MaterialIcons name="person" size={50} color="#3b8aad" />
                                    )}
                                </View>
                                <View style={styles.friendDetails}>
                                    <Text style={styles.friendName}>{item.nome}</Text>
                                    <Text style={styles.friendEmail}>{item.email}</Text>
                                </View>
                            </View>
                        )}
                    />
                </View>
            </Modal>

            {/* Interception Modal */}
            <Modal visible={showInterceptionModal} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Interseções</Text>
                        <TouchableOpacity style={styles.closeButton} onPress={closeModals}>
                            <MaterialIcons name="close" size={24} color="#ffffff" />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={interceptions}
                        keyExtractor={(item) => item.idCarona.toString()}
                        renderItem={renderInterceptionCard}
                        ListEmptyComponent={renderEmptyList}
                    />
                </View>
            </Modal>
        </View>
    );
};

export default MyRidesScreen;
