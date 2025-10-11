import { Text, View, Image, Pressable, Modal } from 'react-native';
import React, { useMemo, useRef, useState, useCallback } from 'react';
import BtnSeguir from './BtnSeguir';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

import { inscreverOportunidade } from '../../services/oportunidades';

export default function Oportunidade({ data }) {
  const {
    id,
    clube = {},
    posicao = {},
    esporte = {},
    idadeMinima = -1,
    idadeMaxima = -1,
    data_limite = '',
    titulo = '',
    descricaoOportunidades = '',
    estadoOportunidade = '',
    enderecoOportunidade = '',
    imagem = null,
  } = data || {};

  const nomeEsporte = esporte?.nomeEsporte || 'Esporte não informado';

  const [modalVisivel, setModalVisivel] = useState(false);
  const [mensagem, setMensagem] = useState(''); 
  const [mensagemTipo, setMensagemTipo] = useState('');
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ['60%', '90%'], []);

  const abrirDetalhes = useCallback(() => {
    setModalVisivel(true);
    setTimeout(() => {
      sheetRef.current?.present();
    }, 100);
  }, []);

  const handleDismiss = useCallback(() => {
    setModalVisivel(false);
    setMensagem('');
    setMensagemTipo('');
  }, []);

  const handleTenhoInteresse = async () => {
    try {
      await inscreverOportunidade(id);
      setMensagemTipo('sucesso');
      setMensagem('Você se inscreveu nesta oportunidade!');
    } catch (error) {
      if (error.response?.status === 409) {
        setMensagemTipo('erro');
        setMensagem('Você já está inscrito nesta oportunidade!');
      } else {
        setMensagemTipo('erro');
        setMensagem('Não foi possível se inscrever. Tente novamente.');
        console.error('Erro ao se inscrever na oportunidade:', error);
      }
    }
  };

  return (
    <View className="w-full mb-4 items-center flex-row bg-white p-4 rounded-3xl border-[2px] border-[#61D483] gap-4">
   

      <View className="flex-1 flex-row justify-between items-center">
        <View className="gap-1">
          <Text className=" text-[16px]" style={{ fontFamily: 'Poppins_500Medium' }}>{clube.nomeClube}</Text>
          <Text className="text-gray-500 " style={{ fontFamily: 'Poppins_500Medium' }}>{posicao.nomePosicao}</Text>
          <Text className="text-gray-400 text-[13px]" style={{ fontFamily: 'Poppins_500Medium' }}>
            {nomeEsporte} - {idadeMinima} a {idadeMaxima} anos
          </Text>
        </View>

        <Pressable onPress={abrirDetalhes}>
          <Image
            source={require('../../assets/icons/icon_proximo.png')}
          />
        </Pressable>
      </View>

      {/* MODAL COM BOTTOM SHEET */}
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
              <BottomSheetView style={{ padding: 20 }}>
                <View className="w-full justify-center gap-4">
                  <View className="flex-row items-center gap-4">

                  <Text
                    className="text-xl"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                      fontFamily: 'Poppins_500Medium',
                      maxWidth: 210,
                    }}
                  >
                    {clube.nomeClube}
                  </Text>
                    <BtnSeguir  />
                  </View>

                  <View className="gap-1">
                    <Text className="text-gray-400 text-[18px]" style={{ fontFamily: 'Poppins_500Medium' }}>
                      {posicao.nomePosicao}
                    </Text>
                    <Text className=" text-[16px]" style={{ fontFamily: 'Poppins_500Medium' }}>
                      {nomeEsporte} - {idadeMinima} a {idadeMaxima} anos
                    </Text>
                  </View>

                  <View className="gap-1">
                    <Text className="text-[#36A958]" style={{ fontFamily: 'Poppins_500Medium' }}>
                      Em: {estadoOportunidade} {enderecoOportunidade}{' '}
                    </Text>
                    <Text className="text-[#36A958]" style={{ fontFamily: 'Poppins_500Medium' }}>Data limite: {data_limite}</Text>
                  </View>

                  <View className="gap-1">
                    <Text className=" text-gray-600" style={{ fontFamily: 'Poppins_500Medium' }}>{titulo}</Text>
                    <Text className="text-gray-600" style={{ fontFamily: 'Poppins_500Medium' }}>{descricaoOportunidades}</Text>
                  </View>

                  {/* Mensagem de feedback */}
                  {mensagem ? (
                    <View
                      className={`p-3 rounded-xl mt-4`}
                      style={{
                        backgroundColor: mensagemTipo === 'erro' ? '#F8D7DA' : '#D1E7DD',
                      }}
                    >
                      <Text
                        className="text-center font-semibold"
                        style={{
                          color: mensagemTipo === 'erro' ? '#842029' : '#0F5132',
                        }}
                      >
                        {mensagem}
                      </Text>
                    </View>
                  ) : null}

                  <Pressable
                    onPress={handleTenhoInteresse}
                    className="mt-6 p-3 bg-[#49D372] items-center justify-center rounded-xl"
                  >
                    <Text className="text-white font-semibold">Tenho interesse</Text>
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
