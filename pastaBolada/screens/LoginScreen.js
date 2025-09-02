import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { View, Text } from 'react-native';

export default function HomeScreen() {
  // const navigation = useNavigation(); 

  const[Email, setEmail] = useState();
  const[Senha, setSenha] = useState();

  


  return (
    <View>
        <Text>Login</Text>
        {/* <Button title="Ir para Detalhes" onPress={() => navigation.navigate('Detalhes')} /> */}
    </View>
  )}
