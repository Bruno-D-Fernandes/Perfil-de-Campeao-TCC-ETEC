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
    data_limite = "Ainda não implementado",
    titulo = "Sem titulo implementado",
    descricaoOportunidades = "",
    estadoOportunidade = "",
    enderecoOportunidade = "",
  } = data.oportunidade || data || {};

  const { status = null } = data || {};
  const [localStatus, setLocalStatus] = useState(status || null);
  const [showStatusInfo, setShowStatusInfo] = useState(false);
  const statusTimeoutRef = useRef(null);

  const normalizedStatus =
    (localStatus ?? status)
      ? String(localStatus ?? status).toLowerCase()
      : null;
  let statusKey = null;
  if (normalizedStatus) {
    if (normalizedStatus === "pending" || normalizedStatus === "pendente") {
      statusKey = "pending";
    } else if (
      normalizedStatus === "approved" ||
      normalizedStatus === "aprovado" ||
      normalizedStatus === "aprovada"
    ) {
      statusKey = "approved";
    } else if (
      normalizedStatus === "rejected" ||
      normalizedStatus === "rejeitado" ||
      normalizedStatus === "rejeitada"
    ) {
      statusKey = "rejected";
    }
  }

  const statusLabel = {
    pending: "Pendente",
    approved: "Aprovado",
    rejected: "Rejeitado",
  };

  const statusColor = {
    pending: "#F59E0B",
    approved: "#16A34A",
    rejected: "#EF4444",
  };

  const statusInfo = {
    pending: "Sua inscrição está sendo avaliada.",
    approved: "Sua inscrição foi aprovada!",
    rejected: "Sua inscrição foi rejeitada.",
  };

  const handleStatusPress = () => {
    setShowStatusInfo(true);
    if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    statusTimeoutRef.current = setTimeout(() => setShowStatusInfo(false), 3000);
  };

  React.useEffect(() => {
    return () => {
      if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    };
  }, []);

  // console.log("Dados da oportunidade recebidos:", data);

  const nomeEsporte = esporte?.nomeEsporte || "Esporte não informado";

  const [mensagem, setMensagem] = useState("");
  const [mensagemTipo, setMensagemTipo] = useState("");
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ["45%", "50%"], []);

  const abrirDetalhes = useCallback(() => {
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
      setLocalStatus("pendente");
      setMensagemTipo("sucesso");
      setMensagem("Você se inscreveu nesta oportunidade!");
    } catch (error) {
      if (error.response?.status === 409) {
        setLocalStatus("pendente");
        setMensagemTipo("erro");
        setMensagem("Você já está inscrito nesta oportunidade!");
      } else {
        setMensagemTipo("erro");
        setMensagem("Não foi possível se inscrever. Tente novamente.");
        console.error("Erro ao se inscrever na oportunidade:", error);
      }
    }
  };

  const fotoPerfilUrl = data?.clube?.fotoPerfilClube
    ? `http://127.0.0.1:8000/storage/${data.clube.fotoPerfilClube}`
    : data?.oportunidade?.clube?.fotoPerfilClube
      ? `http://127.0.0.1:8000/storage/${data.oportunidade.clube.fotoPerfilClube}`
      : null;

  return (
    <View className="w-full mb-4 items-center flex-row bg-white p-4 rounded-3xl border-[2px] border-[#76D292] gap-4">
      <Pressable
        onPress={abrirDetalhes}
        className="flex-1  justify-between items-center"
      >
        {statusKey ? (
          <Pressable
            onPress={handleStatusPress}
            className="px-9 py-1 rounded-xl mb-[10px]"
            style={{
              backgroundColor: statusColor[statusKey] || "#E5E7EB",
            }}
          >
            <Text className="text-white text-xs">
              {statusLabel[statusKey] || status}
            </Text>
          </Pressable>
        ) : null}

        {showStatusInfo && statusKey ? (
          <Text
            style={{
              color: "#6B7280",
              fontSize: 12,
              marginBottom: 6,
              textAlign: "center",
              maxWidth: 120,
            }}
          >
            {statusInfo[statusKey]}
          </Text>
        ) : null}
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

          <View className="items-center">
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
                className=" text-gray-600 text-[18px]"
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

            {statusKey ? null : (
              <Pressable
                onPress={handleTenhoInteresse}
                className="mt-6 p-3 bg-[#49D372] items-center justify-center rounded-xl"
              >
                <Text className="text-white font-semibold">
                  Tenho interesse
                </Text>
              </Pressable>
            )}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
