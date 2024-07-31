import React from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const LogoutScreen = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('@App:token'); // Certifique-se de que a chave está correta
    await AsyncStorage.removeItem('@App:id'); // Certifique-se de que a chave está correta
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    });
  };

  React.useEffect(() => {
    handleLogout();
  }, []);

  return (
    <View>
      <Text>Logging out...</Text>
    </View>
  );
};

export default LogoutScreen;
