import AsyncStorage from '@react-native-async-storage/async-storage';

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('@App:token');
    return token;
  } catch (error) {
    console.error('Erro ao obter o token', error);
    return null;
  }
};

export const getUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem('@App:id');
    return userId;
  } catch (error) {
    console.error('Erro ao obter o ID do usuário', error);
    return null;
  }
};
