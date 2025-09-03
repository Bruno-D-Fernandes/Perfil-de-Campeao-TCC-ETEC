import React, { useEffect, useState } from 'react';
import {  View, Text,  TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image, PanResponder} from 'react-native';
import RNPickerSelect from 'react-native-picker-select'; 
import tw from 'twrnc';
import usuario from '../../services/usuario';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default CadastroScreen = () => {

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
    ]
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
    confirmacaoSenhaUsuario: ''
  });

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => { // Axios aqui, REMOVER DEPOIS DA PRIMEIRA ENTREGA
    usuario.createUser(formData)
      .then(async response => {
        const { access_token } = response.data;
        localStorage.setItem('token', access_token);

        const responseDois = await usuario.perfilUser(access_token);
        const user = responseDois.data;

        AsyncStorage.setItem('user', JSON.stringify(user));
        navigation.navigate('MainTabs');
      })
      .catch(error => {
        console.error('Erro ao criar usuário:', error); // Não tem tela de erro, nem modal, deus nos proteja
      });
  };
  const renderStep1 = () => (
    <View className="mb-8 gap-y-4">
      <View className="w-full flex-col">
        <Text className="text-[#4ADC76] text-[20px] font-semibold">Nome</Text>

        <TextInput
          className="bg-white border rounded-[19px] h-[57px] p-4 text-base mb-4 border-[#4ADC76] border-[3px]"
          value={formData.nomeCompletoUsuario}
          onChangeText={(value) => updateField('nomeCompletoUsuario', value)}
        />

      </View>

      <View className="w-full flex-row justify-between">
        <View className="w-[60%] justify-center">
          <Text className="text-[#4ADC76] text-[20px] font-semibold">Data de Nasc.</Text>
          <TextInput
            className="bg-white border w-[100%] w-[98%] h-[57px] rounded-[19px] p-4 text-base mb-4 border-[#4ADC76] border-[3px]"
            value={formData.dataNascimentoUsuario}
            onChangeText={(value) => updateField('dataNascimentoUsuario', value)}
            keyboardType='default'
          />
        </View>
        <View className="w-[40%]">
          <Text className="text-[#4ADC76] text-[20px] font-semibold">Gênero</Text>
          <RNPickerSelect
            style={{
              inputIOS: tw`bg-white border rounded-[19px] h-[57px] p-4 text-base border-[#4ADC76] border-[3px]`,
              inputAndroid: tw`bg-white border rounded-[19px] h-[57px] p-4 text-base border-[#4ADC76] border-[3px]`,
              inputWeb: tw`bg-white border rounded-[19px] h-[57px] p-4 text-base text-[#4ADC76] font-semibold border-[#4ADC76] border-[3px]`,
              placeholder: {
                color: 'gray',
                fontSize: 16,
              },
            }}
            onValueChange={(value) => updateField('generoUsuario', value)}
            value={formData.generoUsuario}
            placeholder={{
              label: 'Selecione...',
              value: null,
            }}
            items={[
              { label: 'Masculino', value: 'masculino' },
              { label: 'Feminino', value: 'feminino' },
              { label: 'Não binário', value: 'nao-binario' },
              { label: 'Outro', value: 'outro' },
            ]}
          />
        </View>
      </View>
      <View className="w-full flex-col">
        <Text className="text-[#4ADC76] text-[20px] font-semibold">Estado</Text>
        <TextInput
          className="bg-white border rounded-[19px] h-[57px] p-4 text-base mb-4 border-[#4ADC76] border-[3px]"
          value={formData.estadoUsuario} 
          onChangeText={(value) => updateField('estadoUsuario', value)} 
        />
      </View>

      <View className="w-full flex-col">
        <Text className="text-[#4ADC76] text-[20px] font-semibold">Cidade</Text>
        <TextInput
          className="bg-white border rounded-[19px] h-[57px] p-4 text-base mb-4 border-[#4ADC76] border-[3px]"
          value={formData.cidadeUsuario} 
          onChangeText={(value) => updateField('cidadeUsuario', value)} 
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View className="mb-8 gap-y-4">
      <View className="w-full flex-col">
        <Text className="text-[#4ADC76] text-[20px] font-semibold">Categoria</Text>
        <RNPickerSelect
          style={{
            inputIOS: tw`bg-white border rounded-[19px] h-[57px] p-4 text-base border-[#4ADC76] border-[3px]`,
            inputAndroid: tw`bg-white border rounded-[19px] h-[57px] p-4 text-base border-[#4ADC76] border-[3px]`,
            inputWeb: tw`bg-white border rounded-[19px] h-[57px] p-4 text-base text-[#4ADC76] font-semibold border-[#4ADC76] border-[3px]`,
            placeholder: { color: 'gray' },
          }}
          onValueChange={(value) => updateField('categoria', value)}
          value={formData.categoria}
          placeholder={{ label: 'Selecione a categoria...', value: null }}
          items={[
            { label: 'Profissional', value: 'profissional' },
            { label: 'Amador', value: 'amador' },
            { label: 'Infantil', value: 'infantil' },
          ]}
        />
      </View>

      <View className="w-full flex-row justify-between">
        <View className="w-[60%] justify-center">
          <Text className="text-[#4ADC76] text-[20px] font-semibold">Temporadas</Text>
          <TextInput
            className="bg-white border w-[100%] w-[98%] h-[57px] rounded-[19px] p-4 text-base mb-4 border-[#4ADC76] border-[3px]"
            value={formData.temporadasUsuario} 
            onChangeText={(value) => updateField('temporadasUsuario', value)} 
            keyboardType='default'
          />
        </View>

        <View className="w-[40%] justify-center">
          <Text className="text-[#4ADC76] text-[20px] font-semibold">Altura</Text>
          <TextInput
            className="bg-white border rounded-[19px] h-[57px] p-4 w-[100%] text-base mb-4 border-[#4ADC76] border-[3px]"
            value={formData.alturaCm} 
            onChangeText={(value) => updateField('alturaCm', value)} 
          />
        </View>
      </View>
      {/* Esporte */}

      <View className="w-full flex-col">
        <Text className="text-[#4ADC76] text-[20px] font-semibold">Esporte</Text>
        <RNPickerSelect
          style={{
            inputIOS: tw`bg-white border rounded-[19px] h-[57px] p-4 text-base mb-4 border-[#4ADC76] border-[3px]`,
            inputAndroid: tw`bg-white border rounded-[19px] h-[57px] p-4 text-base mb-4 border-[#4ADC76] border-[3px]`,
            inputWeb: tw`bg-white border rounded-[19px] h-[57px] p-4 text-base text-[#4ADC76] font-semibold border-[#4ADC76] border-[3px]`, // Web certo
            placeholder: { color: 'gray' },
          }}

          onValueChange={(value) => updateField('esporte', value)}
          value={formData.esporte}
          placeholder={{ label: 'Selecione o esporte...', value: null }}
          items={[
            { label: 'Futebol', value: 'futebol' },
            { label: 'Basquete', value: 'basquete' },
            { label: 'Vôlei', value: 'volei' },
            { label: 'Tênis', value: 'tenis' },
          ]}
        />
      </View>

      {/* Posição */}

      <View className="w-full flex-col">
        <Text className="text-[#4ADC76] text-[20px] font-semibold">Posição</Text>
        <RNPickerSelect
          style={{
            inputIOS: tw`bg-white border rounded-[19px] h-[57px] p-4 text-base mb-4 border-[#4ADC76] border-[3px]`,
            inputAndroid: tw`bg-white border rounded-[19px] h-[57px] p-4 text-base mb-4 border-[#4ADC76] border-[3px]`,
            inputWeb: tw`bg-white border rounded-[19px] h-[57px] p-4 text-base text-[#4ADC76] font-semibold border-[#4ADC76] border-[3px]`, // Web certo
            placeholder: { color: 'gray' },
          }}
          onValueChange={(value) => updateField('posicao', value)}
          value={formData.posicao}
          placeholder={{ label: 'Selecione a posição...', value: null }}
          items={posicoesPorEsporte[formData.esporte] || []}
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View className="mb-8">
      <Text className="text-xl font-semibold mb-5 text-center text-gray-800">
        Segurança
      </Text>

      {/* Campo de E-mail */}
      <TextInput
        className="bg-white border rounded-[19px] h-[57px] p-4 text-base mb-4 border-[#4ADC76] border-[3px]"
        placeholder="E-mail"
        value={formData.emailUsuario}
        onChangeText={(value) => updateField('emailUsuario', value)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Campo de Senha */}
      <TextInput
        className="bg-white border rounded-[19px] h-[57px] p-4 text-base mb-4 border-[#4ADC76] border-[3px]"
        placeholder="Senha"
        value={formData.senhaUsuario}
        onChangeText={(value) => updateField('senhaUsuario', value)}
        secureTextEntry
      />

      {/* Campo de Confirmação de Senha */}
      <TextInput
        className="bg-white border rounded-[19px] h-[57px] p-4 text-base mb-4 border-[#4ADC76] border-[3px]"
        placeholder="Confirme sua senha"
        value={formData.confirmacaoSenhaUsuario}
        onChangeText={(value) => updateField('confirmacaoSenhaUsuario', value)}
        secureTextEntry
      />
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderStep1();
      case 1:
        return renderStep2();
      case 2:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-100 w-full items-center"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // isso aqui chat
    >

      <Image
        source={require('../../assets/cadastro/cadastro_imagem.png')}
        className="w-full"
        fit="cover"
      />
      <Text className="text-3xl font-bold text-center mb-8 text-gray-800">
        Criar Conta
      </Text>

      {/*Janela/Capa branco fundo inputs*/}
      <View className="bg-white w-full h-[70%] p-5 rounded-t-[60px] absolute bottom-0">

        {/* Indicador de progresso */}
        <View className="flex-row justify-center mb-8">
          {[0, 1, 2].map((step) => (
            <View
              key={step}
              className={`w-3 h-3 rounded-full mx-1 ${currentStep >= step ? 'bg-blue-500' : 'bg-gray-300'
                }`}
            />
          ))}
        </View>

        {renderCurrentStep()}

        {/* Botões de navegação */}
        <View className="flex-row justify-between mt-5">
          {currentStep > 0 && (
            <TouchableOpacity
              className="bg-transparent border border-blue-500 py-4 px-8 rounded-lg flex-1 mx-1"
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

    </KeyboardAvoidingView>
  );
};
