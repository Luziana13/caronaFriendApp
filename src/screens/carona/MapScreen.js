import React, { useState, useEffect, useRef } from 'react';
import { Alert, View, Text, TextInput, Button, Modal, ActivityIndicator, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useAssets } from 'expo-asset';
import Rota from '../../classes/Rota.class';
import * as Location from 'expo-location';
import { apiFetch } from '../../services/apiFetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles.js'; 

const MapScreen = (props) => {
    const { onInitialized } = props;
    const [location, setLocation] = useState(null);
    const [assets] = useAssets([require('../../../assets/index.html')]);
    const [htmlString, setHtmlString] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [rota, setRota] = useState(null);
    const [caronaDate, setCaronaDate] = useState(new Date().toISOString().split('T')[0]);
    const [caronaTime, setCaronaTime] = useState(new Date().toISOString().split('T')[1].split('.')[0]);
    const [vagas, setVagas] = useState('');
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');
    const [webViewKey, setWebViewKey] = useState(0); // Key to force reload
    const webViewRef = useRef(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const id = await AsyncStorage.getItem('@App:id');
                setUserId(id);
            } catch (error) {
                console.error('Failed to fetch user ID:', error);
            }
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                showBlockedAlert();
                return;
            }

            let locationAtual = await Location.getCurrentPositionAsync({});
            const lon = locationAtual.coords.longitude;
            const lat = locationAtual.coords.latitude;
            const coords3857 = [
                (lon * 20037508.34) / 180,
                Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180) * 20037508.34 / 180
            ];
            setLocation(coords3857);
            setLoading(false); // Set loading to false once location is set
        })();
    }, []);

    const showBlockedAlert = () => {
        Alert.alert(
            'Permissão Negada',
            'A permissão para acessar a localização está bloqueada. Por favor, vá para as configurações e habilite a permissão.',
            [{ text: 'OK' }]
        );
    };

    useEffect(() => {
        if (assets && location) {
            fetch(assets[0].localUri || '')
                .then((res) => res.text())
                .then((html) => {
                    const modifiedHtml = html.replace(
                        '<div id="localizacaoAtual">',
                        `<div id="localizacaoAtualizada" data-custom-attribute-longitute="${location[0]}" data-custom-attribute-latitude="${location[1]}">`
                    );
                    setHtmlString(modifiedHtml);
                    if (typeof onInitialized === 'function') {
                        onInitialized(zoomToGeoJSON);
                    }
                });
        }
    }, [assets, location]);

    const zoomToGeoJSON = () => {
        webViewRef.current?.injectJavaScript('window.zoomToGeoJSON(); true');
    };

    const messageHandler = (e) => {
        const rotaJSON = JSON.parse(e.nativeEvent.data);
        console.log(rotaJSON)
        const rota = new Rota(rotaJSON._coordenadaPartida, rotaJSON._coordenadaDestino, rotaJSON._rotaLineString, rotaJSON._polyline);
        setRota(rota);
        setModalVisible(true);
    };



    const handleSave = async () => {
        try {
            const body = {
                idPessoa: userId,
                dataCarona: `${caronaDate}T${caronaTime}`,
                tipoCarona: 'OFERTA',
                vagasTotais: parseInt(vagas, 10),
                rota: {
                    coordenadaPartida: rota.coordenadaPartida,
                    coordenadaDestino: rota.coordenadaDestino,
                    rotaLineString: rota.rotaLineString,
                    polyline: rota.polyline
                }
            }

            const response = await apiFetch('/carona/salvar', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                Alert.alert('Informações salvas!');
                setModalVisible(false);
                zoomToGeoJSON();
                setWebViewKey(prevKey => prevKey + 1); // Force reload WebView
            } else {
                Alert.alert('Erro', 'Falha ao salvar as informações.');
            }
        } catch (error) {
            Alert.alert('Erro', 'Ocorreu um erro ao salvar as informações.');
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        zoomToGeoJSON();
    };

    const handleOpenModal = () => {
        setModalVisible(true);
        zoomToGeoJSON();
    };

    const reloadWebView = () => {
        setWebViewKey(prevKey => prevKey + 1); // Force reload WebView
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!htmlString) {
        return null;
    }

    return (
        <View style={styles.container}>
            <WebView
                key={webViewKey} // Add key to force reload
                ref={(r) => (webViewRef.current = r)}
                injectedJavaScript=''
                source={{ html: htmlString }}
                javaScriptEnabled
                style={styles.webView}
                scrollEnabled={false}
                overScrollMode='never'
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scalesPageToFit={false}
                containerStyle={{ flex: 1 }}
                onMessage={messageHandler}
            />

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.header}>Informações da Carona</Text>
                        <Text>Tipo de Carona: OFERTA</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Data da Carona"
                            value={caronaDate}
                            onChangeText={setCaronaDate}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Hora da Carona"
                            value={caronaTime}
                            onChangeText={setCaronaTime}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Número de Vagas"
                            keyboardType="numeric"
                            value={vagas}
                            onChangeText={setVagas}
                        />
                        <View style={styles.buttonContainer}>
                            <Button title="Salvar" onPress={handleSave} color="#4CAF50" />
                            <Button title="Fechar" onPress={handleCloseModal} color="#f44336" />
                        </View>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity style={styles.floatingButtonDetalhe} onPress={handleOpenModal}>
                <Text style={styles.buttonText}>Detalhes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.floatingButton} onPress={reloadWebView}>
                <Text style={styles.buttonText}>Atualizar</Text>
            </TouchableOpacity>
        </View>
    );
};

export default MapScreen;
