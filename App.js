import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import DrawerNavigator from './src/navigation/DrawerNavigator';
import AuthLoadingScreen from './src/screens/login/AuthLoadingScreen';
import LoginScreen from './src/screens/login/LoginScreen';
import SignUpScreen from './src/screens/cadastro/SignUpScreen';
import LogoutScreen from './src/screens/logout/LogoutScreen'; // Verifique se o caminho está correto

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="AuthLoading">
          <Stack.Screen 
            name="AuthLoading" 
            component={AuthLoadingScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="DrawerNavigator" 
            component={DrawerNavigator} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="SignUp" 
            component={SignUpScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Logout" 
            component={LogoutScreen} 
            options={{ headerShown: false }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
