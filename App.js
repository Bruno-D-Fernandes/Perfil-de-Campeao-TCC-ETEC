import * as React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, Pressable, Text } from 'react-native';

import "./global.css"

//icons nav
import Feather from '@expo/vector-icons/Feather';

// Telas
import HomeScreen from './pastaBolada/screens/HomeScreen';
import OportunidadesScreen from './pastaBolada/screens/OportunidadesScreen';
import PerfilScreen from './pastaBolada/screens/PerfilScreen';
import ConfigScreen from './pastaBolada/screens/ConfigScreen';
import ChatScreen from './pastaBolada/screens/ChatScreen';
import NotificaScreen from './pastaBolada/screens/NotificaScreen';
import PostagemScreen from './pastaBolada/screens/PostagemScreen';
import SplashScreen from './pastaBolada/screens/SplashScreen'
import LoginScreen from './pastaBolada/screens/LoginScreen';
import CadastroScreen from './pastaBolada/screens/CadastroScreen';

// Stack
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ---
// Telas que têm a TabBar visível
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: '8%',
          width: '95%',
          marginLeft:'2.5%',
          marginRight:'2.5%',
          position:'absolute',
          bottom:'2%',
          borderRadius:60,
          padding:'4%',
          justifyContent:'center',
          backgroundColor: '#ffff',
          shadowColor: '#000',
          shadowOffset: { width: 1, height: 0.1 },
          shadowOpacity: 0.1,
          shadowRadius: 15,
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#888',
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') { iconName = 'home'; }
          if (route.name === 'Oportunidades') { iconName = 'briefcase'; }
          if (route.name === 'CriarPost') { iconName = 'plus-circle'; size = 36; } 
          if (route.name === 'Perfil') { iconName = 'user'; }
          if (route.name === 'Config') { iconName = 'settings'; }

          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Oportunidades" component={OportunidadesScreen} />
      <Tab.Screen 
        name="CriarPost" 
        component={PostagemScreen}
        options={{
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
      <Tab.Screen name="Config" component={ConfigScreen} />
    </Tab.Navigator>
  );
}

function AuthStack() { // aqui vai a tela de login 
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
      name='Login'
      component={LoginScreen}
      options={{ 
        headerShown: false,
        tabBarShown: false
       }}
      />
      <Stack.Screen 
        name="Cadastro" 
        component={CadastroScreen} 
        options={{ 
          headerShown: false, 
          tabBarShown: false
        }}
      />
      <Stack.Screen 
        name="MainApp"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Notificacoes" component={NotificaScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: true }} />
      <Stack.Screen name="Postagem" component={PostagemScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="AuthStack" 
          component={AuthStack} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}