import { Text, View, Image, Pressable, Modal } from 'react-native';
import React, { useMemo, useRef, useState, useCallback } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView
} from '@gorhom/bottom-sheet';

export default function Oportunidades({
  idUsuario = '1',
  nameTime = 'Chelsea',
  tags = ['Legal', 'opa'],
  vaga = 'Zagueiro',
  esporte = 'Futebol de campo',
  categoria = 'Sub 20',
  localizacao ='Em: São José dos Campos, São Paulo.',
  calendario = 'Data limite: 30/11/2024',
  subtitulo = 'Mostre seu talento!',
  texto = 'O Corinthians está com inscrições abertas para a peneira 2025. Se você tem talento, foco e garra, essa é a chance de mostrar seu futebol.',
  likes = 400,
  images = [require('../../assets/post/perfilFoto.png')],
  comentarios = 6
}) {
  const [modalVisivel, setModalVisivel] = useState(false);

  const abrirDetalhes = () => {
    setModalVisivel(true);
    setTimeout(() => {
      sheetRef.current?.present();
    }, 50);
  };

  const fecharModal = () => {
    setModalVisivel(false);
  };

  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ['30%', '40%'], []);

  const handleDismiss = useCallback(() => {
    fecharModal();
  }, []);

  return (
    <View className="w-full items-center flex-row bg-white p-6 rounded-3xl border-[2px] border-[#61D483] gap-4">
      <Image
        source={images[0]}
        className="w-16 h-16 rounded-full"
      />
      <View className="w-[75%] flex-row justify-between items-center">
        <View className="gap-3">
          <Text className="font-semibold">{nameTime}</Text>
          <View>
            <Text className="text-gray-500 font-semibold">{vaga}</Text>
            <Text className="text-gray-400">
              {esporte} - {categoria}
            </Text>
          </View>
        </View>
        <Pressable onPress={abrirDetalhes}>
            <Text className="text-[#36A958] font-semibold">Ver mais</Text>
        </Pressable>
      </View>

      <Modal visible={modalVisivel} animationType="fade" transparent>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <BottomSheetModal
              ref={sheetRef}
              index={0}
              snapPoints={snapPoints}
              onDismiss={handleDismiss} 
               backgroundStyle={{
                  backgroundColor: 'white',
                  borderRadius: 20,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  elevation: 12,
              }}
            >
              <BottomSheetView  style={{ padding: 20 }}>
                <View className="w-full justify-center gap-4">
                  <View className="flex-row items-center gap-4">
                    <Image
                      source={images[0]}
                      className="w-20 h-20 rounded-full"
                    />
                    <Text className="font-bold text-lg">{nameTime}</Text>
                  </View>
                  <View className="gap-1">
                      <Text className="text-gray-400 text-[18px] font-semibold">{vaga}</Text>
                      <Text className="font-semibold text-[16px]">{esporte} - {categoria}</Text>
                  </View>
                  <View className='gap-1'>
                      <View className='flex-row gap-2'>
                        <Text className='color-[#36A958]'>{localizacao}</Text>
                      </View>
                      <View className='flex-row gap-2'>
                        <Text className='color-[#36A958]'>{calendario} </Text>
                      </View>
                  </View>
                  <View className='gap-1'>
                      <Text className='font-semibold text-gray-600'>{subtitulo}</Text>
                      <Text className='text-gray-600'>{texto}</Text>
                  </View>

                  <Pressable className='mt-6 p-3 bg-[#49D372] items-center justify-center' >
                    <Text className='color-white'>
                      Tenho interesse
                    </Text>
                  </Pressable>
                </View>
              </BottomSheetView>
            </BottomSheetModal>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </Modal>
    </View>
  );
}















