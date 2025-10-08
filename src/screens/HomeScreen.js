import { View, Text, Image, Pressable, TextInput } from 'react-native';
import { use, useEffect, useState } from 'react';
import { useFonts, Poppins_400Regular, Poppins_700Bold, Poppins_500Medium } from "@expo-google-fonts/poppins";


import Postagem from '../components/Postagem';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [nameUser, setNameUser] = useState('Usuario');


  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_500Medium
  });

  
    const loadUserData = async () => {
      try {
        const response = await usuario.perfilUser();
        console.log("Dados do usuário:", response);
        await AsyncStorage.setItem('userData', JSON.stringify(response));
      } catch (err) {
        console.error("Erro:", err);
      } 
    };
  
    useEffect(() => {
      const fetchUserData = async () => {
        await loadUserData();
        const userData = await AsyncStorage.getItem('user');
        setNameUser(JSON.parse(userData)?.nomeCompletoUsuario.split(" ")[0] || 'Usuário');
        console.log('Nome do usuário carregado:', nameUser)
      };
      fetchUserData();
    }, []);
  


  return (

    <View className="bg-white flex-1 p-4">

      {/* HEADER */}

      <View className="w-[100%] h-[34%] ">

        <View className="flex-row items-center justify-between mb-[8%]">

          <Image
            source={require("../../assets/post/perfilFoto.png")}
            className="w-10 h-10 rounded-full"
          />

        <View className='w-[28%] h-[100%] flex-row items-center justify-between '>

          {/*BTN NOTIFICACAO*/}
          <Pressable className="rounded-full bg-[#EFEFEF] h-[90%] w-[45%] items-center justify-center">  
            <Image
            source={require("../../assets/icons/notificacao.png")} style={{width:'30%', height:'35%',}}
            className="w-5 h-5"/>
          </Pressable>

          {/*BTN MENSSAGEM*/}
          <Pressable className="rounded-full bg-[#EFEFEF] h-[90%] w-[45%] items-center justify-center">  
            <Image
            source={require("../../assets/icons/mensagem.png")} style={{width:'38%', height:'40%',}}
            className="w-5 h-5"/>
          </Pressable>

        </View>
      </View>

        <View className="w-[100%] mb-[8%] gap-5"> 
          <Text className="text-[160%] font-medium" style={{fontFamily:'Poppins_500Medium',}}>Olá, {nameUser}</Text>
          <Text className="text-[120%] font-medium color-[#2E7844]" style={{fontFamily:'Poppins_500Medium',}}>Postagem</Text>
        </View>

        <View className='w-[100%] h-[18%] flex-row gap-2'>

          {/*BTN FILTRO*/}
          <Pressable className="rounded-full bg-[#EFEFEF] h-[90%] w-[12%] items-center justify-center">  
            <Image
            source={require("../../assets/icons/filtro.png")} style={{width:'38%', height:'40%',}}
            className="w-5 h-5"/>
          </Pressable>

          <View className='h-[90%] w-[85%] rounded-full bg-[#EFEFEF] gap-4 flex-row items-center '> 
            <Image
            source={require("../../assets/icons/pesquisa.png")} style={{width:'7%', height:'50%',}}
            className="ml-3"/>

            {/*CAMPO DE PESQUISA*/}
            <TextInput className='color-gray-600 font-normal w-[80%] h-[80%] outline-none' style={{fontFamily:'Poppins_400Regular',}} placeholder='Pesquisar'/>
          </View>
        </View>

    </View>


      {/*FEED*/}
      
        <Postagem nameUser={nameUser}/>

        {/* <Button title="Ir para Detalhes" onPress={() => navigation.navigate('Detalhes')} /> */}
    </View>
  )}
