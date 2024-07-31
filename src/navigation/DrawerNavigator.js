// src/navigation/DrawerNavigator.js
import React, { useState, useEffect }  from 'react';
import { createDrawerNavigator , DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer';
import { View, Text, Image } from 'react-native';
import styles from './styles';
import { apiFetch } from '../services/apiFetch';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from '../screens/home/HomeScreen';
import SearchScreen from '../screens/pesquisarPessoa/SearchScreen';
import FriendRequestsScreen from '../screens/buscarSolicitacao/FriendRequestsScreen';
import FriendsListScreen from '../screens/amigos/FriendsListScreen';
import HeaderWithLogout from './HeaderWithLogout';
import MapScreen from '../screens/carona/MapScreen';
import SearchMapScreen from '../screens/carona/SearchMapScreen';
import MyRidesScreen from '../screens/minhasCaronas/MyRidesScreen';

const Drawer = createDrawerNavigator();

function CustomDrawer(props) {  
  const [user, setUser] = useState({});
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('@App:id');
      setUserId(id);
      fetchUserData(id);
    };

    const fetchUserData = async (id) => {
      try {
        const response = await apiFetch(`/pessoa/${id}`);
        setUser(response.pessoa);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserId();
  }, []);

  const renderImage = (base64) => {
    if (base64) {
      return (
        <Image 
          source={{ uri: `data:image/png;base64,${base64}` }} 
          style={styles.image} 
        />
      );
    }
    return null;   };



  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        <View style={styles.profileCircle}>
          {renderImage(user.imagem)}
        </View>
        <Text style={styles.text}>{user.nome}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const DrawerNavigator = () => {
  return (
    <View style={{ flex: 1 }}>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => (
          <CustomDrawer {...props}/>
        )} 
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Buscar Amigo" component={SearchScreen} />
        <Drawer.Screen name="Solicitações de amizade" component={FriendRequestsScreen} />
        <Drawer.Screen name="Amigos" component={FriendsListScreen} />
        <Drawer.Screen name="Cadastrar carona" component={MapScreen} />
        <Drawer.Screen name="Buscar carona" component={SearchMapScreen} />
        <Drawer.Screen name="Minhas caronas" component={MyRidesScreen} />

      </Drawer.Navigator>
      <HeaderWithLogout /> 
    </View>
  );
};

export default DrawerNavigator;
