import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import tw from 'twrnc';
import usuario from '../../services/usuario';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';

// Importando os steps
import Step1 from '../components/cadastroComponents/step1'
import Step2 from '../components/cadastroComponents/step2';
import Step3 from '../components/cadastroComponents/step3';
import Step4 from '../components/cadastroComponents/step4';

const posicoesPorEsporte = {

};

export default function CadastroScreen() {
  const navigation = useNavigation();

  {/* Parte da animação provavelmente vai sair */ }
  const [barWidth, setBarWidth] = useState(0);
  const progress = useSharedValue(0);
  const progressStyle = useAnimatedStyle(() => {
    return {
      width: (progress.value / 100) * barWidth,
    };
  });

  {/* Form de cadastro */ }
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    nomeCompletoUsuario: '',
    dataNascimentoUsuario: '',
    generoUsuario: '',
    estadoUsuario: '',
    cidadeUsuario: '',
    emailUsuario: '',
    senhaUsuario: '',
    confirmacaoSenhaUsuario: '',
    alturaCm: '',
    pesoKg: '',
    peDominante: '',
    maoDominante: ''
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };


  const handleSubmit = async () => {
    try {
      const data = formData.dataNascimentoUsuario.split('/');
      if (data.length === 3) {
        formData.dataNascimentoUsuario = `${data[2]}-${data[1]}-${data[0]}`;
      }

      console.log(formData); // Tirar depois

      const token = await usuario.createUser(formData);
      await AsyncStorage.setItem('token', token.data.access_token);

      setCurrentStep(3)
      progress.value = withTiming(100);

    } catch (error) {
      console.error('Erro ao criar usuário:', error);
    }
  };

  {/* Lógica dos steps */ }
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1 formData={formData} updateField={updateField} pickerSelectStyles={pickerSelectStyles} />;
      case 1:
        return <Step2 formData={formData} updateField={updateField} pickerSelectStyles={pickerSelectStyles} />;
      case 2:
        return <Step3 formData={formData} updateField={updateField} />;
      case 3:
        return <Step4 />;
      default:
        return null;
    }
  };

  const handleStep = (num) => {
    const novoStep = currentStep + num;
    if (novoStep < 0 || novoStep > 2) return;

    setCurrentStep(novoStep);
    progress.value = withTiming(novoStep * 33, { // Parte da animação caso alguém va mexer
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });
  };


  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {/* <Text>Venha conhecer um mundo de oportunidades</Text> */} {/* Titulo que não está sendo utilizado */}
      <Image
        style={{ width: '100%', height: '40%', position: 'absolute' }}
        source={require('../../assets/cadastro/cadastro_imagem.png')}
      />

      <View style={tw`absolute h-[74%] bottom-0 w-full max-w-xl self-center bg-white p-5 rounded-tl-[30px] rounded-tr-[30px] shadow-lg`}>

        {/* Barra de progresso */}
        <View style={[tw`w-full h-10 justify-center`]}>
          <View
            style={[tw`w-full h-[10px] rounded-full bg-gray-400`]}
            onLayout={(event) => {
              const { width } = event.nativeEvent.layout;
              setBarWidth(width);
            }}>
            <Animated.View style={[tw`left-0 h-full bg-[#4ADC76]`, progressStyle]} />
          </View>
        </View>

        {/* Form atual */}
        {renderCurrentStep()}

        {/* Botões */}
        <View style={tw`flex-row-reverse justify-between w-full`}>

          {/* Próximo ou finalizar */}
          <Pressable
            style={tw`flex-row justify-between w-[48%] h-12 bg-[#4ADC76] rounded-full items-center`}
            onPress={() => {
              if (currentStep == 3) navigation.navigate('MainTabs');
              currentStep < 2 ? handleStep(1) : handleSubmit()
            }}>

            <Text style={tw`ml-3 font-semibold text-lg text-white`}>
              {currentStep < 3 ? 'Próximo' : 'Finalizar'}
            </Text>

            <View style={tw`justify-center items-center w-[27%] h-full rounded-full bg-white`}>
              <Image style={{ width: 12, height: 20 }} source={require('../../assets/cadastro/icon_proximo.png')} />
            </View>
          </Pressable>

          {/* Anterior */}
          {currentStep > 0 && currentStep < 3 && (
              <Pressable style={tw`justify-center items-center w-[25%] h-full rounded-full bg-[#4ADC76]`}    onPress={() => handleStep(-1)}>
                <Image style={{ width: 12, height: 20 }} source={require('../../assets/cadastro/icon_voltar.png')} />
              </Pressable>
          )}

        </View>
      </View>
    </View>
  );

};

// Da pra tirar esse styleSheet daqui com TW, mas assim fica mais organizado

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: '#333',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: '#333',
    paddingRight: 30,
  },
  //   inputWeb: {
  //   fontSize: 16,
  //   paddingVertical: 8,
  //   paddingHorizontal: 10,
  //   borderWidth: 1,
  //   borderColor: '#4ADC76',
  //   borderRadius: 8,
  //   // borderWidth: 2, 
  //   color: '#333',
  //   paddingRight: 30,
  // },
  placeholder: {
    color: '#A9A9A9',
  },
  iconContainer: {
    top: 12,
    right: 12,
  },
});