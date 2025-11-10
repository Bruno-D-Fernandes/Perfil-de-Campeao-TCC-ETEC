import { Text, View, Image, Pressable } from "react-native";
import React, { useMemo, useRef, useState, useCallback } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

import { inscreverOportunidade } from "../../services/oportunidades";

export default function Oportunidade({ data }) {
  const {
    id,
    clube = {},
    posicao = {},
    esporte = {},
    idadeMinima = -1,
    idadeMaxima = -1,
    data_limite = "",
    titulo = "",
    descricaoOportunidades = "",
    estadoOportunidade = "",
    enderecoOportunidade = "",
  } = data || {};

  const imagem = data.clube.fotoPerfilClube || null;

  const nomeEsporte = esporte?.nomeEsporte || "Esporte não informado";

  const [mensagem, setMensagem] = useState(""); // Mensagem de feedback
  const [mensagemTipo, setMensagemTipo] = useState(""); // 'erro' ou 'sucesso'
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ["45%", "50%"], []);

  const abrirDetalhes = useCallback(() => {
    // Present the bottom sheet managed by the root provider
    setTimeout(() => {
      sheetRef.current?.present();
    }, 100);
  }, []);

  const handleDismiss = useCallback(() => {
    setMensagem("");
    setMensagemTipo("");
  }, []);

  const handleTenhoInteresse = async () => {
    try {
      await inscreverOportunidade(id);
      setMensagemTipo("sucesso");
      setMensagem("Você se inscreveu nesta oportunidade!");
    } catch (error) {
      if (error.response?.status === 409) {
        setMensagemTipo("erro");
        setMensagem("Você já está inscrito nesta oportunidade!");
      } else {
        setMensagemTipo("erro");
        setMensagem("Não foi possível se inscrever. Tente novamente.");
        console.error("Erro ao se inscrever na oportunidade:", error);
      }
    }
  };

  console.log(data);

  const fotoPerfilUrl = data.clube.fotoPerfilClube
    ? `http://192.168.0.101:8000/storage/${data.clube.fotoPerfilClube}`
    : null;

  return (
    <View className="w-full mb-4 items-center flex-row bg-white p-4 rounded-3xl border-[2px] border-[#76D292] gap-4">
      <Pressable
        onPress={abrirDetalhes}
        className="flex-1 flex-row justify-between items-center"
      >
        <View className="flex-1 flex-row justify-between items-center">
          <View className="rounded-full w-[70px] h-[70px]">
            <Image
              source={
                fotoPerfilUrl
                  ? { uri: fotoPerfilUrl }
                  : require("../../assets/perfil/fotoPerfil.png")
              }
              style={{
                width: 70,
                height: 70,
                borderRadius: 100,
              }}
            />
          </View>

          <View className="w-[70%] justify-center gap-1">
            <Text
              className=" text-[16px]"
              style={{ fontFamily: "Poppins_500Medium" }}
            >
              {clube.nomeClube}
            </Text>
            <View className="flex-row items-center gap-2">
              <Text
                className="text-gray-500 "
                style={{ fontFamily: "Poppins_500Medium" }}
              >
                {posicao.nomePosicao}
              </Text>
              <Text
                className="text-gray-400 text-[13px]"
                style={{ fontFamily: "Poppins_500Medium" }}
              >
                {nomeEsporte} - {idadeMinima} a {idadeMaxima} anos
              </Text>
            </View>
          </View>

          <View>
            <Image source={require("../../assets/icons/icon_proximo.png")} />
          </View>
        </View>
      </Pressable>

      <BottomSheetModal
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        onDismiss={handleDismiss}
        backgroundStyle={{
          backgroundColor: "white",
          borderRadius: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 12,
        }}
      >
        <BottomSheetView style={{ padding: 20 }}>
          <View className="w-full justify-center gap-4">
            <View className="flex-row items-center gap-4">
              <View className="rounded-full w-[70px] h-[70px]">
                <Image
                  source={
                    fotoPerfilUrl
                      ? { uri: fotoPerfilUrl }
                      : require("../../assets/perfil/fotoPerfil.png")
                  }
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 100,
                  }}
                />
              </View>
              <Text
                style={{ fontFamily: "Poppins_500Medium" }}
                className=" text-lg"
              >
                {clube.nomeClube}
              </Text>
            </View>

            <View className="gap-1">
              <Text
                className="text-gray-400 text-[22px]"
                style={{ fontFamily: "Poppins_500Medium" }}
              >
                {posicao.nomePosicao}
              </Text>
              <Text
                className=" text-[16px]"
                style={{ fontFamily: "Poppins_500Medium" }}
              >
                {nomeEsporte} - {idadeMinima} a {idadeMaxima} anos
              </Text>
            </View>

            <View className="gap-1">
              <Text
                className="text-[#36A958]"
                style={{ fontFamily: "Poppins_500Medium" }}
              >
                Em: {estadoOportunidade} {enderecoOportunidade}{" "}
              </Text>
              <Text
                className="text-[#36A958]"
                style={{ fontFamily: "Poppins_500Medium" }}
              >
                Data limite: {data_limite}
              </Text>
            </View>

            <View className="gap-1">
              <Text
                className=" text-gray-600"
                style={{ fontFamily: "Poppins_500Medium" }}
              >
                {titulo}
              </Text>
              <Text
                className="text-gray-600"
                style={{ fontFamily: "Poppins_500Medium" }}
              >
                {descricaoOportunidades}
              </Text>
            </View>

            {/* Mensagem de feedback */}
            {mensagem ? (
              <View
                className={`p-3 rounded-xl mt-4`}
                style={{
                  backgroundColor:
                    mensagemTipo === "erro" ? "#F8D7DA" : "#D1E7DD",
                }}
              >
                <Text
                  className="text-center font-semibold"
                  style={{
                    color: mensagemTipo === "erro" ? "#842029" : "#0F5132",
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
    </View>
  );
}
