import { View, Text } from 'react-native';
import Cadastro from '../components/Cadastro';
export default function CadastroScreen() {
  
const fraseImagem1 = "Venha conhecer um";
  const fraseImagem2 = "mundo";
  const fraseImagem3 = "de";
  const fraseImagem4 = "oportunidades";
  return (
    <View>
        {/* <Button title="Ir para Detalhes" onPress={() => navigation.navigate('Detalhes')} /> */}
               <View className="bg-white flex-1 p-1">
                  <Cadastro
                    fraseImagem1={fraseImagem1}
                    fraseImagem2={fraseImagem2}
                    fraseImagem3={fraseImagem3}
                    fraseImagem4={fraseImagem4}
                  />
                </View>
    </View>
  )}
