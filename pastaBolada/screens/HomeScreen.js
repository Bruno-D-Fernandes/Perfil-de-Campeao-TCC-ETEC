import { View, Text } from 'react-native';
import Postagem from '../components/Postagem';

export default function HomeScreen() {

  const nameUser = 'Vinicius';

  return (
    <View className="bg-white flex-1 p-4">
        <Text>{nameUser}</Text>

        <Postagem nameUser={nameUser}/>
        {/* <Button title="Ir para Detalhes" onPress={() => navigation.navigate('Detalhes')} /> */}
    </View>
  )}
