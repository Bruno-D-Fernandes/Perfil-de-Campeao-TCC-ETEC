import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import tw from 'twrnc';
import usuario from '../../services/usuario';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CadastroScreen() {
  const navigation = useNavigation();

  const posicoesPorEsporte = {
    futebol: [
      { label: 'Atacante', value: 'atacante' },
      { label: 'Zagueiro', value: 'zagueiro' },
      { label: 'Goleiro', value: 'goleiro' },
      { label: 'Meio-campo', value: 'meio-campo' },
    ],
    basquete: [
      { label: 'Armador', value: 'armador' },
      { label: 'Ala-armador', value: 'ala-armador' },
      { label: 'Ala', value: 'ala' },
      { label: 'Ala-pivô', value: 'ala-pivo' },
      { label: 'Pivô', value: 'pivo' },
    ],
    volei: [
      { label: 'Levantador', value: 'levantador' },
      { label: 'Ponteiro', value: 'ponteiro' },
      { label: 'Oposto', value: 'oposto' },
      { label: 'Central', value: 'central' },
      { label: 'Líbero', value: 'libero' },
    ],
    tenis: [
      { label: 'Simples', value: 'simples' },
      { label: 'Duplas', value: 'duplas' },
    ],
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    nomeCompletoUsuario: '',
    nomeUsuario: '',
    emailUsuario: '',
    senhaUsuario: '',
    nacionalidadeUsuario: '',
    dataNascimentoUsuario: '',
    fotoPerfilUsuario: '',
    fotoBannerUsuario: '',
    bioUsuario: '',
    alturaCm: '',
    pesoKg: '',
    peDominante: '',
    maoDominante: '',
    generoUsuario: '',
    esporte: '',
    posicao: '',
    estadoUsuario: '',
    cidadeUsuario: '',
    categoria: '',
    temporadasUsuario: '',
    confirmacaoSenhaUsuario: '',
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextStep = () => currentStep < 2 && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1);

  const handleSubmit = async () => {
    if (formData.senhaUsuario !== formData.confirmacaoSenhaUsuario) {
      Alert.alert('Erro', 'As senhas não conferem.');
      return;
    }

    try {
      const response = await usuario.createUser(formData);
      const { accessToken } = response.data;

      await AsyncStorage.setItem('token', accessToken);
      navigation.navigate('MainApp');
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      Alert.alert('Erro', 'Não foi possível criar sua conta. Tente novamente.');
    }
  };

  // ... seus renderStep1, renderStep2, renderStep3 (mantidos iguais)

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Image
          source={require('../../assets/cadastro/cadastro_imagem.png')}
          style={{ width: '100%', height: '40%', resizeMode: 'cover' }}
        />
        <Text className="text-3xl font-bold text-center mb-8 text-gray-800">
          Criar Conta
        </Text>

        {/* Capa branca fundo inputs */}
        <View className="bg-white w-full flex-1 p-5 rounded-t-[60px]">
          {/* Indicador de progresso */}
          <View className="flex-row justify-center mb-8">
            {[0, 1, 2].map((step) => (
              <View
                key={step}
                className={`w-3 h-3 rounded-full mx-1 ${
                  currentStep >= step ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </View>

          {currentStep === 0 && renderStep1()}
          {currentStep === 1 && renderStep2()}
          {currentStep === 2 && renderStep3()}

          {/* Botões */}
          <View className="flex-row justify-between mt-5">
            {currentStep > 0 && (
              <TouchableOpacity
                className="border border-blue-500 py-4 px-8 rounded-lg flex-1 mx-1"
                onPress={prevStep}
              >
                <Text className="text-blue-500 text-base font-semibold text-center">
                  Anterior
                </Text>
              </TouchableOpacity>
            )}

            {currentStep < 2 ? (
              <TouchableOpacity
                className="bg-blue-500 py-4 px-8 rounded-lg flex-1 mx-1"
                onPress={nextStep}
              >
                <Text className="text-white text-base font-semibold text-center">
                  Próximo
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="bg-blue-500 py-4 px-8 rounded-lg flex-1 mx-1"
                onPress={handleSubmit}
              >
                <Text className="text-white text-base font-semibold text-center">
                  Finalizar
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
