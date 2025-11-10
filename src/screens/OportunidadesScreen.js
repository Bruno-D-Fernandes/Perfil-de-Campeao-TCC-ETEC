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
import { useEffect, useState, useMemo } from "react";
import usuarioService from "../../services/usuario";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OportunidadesScreen() {
  const [nameUser, setNameUser] = useState("Usuário");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [searchText, setSearchText] = useState("");

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
        setNameUser(firstName || setLoading(true));
      }
    } catch (err) {
      console.error("Erro ao buscar dados do usuário da API:", err);
    }
  };

  const fetchOportunidades = async () => {
    if (loading || !hasMore || searchText.length > 0) return;

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

  const filteredData = useMemo(() => {
    if (!searchText) {
      return data;
    }

    const lowerCaseSearch = searchText.toLowerCase();

    return data.filter((item) => {
      const clubeNome = item.clube?.nomeClube?.toLowerCase() || "";
      const posicaoNome = item.posicao?.nomePosicao?.toLowerCase() || "";
      const esporteNome = item.esporte?.nomeEsporte?.toLowerCase() || "";

      return (
        clubeNome.includes(lowerCaseSearch) ||
        posicaoNome.includes(lowerCaseSearch) ||
        esporteNome.includes(lowerCaseSearch) ||
        titulo.includes(lowerCaseSearch)
      );
    });
  }, [data, searchText]);

  return (
    <View className="bg-white flex-1 p-4">
      {/* HEADER */}
      <View className="w-full h-[29%]">
        <View className="flex-row items-center justify-between mb-[3%]">
          <Image
            source={require("../../assets/Logo_PerfilDeCampeao.png")}
            style={{ width: "50px", height: "50px" }}
            resizeMode="stretch"
          />

          <View className="w-[45px] h-[45px] flex-row items-center justify-center">
            {/*BTN chat*/}
            <Pressable className="rounded-full bg-[#EFEFEF] h-[100%] w-[100%] items-center justify-center">
              <Image
                source={require("../../assets/icons/mensagem.png")}
                style={{ width: "20px", height: "20px" }}
              />
            </Pressable>
          </View>
        </View>

        <View className="w-full mb-[7%] gap-5">
          <Text
            className="text-[26px] font-medium"
            style={{ fontFamily: "Poppins_500Medium" }}
          >
            Olá, {nameUser}
          </Text>
          <Text
            className="text-[24px] font-medium text-[#2E7844]"
            style={{ fontFamily: "Poppins_500Medium" }}
          >
            Oportunidades
          </Text>
        </View>

        <View className="w-full h-[19%] flex-row gap-2 mb-[2%]">
          {/*BTN FILTRO*/}
          <Pressable className="rounded-full bg-[#EFEFEF] h-[100%] w-[14%] items-center justify-center">
            <Image
              source={require("../../assets/icons/filtro.png")}
              style={{ width: "20px", height: "20px" }}
            />
          </Pressable>

          <View className="h-[100%] w-[85%] rounded-full bg-[#EFEFEF] gap-4 flex-row items-center">
            <Image
              source={require("../../assets/icons/pesquisa.png")}
              style={{ width: "22px", height: "22px", marginLeft: 15 }}
            />
            <TextInput
              className="color-gray-600 font-normal w-[80%] h-[90%]"
              style={{ fontFamily: "Poppins_400Regular" }}
              placeholder="Pesquisar"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>
      </View>

      {/* FEED */}
      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Oportunidade data={item} />}
        onEndReached={fetchOportunidades}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          loading && !searchText ? (
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
