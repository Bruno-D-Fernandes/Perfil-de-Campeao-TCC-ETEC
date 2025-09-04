import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import tw from 'twrnc';
import RNPickerSelect from 'react-native-picker-select';

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

const getProgress = (step) => {
    switch (step) {
        case 0:
            return '25%';
        case 1:
            return '50%';
        case 2:
            return '100%';
        default:
            return '0%';
    }
};

const CadastroScreen = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        nomeCompletoUsuario: '',
        dataNascimentoUsuario: '',
        generoUsuario: '',
        estadoUsuario: '',
        cidadeUsuario: '',
        categoria: '',
        temporadasUsuario: '',
        alturaCm: '',
        esporte: '',
        posicao: '',
        emailUsuario: '',
        senhaUsuario: '',
        confirmacaoSenhaUsuario: '',
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

    const handleSubmit = () => {
        console.log('Dados do formulário:', formData);
    };

    const renderStep1 = () => (
        <View style={tw`mb-8`}>
            <View style={tw`w-full`}>
                <Text style={tw`text-[#4ADC76] text-sm font-semibold mb-2`}>Nome</Text>
                <View style={tw` flex-row items-center rounded-xl h-12 border-[#4ADC76] border-2`}>
                    <Image className='mx-3' style={{width:16, height:19}} source={require('../../assets/cadastro/icon_user.png')} />
                    <TextInput
                        className='outline-none flex-1 h-[90%] text-[90%]'
                        placeholder="Seu nome completo"
                        placeholderTextColor="#A9A9A9"
                        value={formData.nomeCompletoUsuario}
                        onChangeText={(text) => updateField('nomeCompletoUsuario', text)}
                    />
                </View>
            </View>
            <View style={tw`w-full flex-row justify-between mt-4`}>
                <View style={tw`w-[48%]`}>
                    <Text style={tw`text-[#4ADC76] text-sm font-semibold mb-2`}>Ano de nasc.</Text>
                    <View style={tw`flex-row items-center rounded-xl h-12 border-[#4ADC76] border-2`}>
                        <Image className='mx-3' style={{width:16, height:16}} source={require('../../assets/cadastro/icon_data.png')} />
                        <TextInput
                            className='outline-none w-[80%] h-full text-[90%]'
                            placeholder="DD/MM/AAAA"
                            placeholderTextColor="#A9A9A9"
                            value={formData.dataNascimentoUsuario}
                            onChangeText={(text) => updateField('dataNascimentoUsuario', text)}
                        />
                    </View>
                </View>
                <View style={tw`w-[48%]`}>
                    <Text style={tw`text-[#4ADC76] text-sm font-semibold mb-2`}>Gênero</Text>
                    <View style={tw`flex-row items-center rounded-xl p-[5] h-12 border-[#4ADC76] border-2`}>
                        <Image className='mx-1' style={{width:16, height:20}} source={require('../../assets/cadastro/icon_genero.png')} />
                        <View style={tw`w-[80%] h-[100%] justify-center `}>
                            <RNPickerSelect
                                onValueChange={(value) => updateField('generoUsuario', value)}
                                items={[
                                    { label: 'Masculino', value: 'masculino' },
                                    { label: 'Feminino', value: 'feminino' },
                                    { label: 'Não binário', value: 'nao-binario' },
                                    { label: 'Outro', value: 'outro' },
                                ]}
                                style={pickerSelectStyles}
                                value={formData.generoUsuario}
                                placeholder={{ label: 'Selecione...', value: null }}
                            />
                        </View>
                    </View>
                </View>
            </View>

            <View style={tw`w-full mt-4`}>
                <Text style={tw`text-[#4ADC76] text-sm font-semibold mb-2`}>Estado</Text>
                <View style={tw`flex-row items-center rounded-xl h-12 border-[#4ADC76] border-2`}>
                    <Image className='mx-3' style={{width:16, height:20}} source={require('../../assets/cadastro/icon_local.png')} />
                    <TextInput
                        className='outline-none flex-1 h-full text-[90%]'
                        placeholder="Estado"
                        placeholderTextColor="#A9A9A9"
                        value={formData.estadoUsuario}
                        onChangeText={(text) => updateField('estadoUsuario', text)}
                    />
                </View>
            </View>
            
            <View style={tw`w-full mt-4`}>
                <Text style={tw`text-[#4ADC76] text-sm font-semibold mb-2`}>Cidade</Text>
                <View style={tw`flex-row items-center rounded-xl h-12 border-[#4ADC76] border-2`}>
                    <Image className='mx-3' style={{width: 16, height:14}} source={require('../../assets/cadastro/icon_cidade.png')} />
                    <TextInput
                        className='outline-none flex-1 h-full text-[90%]'
                        placeholder="Cidade"
                        placeholderTextColor="#A9A9A9"
                        value={formData.cidadeUsuario}
                        onChangeText={(text) => updateField('cidadeUsuario', text)}
                    />
                </View>
                
            </View>
        </View>
    );

    {/*cadastro 2*/}
    const renderStep2 = () => (
        <View style={tw`mb-8`}>
            <View style={tw`w-full`}>
                <Text style={tw`text-[#4ADC76] text-sm font-semibold mb-2`}>Categoria</Text>
                <View style={tw`flex-row items-center rounded-xl p-5 h-12 border-[#4ADC76] border-2`}>
                    <View style={tw`w-[100%] h-[100%] justify-center`}>
                        <RNPickerSelect
                            onValueChange={(value) => updateField('categoria', value)}
                            items={[
                                { label: 'Profissional', value: 'profissional' },
                                { label: 'Amador', value: 'amador' },
                                { label: 'Infantil', value: 'infantil' },
                            ]}
                            style={pickerSelectStyles}
                            value={formData.categoria}
                            placeholder={{ label: 'Selecione a categoria...', value: null }}
                        />
                    </View>
                </View>
            </View>
            <View style={tw`w-full flex-row justify-between mt-4`}>
                <View style={tw`w-[48%]`}>
                    <Text style={tw`text-[#4ADC76] text-sm font-semibold mb-2`}>Temporadas</Text>
                    <View style={tw`flex-row items-center rounded-xl h-12 border-[#4ADC76] border-2`}>
                        <Image className='mx-3' style={{width:16, height:19}} source={require('../../assets/cadastro/icon_tempo.png')} />
                        <TextInput
                            style={tw`w-[80%] h-full text-[90%]`}
                            placeholder="Anos"
                            placeholderTextColor="#A9A9A9"
                            value={formData.temporadasUsuario}
                            className='outline-none'
                            onChangeText={(text) => updateField('temporadasUsuario', text)}
                            keyboardType="numeric"
                        />
                    </View>
                </View>
                <View style={tw`w-[48%]`}>
                    <Text style={tw`text-[#4ADC76] text-sm font-semibold mb-2`}>Altura (cm)</Text>
                    <View style={tw`flex-row items-center rounded-xl p-[5] h-12 border-[#4ADC76] border-2`}>
                        <Image className='mx-3' style={{width:16, height:19}} source={require('../../assets/cadastro/icon_altura.png')} />
                        <TextInput
                            style={tw`w-[80%] h-[100%] justify-center `}
                            className='outline-none'
                            placeholder="cm"
                            placeholderTextColor="#A9A9A9"
                            value={formData.alturaCm}
                            onChangeText={(text) => updateField('alturaCm', text)}
                            keyboardType="numeric"
                        />
                    </View>
                </View>
            </View>
            <View style={tw`w-full mt-4`}>
                <Text style={tw`text-[#4ADC76] text-sm font-semibold mb-2`}>Esporte</Text>
                <View style={tw`flex-row items-center rounded-xl h-12 border-[#4ADC76] border-2`}>
                    <Image className='mx-3' style={{width:22, height:13}} source={require('../../assets/cadastro/icon_esporte.png')} />
                    <View style={tw`w-[80%] h-[100%] justify-center `}>
                        <RNPickerSelect
                            onValueChange={(value) => {
                                updateField('esporte', value);
                                updateField('posicao', '');
                            }}
                            items={[
                                { label: 'Futebol', value: 'futebol' },
                                { label: 'Basquete', value: 'basquete' },
                                { label: 'Vôlei', value: 'volei' },
                                { label: 'Tênis', value: 'tenis' },
                            ]}
                            
                            style={pickerSelectStyles}
                            value={formData.esporte}
                            placeholderTextColor="#A9A9A9"
                            placeholder={{ label: 'Selecione o esporte...', value: null }}
                        />
                    </View>
                </View>
            </View>
            {formData.esporte && (
                <View style={tw`w-full mt-4`}>
                    <Text style={tw`text-[#4ADC76] text-sm font-semibold mb-2`}>Posição</Text>
                    <View style={tw`flex-row items-center rounded-xl h-12 border-[#4ADC76] border-2`}>
                    <Image className='mx-3' style={{width:16, height:19}} source={require('../../assets/cadastro/icon_posicao.png')} />
                            <View style={tw`w-[80%] h-[100%] justify-center`}>
                            <RNPickerSelect
                                onValueChange={(value) => updateField('posicao', value)}
                                items={posicoesPorEsporte[formData.esporte] || []}
                                style={pickerSelectStyles}
                                value={formData.posicao}
                                placeholderTextColor="#A9A9A9"
                                placeholder={{ label: 'Selecione a posição...', value: null }}
                            />
                        </View>
                    </View>
                </View>
            )}
        </View>
    );

    const renderStep3 = () => (
        <View style={tw`mb-8`}>
            <View style={tw`w-full`}>
                <Text style={tw`text-[#4ADC76] text-sm font-semibold mb-2`}>E-mail</Text>
                <View style={tw`flex-row items-center rounded-xl h-12 border-[#4ADC76] border-2`}>
                    <Image className='mx-3' style={{width:16, height:12}} source={require('../../assets/cadastro/icon_email.png')} />
                    <TextInput
                        className='outline-none flex-1 h-full text-[90%]'
                        placeholder="E-mail"
                        placeholderTextColor="#A9A9A9"
                        value={formData.emailUsuario}
                        onChangeText={(text) => updateField('emailUsuario', text)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
            </View>
            <View style={tw`w-full mt-4`}>
                <Text style={tw`text-[#4ADC76] text-sm font-semibold mb-2`}>Senha</Text>
                <View style={tw`flex-row items-center rounded-xl h-12 border-[#4ADC76] border-2`}>
                    <Image className='mx-3' style={{width:16, height:18}} source={require('../../assets/cadastro/icon_senha.png')} />
                    <TextInput
                        className='outline-none flex-1 h-full text-[90%]'
                        placeholder="Senha"
                        placeholderTextColor="#A9A9A9"
                        value={formData.senhaUsuario}
                        onChangeText={(text) => updateField('senhaUsuario', text)}
                        secureTextEntry
                    />
                </View>
            </View>
            <View style={tw`w-full mt-4`}>
                <Text style={tw`text-[#4ADC76] text-sm font-semibold mb-2`}>Confirme a Senha</Text>
                <View style={tw`flex-row items-center rounded-xl h-12 border-[#4ADC76] border-2`}>
                    <Image className='mx-3' style={{width:16, height:18}} source={require('../../assets/cadastro/icon_senha.png')} />
                    <TextInput
                        className='outline-none flex-1 h-full text-[90%]'
                        placeholder="Confirme sua senha"
                        placeholderTextColor="#A9A9A9"
                        value={formData.confirmacaoSenhaUsuario}
                        onChangeText={(text) => updateField('confirmacaoSenhaUsuario', text)}
                        secureTextEntry
                    />
                </View>
            </View>
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
        <View style={tw`flex-1 bg-gray-100`}>
            {/* Este View substitui a imagem para que o código compile, mas num projeto real deve ser substituído pela sua imagem local. */}

            <Text className=''>Venha conhecer um mundo de oportunidades</Text>
            <Image className='absolute' style={{width:'100%', height:'40%'}} source={require('../../assets/cadastro/cadastro_imagem.png')} />

            
            <View style={tw`absolute h-[74%] bottom-0 w-full max-w-xl self-center bg-white p-5 rounded-tl-[30px] rounded-tr-[30px] shadow-lg`}>
                <View style={tw`w-full items-center mb-2`}>
                    <View style={tw`flex-row items-center w-full mb-2`}>
                        <View style={tw`flex-1 h-2 bg-gray-200 rounded-full`}>
                            <View style={[tw`h-full bg-[#4ADC76] rounded-full`, { width: getProgress(currentStep) }]} />
                        </View>
                        <Text style={tw`text-xs ml-2 text-gray-600`}>
                            {getProgress(currentStep)}
                        </Text>
                    </View>
                </View>

                {renderCurrentStep()}

                <View className='flex-row justify-between w-full '>
                    <Pressable
                        style={[tw`flex-row justify-between items-center w-[48%] p-[1.5%] h-12 bg-white border-2 border-[#4ADC76] rounded-full`, currentStep === 0 && tw`hidden`]}
                        onPress={prevStep}
                    >
                         <View className='justify-center items-center w-[27%]  h-[100%] rounded-[100px] bg-[#4ADC76]'>
                            <Image className='mx-3' style={{width:12, height:20}} source={require('../../assets/cadastro/icon_voltar.png')} />
                        </View>
                        <Text style={tw`mr-3 font-semibold text-lg text-[#4ADC76]`}>Anterior</Text>
                    </Pressable>
                    <Pressable
                        className='flex-row justify-between w-[48%] p-[1.5%]  h-12 bg-[#4ADC76] rounded-full items-center'
                        onPress={currentStep < 2 ? nextStep : handleSubmit}
                    >
                        <Text className='' style={tw`ml-3 font-semibold text-lg text-white`}>{currentStep < 2 ? 'Próximo' : 'Finalizar'}</Text>
                        <View className='justify-center items-center w-[27%] h-[100%] rounded-[100px] bg-[#ffff]'>
                            <Image className='mx-3' style={{width:12, height:20}} source={require('../../assets/cadastro/icon_proximo.png')} />
                        </View>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
     color: '#A9A9A9',
     height: '100%',
    paddingLeft: 8,     
    paddingVertical: 0,  
    textAlignVertical: 'center',
    outline:'none',
  },
  inputAndroid: {
    fontSize: 16,
    color: '#A9A9A9',
    height: '100%',
    paddingLeft: 8,   
    paddingVertical: 0,
    textAlignVertical: 'center',

  },
  placeholder: {
    color: '#A9A9A9', // cinza claro
  },
});



export default CadastroScreen;
