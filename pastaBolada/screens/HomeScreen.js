import { View, Text } from 'react-native';
import Postagem from '../components/Postagem';

export default function HomeScreen() {

  return (
    <View className="bg-white flex-1 p-4">
        <Text>Home</Text>
        <Postagem />
        {/* <Button title="Ir para Detalhes" onPress={() => navigation.navigate('Detalhes')} /> */}
    </View>
  )}
