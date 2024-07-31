import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { StackActions } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../../services/apiFetch';
import { Picker } from '@react-native-picker/picker';
import styles from './styles';
import { MaterialIcons } from '@expo/vector-icons';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [sexo, setSexo] = useState('');
  const [nome, setNome] = useState('');
  const [imagem, setImagem] = useState(null);
  const [error, setError] = useState('');
  const [errorFields, setErrorFields] = useState({});

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Desculpe, precisamos de permissão para acessar a galeria!');
      }
    })();
  }, []);

  const handleSignUpPress = async () => {
    const errors = {};
    if (email.length === 0) errors.email = true;
    if (senha.length === 0) errors.senha = true;
    if (confirmarSenha.length === 0) errors.confirmarSenha = true;
    if (telefone.length === 0) errors.telefone = true;
    if (sexo.length === 0) errors.sexo = true;
    if (nome.length === 0) errors.nome = true;

    if (Object.keys(errors).length > 0) {
      setErrorFields(errors);
      setError('Preencha todos os campos obrigatórios para continuar!');
    } else if (senha !== confirmarSenha) {
      setErrorFields({ confirmarSenha: true });
      setError('As senhas não coincidem!');
    } else {
      try {
        let byteArray = null;
        if (imagem) {
          const response = await fetch(imagem);
          const blob = await response.blob();

          const reader = new FileReader();
          reader.readAsArrayBuffer(blob);
          console.log(reader)
          byteArray = await new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(new Uint8Array(reader.result));
            reader.onerror = reject;
          });
        }

        const body = {
          email,
          senha,
          telefone: parseInt(telefone.replace(/\D/g, '')), // Remove todos os caracteres não numéricos
          sexo,
          nome,
          imagem: byteArray ? Array.from(byteArray) : [], // Converte o Uint8Array para array
        };


        let response = await apiFetch('/cadastrar', {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json', // Correção do Content-Type
          },
        });

        // Continue com o login se o cadastro for bem-sucedido
        response = await apiFetch('/login', {
          method: 'POST',
          body: JSON.stringify({ email, senha }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const { token, idPessoa } = await response;

        await AsyncStorage.setItem('@App:token', token);
        await AsyncStorage.setItem('@App:id', idPessoa.toString());

        const resetAction = StackActions.replace('DrawerNavigator');
        navigation.dispatch(resetAction);
      } catch (err) {
        console.log(err);
        setError(err)
      }
    }
  };

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImagem(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Cadastro</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={handlePickImage} style={styles.imagePicker}>
          {imagem ? (
            <Image source={{ uri: imagem }} style={styles.image} />
          ) : (
            <Text style={styles.imagePlaceholder}>Carregar Imagem</Text>
          )}
        </TouchableOpacity>
        <TextInput
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
          style={[styles.input, styles.inputTopRounded, errorFields.nome && styles.inputError]}
          mode="outlined"
          outlineColor="#3b8aad"
          activeOutlineColor="#3b8aad"
          theme={{ colors: { primary: '#3b8aad', background: 'transparent' } }}
    /*  */    />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={[styles.input, styles.inputTopRounded, errorFields.email && styles.inputError]}
          keyboardType="email-address"
          mode="outlined"
          outlineColor="#3b8aad"
          activeOutlineColor="#3b8aad"
          theme={{ colors: { primary: '#3b8aad', background: 'transparent' } }}
        />
        <TextInput
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={true}
          style={[styles.input, styles.inputTopRounded, errorFields.senha && styles.inputError]}
          mode="outlined"
          outlineColor="#3b8aad"
          activeOutlineColor="#3b8aad"
          theme={{ colors: { primary: '#3b8aad', background: 'transparent' } }}
        />
        <TextInput
          placeholder="Confirmar Senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry={true}
          style={[styles.input, styles.inputTopRounded, errorFields.confirmarSenha && styles.inputError]}
          mode="outlined"
          outlineColor="#3b8aad"
          activeOutlineColor="#3b8aad"
          theme={{ colors: { primary: '#3b8aad', background: 'transparent' } }}
        />
        <TextInput
          placeholder="Celular"
          value={telefone}
          onChangeText={setTelefone}
          style={[styles.input, styles.inputTopRounded, errorFields.telefone && styles.inputError]}
          keyboardType="phone-pad"
          mode="outlined"
          outlineColor="#3b8aad"
          activeOutlineColor="#3b8aad"
          theme={{ colors: { primary: '#3b8aad', background: 'transparent' } }}
        />
        <View style={[styles.pickerContainer, styles.inputTopRounded, errorFields.sexo && styles.inputError]}>
          <Picker
            selectedValue={sexo}
            onValueChange={(itemValue) => setSexo(itemValue)}
            style={styles.picker}
            mode="dropdown"
          >
            <Picker.Item label="Selecione o sexo" value="" />
            <Picker.Item label="Feminino" value="Feminino" />
            <Picker.Item label="Masculino" value="Masculino" />
            <Picker.Item label="Outro" value="Outro" />
          </Picker>
        </View>
        {error && <Text style={styles.errorMessage}>{error}</Text>}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleSignUpPress} style={styles.button}>
          Cadastrar
        </Button>
      </View>
    </View>
  );
};

export default SignUpScreen;
