import { useRoute } from '@react-navigation/native';
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { handleForm, createPerfil, loadPerfilAll} from '../../services/perfil'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CriaEditaPerfil() {
    const route = useRoute();
    const { esporte, crud, perfis } = route.params || {}; 

    const [categorias, setCategorias] = useState([]);
    const [posicoes, setPosicoes] = useState([]);
    const [caracteristicas, setCaracteristicas] = useState([]);

    const [selectedCategoria, setSelectedCategoria] = useState(null);
    const [selectedPosicoes, setSelectedPosicoes] = useState([]);
    const [caracteristicaValues, setCaracteristicaValues] = useState({});
    
    const handleCreateForm = async (id) => {
        const response = await handleForm(id);
        setPosicoes(response.posicoes)
        setCategorias(response.categorias)
        setCaracteristicas(response.caracteristicas)
    };

    useEffect(() => {
            handleCreateForm(esporte.item.id);
    }, [esporte]);

    const togglePosicao = (posicaoId) => {
        setSelectedPosicoes(prev => 
            prev.includes(posicaoId) 
                ? prev.filter(id => id !== posicaoId) 
                : [...prev, posicaoId]
        );
    };

    const handleCaracteristicaChange = (id, value) => {
        setCaracteristicaValues(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async () => {
        const caracteristicasFormatadas = Object.entries(caracteristicaValues).map(([id, valor]) => ({
            id: parseInt(id),
            valor: valor
        }));

        let userId = await AsyncStorage.getItem('user')
        userId = JSON.parse(userId)

        if(crud === 'create'){
        const form = {
            usuario_id:  userId.id,
            categoria_id: selectedCategoria,
            esporte_id: esporte.item.id,
            caracteristicas: caracteristicasFormatadas,
            posicoes: selectedPosicoes,
        };

        console.log("Form Data para envio:", form);
        let response = createPerfil(form);
        console.log(response)
        }

        if(crud === 'update'){
            const form = {
            usuario_id:  userId.id,
            categoria_id: selectedCategoria,
            esporte_id: esporte.item.id,
            caracteristicas: caracteristicasFormatadas,
            posicoes: selectedPosicoes,
        };

        console.log("Form Data para envio:", form);
        let response = updatePerfil(form);
        console.log(response)
        }

    };

  return (
    <ScrollView style={tw`flex-1 p-4`}>
        <Text style={tw`text-3xl font-bold mb-6`}>Criar perfil para {esporte?.item?.nomeEsporte}</Text>

        {/* Categoria Picker */}
        <Text style={tw`text-xl font-semibold mt-4 mb-2`}>Categoria:</Text>
        <View style={tw`border border-gray-300 rounded-lg mb-4`}>
            <Picker
                selectedValue={selectedCategoria}
                onValueChange={(itemValue) => setSelectedCategoria(itemValue)}
                style={tw`w-full`}
            >
                <Picker.Item label="Selecione uma Categoria" value={null} />
                {categorias.map(cat => (
                    <Picker.Item key={cat.id} label={cat.nomeCategoria} value={cat.id} />
                ))}
            </Picker>
        </View>

        {/* Posições Multi-select */}
        <Text style={tw`text-xl font-semibold mt-4 mb-2`}>Posições:</Text>
        <View style={tw`flex-row flex-wrap mb-4`}>
            {posicoes.map(pos => (
                <TouchableOpacity //Tirar TouchOpacity (Depreciado)
                    key={pos.id}
                    style={tw`px-4 py-2 m-1 rounded-full ${selectedPosicoes.includes(pos.id) ? 'bg-blue-500' : 'bg-gray-200'}`}
                    onPress={() => togglePosicao(pos.id)}
                >
                    <Text style={tw`${selectedPosicoes.includes(pos.id) ? 'text-white' : 'text-gray-800'}`}>{pos.nomePosicao}</Text>
                </TouchableOpacity>
            ))}
        </View>

        {/* Características Dinâmicas */}
        <Text style={tw`text-xl font-semibold mt-4 mb-2`}>Características:</Text>
        {caracteristicas.map(carac => (
            <View key={carac.id} style={tw`mb-4`}>
                <Text style={tw`text-lg mb-1`}>{carac.caracteristica} ({carac.unidade_medida}):</Text>
                <TextInput
                    style={tw`border border-gray-300 p-3 rounded-lg`}
                    keyboardType="numeric"
                    placeholder={`Digite a ${carac.caracteristica}`}
                    value={caracteristicaValues[carac.id] || ''}
                    onChangeText={(text) => handleCaracteristicaChange(carac.id, text)}
                />
            </View>
        ))}

        <TouchableOpacity 
            style={tw`bg-green-500 p-4 rounded-lg mt-6 mb-10 items-center`}
            onPress={handleSubmit}
        >
            <Text style={tw`text-white text-lg font-bold`}>Salvar Perfil</Text>
        </TouchableOpacity>

    </ScrollView>
  );
}

