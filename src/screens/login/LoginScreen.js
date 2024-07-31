import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';
import { apiFetch } from '../../services/apiFetch';
import styles from './styles';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleSignInPress = async () => {
    if (email.length === 0 || senha.length === 0) {
      setError('Preencha usuário e senha para continuar!');
    } else {
      try {
        const response = await apiFetch('/login', {
          method: 'POST',
          body: JSON.stringify({ email, senha }),
        });

        const { token, idPessoa } = response;

        await AsyncStorage.setItem('@App:token', token);
        await AsyncStorage.setItem('@App:id', idPessoa.toString());

        const resetAction = StackActions.replace('DrawerNavigator');
        navigation.dispatch(resetAction);
      } catch (err) {
        console.log("erro1");
        console.log(err);
        setError(err);
        console.log(error);
      }
    }    
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../../assets/logoapp.png')} style={styles.logo} />
      </View>
      <View style={styles.content}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={[styles.input, error && styles.inputError]}
          mode="outlined" 
          outlineColor="#3b8aad"
          activeOutlineColor="#3b8aad" 
          theme={{ colors: { primary: '#3b8aad', background: 'transparent' } }} 
        />
        <TextInput
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          style={[styles.input, error && styles.inputError]}
          mode="outlined" // Usa o modo com contorno
          outlineColor="#3b8aad" // Cor da borda
          activeOutlineColor="#3b8aad" // Cor da borda quando o campo está ativo
          theme={{ colors: { primary: '#3b8aad', background: 'transparent' } }} // Define o tema
        />
        {(error!= null || error != undefined ) && <Text style={styles.errorMessage}>{error}</Text>}
        <Button mode="contained" onPress={handleSignInPress} style={styles.button}>
          Entrar
        </Button>
        <Button mode="contained" onPress={() => navigation.navigate('SignUp')} style={styles.button}>
          Criar conta grátis
        </Button>
      </View>
    </View>
  );
};

export default LoginScreen;
