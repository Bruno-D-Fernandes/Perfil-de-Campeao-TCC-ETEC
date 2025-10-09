import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, Pressable, Text } from 'react-native';

import "./global.css"

//icons nav
import Feather from '@expo/vector-icons/Feather';

// Telas
import OportunidadesScreen from './src/screens/OportunidadesScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import ConfigScreen from './src/screens/ConfigScreen';
import PostagemScreen from './src/screens/PostagemScreen';
import SplashScreen from './src/screens/SplashScreen'
import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import NotificaScreen from './src/screens/NotificaScreen';

// Stack
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ---
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

          if (route.name === 'Oportunidades') { iconName = 'briefcase'; }
          if (route.name === 'CriarPost') { iconName = 'plus-circle'; size = 36; } 
          if (route.name === 'Perfil') { iconName = 'user'; }
          if (route.name === 'Config') { iconName = 'settings'; }
          if (route.name === 'Notificacao') { iconName = 'bell'; }

          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Oportunidades" component={OportunidadesScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
            <Tab.Screen 
  name="CriarPost" 
  component={PostagemScreen}
  options={({ navigation }) => ({
    headerShown: true,
    tabBarStyle: { display: 'none' },
    headerStyle: {
      backgroundColor: '#ffffff',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
    headerTitle: () => (
      <Text style={{
        fontSize: 18,
        fontWeight: '600',
        color: '#4ADE80',
        textAlign: 'center',
      }}>
        Novo post
      </Text>
    ),
    headerLeft: () => (
      <Pressable 
        onPress={() => {
          navigation.navigate('Oportunidades');
        }}
        style={{
          backgroundColor: '#4ADE80',
          borderRadius: 20,
          width: 40,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 15,
        }}
      >
        <Feather name="arrow-left" size={24} color="#ffffff" />
      </Pressable>
    ),
    headerRight: () => (
      <Pressable 
        onPress={() => {
          // Lógica para postar
          console.log('Postar pressionado');
        }}
        style={{
          backgroundColor: '#4ADE80',
          borderRadius: 20,
          paddingHorizontal: 15,
          paddingVertical: 8,
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 15,
        }}
      >
        <Text style={{
          color: '#ffffff',
          fontSize: 16,
          fontWeight: '600',
        }}>
          Postar
        </Text>
        <Feather name="arrow-right" size={16} color="#ffffff" style={{ marginLeft: 5 }} />
      </Pressable>
    ),
    headerTitleAlign: 'center',
  })}
/>
      <Tab.Screen name="Config" component={ConfigScreen} />
      <Tab.Screen
      name='Notificacao'
      component={NotificaScreen}
      options={{ 
        headerShown: false,
        tabBarShown: false
        }}/>
    </Tab.Navigator>
  );
}

function AuthStack() { 
  return (
    <Stack.Navigator
      initialRouteName="Cadastro"
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
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabs} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}