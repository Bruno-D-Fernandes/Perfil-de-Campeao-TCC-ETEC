import * as React from 'react'; // arrumar aqui | TIRAR ISSO DEPOIS
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from 'react-native-web';

import "./global.css"

//icons nav
import Feather from '@expo/vector-icons/Feather';

// Telas

import CadastroScreen from './pastaBolada/screens/CadastroScreen';
import HomeScreen from './pastaBolada/screens/HomeScreen';
import OportunidadesScreen from './pastaBolada/screens/OportunidadesScreen';
import PerfilScreen from './pastaBolada/screens/PerfilScreen';
import ConfigScreen from './pastaBolada/screens/ConfigScreen';
import ChatScreen from './pastaBolada/screens/ChatScreen';
import NotificaScreen from './pastaBolada/screens/NotificaScreen';
import PostagemScreen from './pastaBolada/screens/PostagemScreen';
import { Pressable, Text } from 'react-native';

// Stack
const Stack = createNativeStackNavigator();

function StartHome(){
  return(
  <Stack.Navigator initialRouteName="Feed"
  screenOptions={{
    headerShown: false,
  }}
  >
    <Stack.Screen 
      headerShown="false"
      name="Feed" 
      options={{ headerShown: false }} 
      component={HomeScreen} 
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
    <Stack.Navigator initialRouteName="Oportunidades"
    screenOptions={{
      headerShown: false,
    }}
    >
      <Stack.Screen
        name="Oportunidades" 
        component={OportunidadesScreen} 
        options={{ headerShown: false  }} 
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

function CriarPost(){
const nav = useNavigation();
  return(
    <Stack.Navigator initialRouteName="Postagem"
    screenOptions={{
    headerStyle:{
      backgroundColor:'white',
      border: 0
    }}}
    >
      <Stack.Screen 
        name="Postagem" 
        component={PostagemScreen} 
        options={({ navigation }) => ({
          headerLeft: () => (
            <Button
              onPress={() => {nav.navigate('Home')}}
              title="Voltar" // aqui vai a imagem
              color="gray"
            />
          ),
          headerTitle: () => (
            <Text className="">Novo Post</Text>
           ),
          headerRight: () => (
            <Pressable
              onPress={() => { /* ação ao pressionar o botão */ }}
            >
              <Text className="">Publicar</Text>
            </Pressable>
          )
        })} 
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
            alignItems:'',
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

            if (route.name === 'Home') {iconName = 'home';}
            if (route.name === 'Oportunidades') {iconName = 'briefcase';}
            if (route.name === '+') {iconName = 'plus-circle'; size = 36;} 
            if (route.name === 'Perfil') {iconName = 'user';}
            if (route.name === 'Config') {iconName = 'settings';}

            return <Feather name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={StartHome} />
        <Tab.Screen name="Oportunidades" component={SecOportunidades} />
        <Tab.Screen name="+" component={CriarPost}     
        options={{
        tabBarStyle: { display: 'none' },
        }}/>
        <Tab.Screen name="Perfil" component={PerfilScreen} />
        <Tab.Screen name="Config" component={ConfigScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
