import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";
import Oportunidade from "../components/Oportunidade";
import oportunidadesService from "../../services/oportunidades";
import { useEffect, useState } from "react";
import usuarioService from "../../services/usuario";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OportunidadesScreen() {
  const [nameUser, setNameUser] = useState("Usuário");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const fetchAndSetUserData = async () => {
    try {
      const response = await usuarioService.perfilUser();
      console.log("Dados do usuário da API:", response);

      const userObj = response?.data || response || null;
      if (userObj) {
        await AsyncStorage.setItem("user", JSON.stringify(userObj));
        const firstName = userObj?.nomeCompletoUsuario
          ? String(userObj.nomeCompletoUsuario).split(" ")[0]
          : "Usuário";
        setNameUser(firstName || "Usuário");
      }
    } catch (err) {
      console.error("Erro ao buscar dados do usuário da API:", err);
    }
  };

  // Função para buscar oportunidades
  const fetchOportunidades = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await usuarioService.oportunidadeData(page, perPage);
      const newItems = response?.data?.data || response?.data || [];

      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setData((prev) => [...prev, ...newItems]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Erro ao buscar oportunidades:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeScreenData = async () => {
      const storedUserData = await AsyncStorage.getItem("user");
      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          setNameUser(
            parsedUserData.nomeCompletoUsuario.split(" ")[0] || "Usuário"
          );
        } catch (parseError) {
          console.error(
            "Erro ao parsear userData do AsyncStorage:",
            parseError
          );
        }
      }
      fetchAndSetUserData();
      fetchOportunidades();
    };

    initializeScreenData();
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchOportunidades();
    }
  }, [page]);

  useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_500Medium,
  });

  return (
    <View className="bg-white flex-1 p-4">
      {/* HEADER */}
      <View className="w-full h-[34%]">
        <View className="flex-row items-center justify-between mb-[8%]">
          <Image
            source={require("../../assets/post/perfilFoto.png")}
            className="w-10 h-10 rounded-full"
          />

          <View className="w-[28%] flex-row items-center justify-between">
            {/*BTN NOTIFICACAO*/}
            <Pressable className="rounded-full bg-[#EFEFEF] h-[90%] w-[45%] items-center justify-center">
              <Image
                source={require("../../assets/icons/notificacao.png")}
                style={{ width: "30%", height: "35%" }}
              />
            </Pressable>

            {/*BTN MENSSAGEM*/}
            <Pressable className="rounded-full bg-[#EFEFEF] h-[90%] w-[45%] items-center justify-center">
              <Image
                source={require("../../assets/icons/mensagem.png")}
                style={{ width: "38%", height: "40%" }}
              />
            </Pressable>
          </View>
        </View>

        <View className="w-full mb-[8%] gap-5">
          <Text
            className="text-[26px] font-medium"
            style={{ fontFamily: "Poppins_500Medium" }}
          >
            Olá, {nameUser}
          </Text>
          <Text
            className="text-[19px] font-medium text-[#2E7844]"
            style={{ fontFamily: "Poppins_500Medium" }}
          >
            Oportunidades
          </Text>
        </View>

        <View className="w-full h-[18%] flex-row gap-2">
          {/*BTN FILTRO*/}
          <Pressable className="rounded-full bg-[#EFEFEF] h-[90%] w-[12%] items-center justify-center">
            <Image
              source={require("../../assets/icons/filtro.png")}
              style={{ width: "38%", height: "40%" }}
            />
          </Pressable>

          <View className="h-[90%] w-[85%] rounded-full bg-[#EFEFEF] gap-4 flex-row items-center">
            <Image
              source={require("../../assets/icons/pesquisa.png")}
              style={{ width: "7%", height: "50%", marginLeft: 10 }}
            />

            {/*CAMPO DE PESQUISA*/}
            <TextInput
              className="color-gray-600 font-normal w-[80%] h-[80%]"
              style={{ fontFamily: "Poppins_400Regular" }}
              placeholder="Pesquisar"
            />
          </View>
        </View>
      </View>

      {/* FEED */}
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Oportunidade data={item} />}
        onEndReached={fetchOportunidades}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator
              size="large"
              color="#2E7844"
              style={{ marginVertical: 16 }}
            />
          ) : null
        }
      />
    </View>
  );
}
