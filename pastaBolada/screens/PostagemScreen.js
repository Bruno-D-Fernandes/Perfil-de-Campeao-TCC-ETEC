import { useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Modal, TextInput } from 'react-native-web';

export default function HomeScreen() {
[cellModal, useCellModal] = useState(false);

function Usuario(){ // {imagem, nome} colocar parametro depois
return(
    <View className="w-full h-13 flex-row justify-start gap-[10px] items-center"> {/*Parte do Perfil*/}
    <Image
        source={require("../../assets/post/perfilFoto.png")}
        className="w-10 h-10"
    />
    <Text className="text-base">
        TESTE
    </Text>

    </View>
)}

function IconsBottom(){
return(
<View className="w-full h-20 flex-row justify-between items-center">

    <View className="flex-row gap-[5px]">
    <Pressable onPress={() => {useCellModal(true)}}> {/*Arrumar o onClick()*/}       
    <Image
        source={require("../../assets/icons-postagem/imagemIConPostagem.png")}
        className="w-10 h-10"
    />
    </Pressable>

    <Pressable> {/*Arrumar o onClick()*/}
    <Image
        source={require("../../assets/icons-postagem/localizacaoIconPostagem.png")}
        className="w-10 h-10"
    />
    </Pressable>

    <Pressable> {/*Arrumar o onClick()*/}
    <Image
        source={require("../../assets/icons-postagem/hashtagIconPostagem.png")}
        className="w-10 h-10"
    />
    </Pressable>
    </View>

    <Pressable> {/*Arrumar o onClick()*/}
    <Image
        source={require("../../assets/icons-postagem/SetaIconPostagem.png")}
        className="w-10 h-10"
    />
    </Pressable>
</View>
)
}

function Card(){


    return(
    <Pressable> {/*Arrumar o onClick()*/}
    <Image
        source={require("../../assets/icons-postagem/SetaIconPostagem.png")}
        className="w-10 h-10"
    />
    <Text>Mídia</Text>
    </Pressable>
    )
}


    {/* <Button title="Ir para Detalhes" onPress={() => navigation.navigate('Detalhes')} /> */}


return (
<View className="w-full h-full bg-white gap-10 direction-col justify-between    ">

    <View className="h-8/10 bg-blue-200">

    <Usuario />

    <TextInput 
    className="w-85 h-70 bg-white p-4 rounded-2xl border-[2px] border-[#61D483]"
    multiline={true}
    />

    </View>

    {/* Icones inferior, faz aparecer modal */}
    <IconsBottom/> 


    {/* Modal abaixo */}

<Modal transparent={true} visible={cellModal} animationType="slide">
    <Pressable className="flex-1 justify-end items-center" onPress={() => {useCellModal(false)}}> {/*Arrumar isso depois, dessa forma sem volta e iteração*/}
   <View className="w-[90%] h-[50%] bg-white border-[2px] border-[#61D483] rounded-tl-[36px] rounded-tr-[36px] rounded-bl-[0px] rounded-br-[0px]">



    </View>
    </Pressable>
</Modal>

</View>
)}