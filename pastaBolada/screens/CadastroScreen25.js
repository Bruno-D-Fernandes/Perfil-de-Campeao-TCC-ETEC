import { useState } from 'react';
import { View, Text } from 'react-native';
import { TextInput } from 'react-native-web';
import { DateTimePicker} from '@react-native-community/datetimepicker';

export default function HomeScreen() {

  const [Nome,setNome] = useState("");
  const [AnoNasc,setAnoNasc] = useState();
  const [Genero,setGenero] = useState();
  const [Estado,setEstado] = useStete();
  const [Cidades,setCidades] = useState();

  
  

  return (
    <View>
      {/* <Button title="Ir para Detalhes" onPress={() => navigation.navigate('Detalhes')} /> */}
      <View>
        <Text>Cadastro</Text>
      </View>

      <View>
        <View>
          <TextInput

          />
        </View>

        <View>

        </View>
      </View>
    </View>
  )}
