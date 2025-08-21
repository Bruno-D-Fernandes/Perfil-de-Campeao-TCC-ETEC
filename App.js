import * as React from 'react'; // arrumar aqui
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Telas

import CadastroScreen from './pastaBolada/screens/CadastroScreen';
import HomeScreen from './pastaBolada/screens/HomeScreen';
import OportunidadesScreen from './pastaBolada/screens/OportunidadesScreen';
import PerfilScreen from './pastaBolada/screens/PerfilScreen';
import ConfigScreen from './pastaBolada/screens/ConfigScreen';
import ChatScreen from './pastaBolada/screens/ChatScreen';
import NotificaScreen from './pastaBolada/screens/NotificaScreen';

// Stack

const Stack = createNativeStackNavigator();

function StartHome(){
  return(
  <Stack.Navigator initialRouteName="Feed">
    <Stack.Screen 
      name="Feed" 
      component={HomeScreen} 
      options={{ title: 'Página Inicial' }} // O que é isso | arrumar aqui
    />
    <Stack.Screen 
      name="Cadastro" 
      component={CadastroScreen} 
    />
    <Stack.Screen   
      name="Notificações" 
      component={NotificaScreen} 
    />
    <Stack.Screen 
      name="Chat" 
      component={ChatScreen} 
    />
  </Stack.Navigator>
)}

function SecOportunidades(){
  return(
    <Stack.Navigator initialRouteName="Oportunidades">
      <Stack.Screen 
        name="Oportunidades" 
        component={OportunidadesScreen} 
        options={{ title: 'Oportunidades' }} 
      />
      <Stack.Screen 
        name="Notificações" 
        component={NotificaScreen} 
      />
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen} 
      />
    </Stack.Navigator>
  )
}

// Bottom Tab

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
    <Tab.Navigator>
      <Tab.Screen name="Home" component={StartHome} />
      <Tab.Screen name="Oportuindades" component={SecOportunidades} />
      <Tab.Screen name="+" component={SecOportunidades} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
      <Tab.Screen name="Config" component={ConfigScreen} />
    </Tab.Navigator>
  </NavigationContainer>

  );
}
