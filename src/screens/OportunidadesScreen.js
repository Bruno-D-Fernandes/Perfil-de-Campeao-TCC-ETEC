import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  FlatList,
  ActivityIndicator,
  Modal,
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
import { inscricoesOportunidades } from "../../services/oportunidades";

export default function OportunidadesScreen() {
  const [nameUser, setNameUser] = useState("Usuário");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [searchText, setSearchText] = useState("");
  const [inscritoAba, setInscritoAba] = useState(false);
  // Filtros
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterEsporte, setFilterEsporte] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [filterIdadeMin, setFilterIdadeMin] = useState("");
  const [filterIdadeMax, setFilterIdadeMax] = useState("");
  const [appliedFilters, setAppliedFilters] = useState(null);

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
    // não pagina quando há busca por texto ou filtros aplicados (carregamento específico)
    if (loading || !hasMore || searchText.length > 0 || appliedFilters) return;

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

  const applyFilters = async () => {
    const filters = {};
    if (filterEsporte) filters.esporte = filterEsporte;
    if (filterEstado) filters.estado = filterEstado;
    if (filterIdadeMin) filters.idadeMinima = Number(filterIdadeMin);
    if (filterIdadeMax) filters.idadeMaxima = Number(filterIdadeMax);

    setFilterModalVisible(false);
    setAppliedFilters(Object.keys(filters).length ? filters : null);

    // Faz a chamada ao backend com filtros (página 1) usando oportunidadesService.oportunidadeFiltrar
    setLoading(true);
    try {
      const response = await oportunidadesService.oportunidadeFiltrar(filters);
      const newItems = response?.data || response || [];
      setData(newItems);
      setPage(2);
      setHasMore(newItems.length >= perPage);
    } catch (error) {
      console.error("Erro ao aplicar filtros:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = async () => {
    setFilterEsporte("");
    setFilterEstado("");
    setFilterIdadeMin("");
    setFilterIdadeMax("");
    setAppliedFilters(null);

    setLoading(true);
    try {
      const response = await usuarioService.oportunidadeData(1, perPage);
      const newItems = response?.data?.data || response?.data || [];
      setData(newItems);
      setPage(2);
      setHasMore(newItems.length >= perPage);
    } catch (error) {
      console.error("Erro ao limpar filtros:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInscricoes = async () => {
      try {
        setLoading(true);
        setData([]);
        const response = await inscricoesOportunidades();
        const inscricoes = response?.data || [];

        setData(inscricoes);
      } catch (error) {
        console.error("Erro ao buscar inscrições:", error);
      } finally {
        setLoading(false);
      }
    };

    if (inscritoAba) {
      fetchInscricoes();
    }
  }, [inscritoAba]);

  useEffect(() => {
    const initializeScreenData = async () => {
      setData([]);
      setPage(1);
      setHasMore(true);
      setSearchText("");

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

      setLoading(true);
      try {
        const response = await usuarioService.oportunidadeData(1, perPage);
        const newItems = response?.data?.data || response?.data || [];
        setData(newItems);
        setPage(2); // Próxima página é 2
        if (newItems.length < perPage) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Erro ao buscar oportunidades:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!inscritoAba) {
      initializeScreenData();
    }
  }, [inscritoAba]);

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

      return clubeNome.includes(lowerCaseSearch);
    });
  }, [data, searchText]);

  return (
    <View className="bg-white flex-1 p-4">
      {/* HEADER */}
      <View className="w-full h-[35%]">
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
            {inscritoAba ? "Inscrições" : "Oportunidades"}
          </Text>
        </View>

        <View className="w-full h-[19%] flex-row gap-2 mb-[2%]">
          {/*BTN FILTRO*/}
          <Pressable
            className="rounded-full bg-[#EFEFEF] h-[50px] w-[50px] items-center justify-center"
            onPress={() => setFilterModalVisible(true)}
          >
            <Image
              source={require("../../assets/icons/filtro.png")}
              style={{ width: "20px", height: "20px" }}
            />
          </Pressable>

          <View className="h-[50px] w-[85%] rounded-full bg-[#EFEFEF] gap-4 flex-row items-center">
            <Image
              source={require("../../assets/icons/pesquisa.png")}
              style={{ width: "22px", height: "22px", marginLeft: 15 }}
            />
            <TextInput
              className="color-gray-600 font-normal w-[80%] h-[90%]"
              style={{ fontFamily: "Poppins_400Regular" }}
              placeholder="Pesquisar por clube"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Modal de filtros */}
        <Modal
          visible={filterModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View className="flex-1 justify-end bg-black/30">
            <View className="bg-white p-4 rounded-t-3xl">

              <View className="flex-row items-center justify-between">
              <Text className="text-lg font-medium mb-2" style={{fontFamily:"Poppins_500Medium"}}>
                Filtrar oportunidades
              </Text>

              <Pressable onPress={() => setFilterModalVisible(false)}>
                <Image source={require('../../assets/icons/cancelar.png')} className="mb-2"/>
              </Pressable>
              </View>

              <Text className="mt-2 text-[18px] font-semibold" styles={{fontFamily:"Poppins_500Medium",}}>Esporte</Text>
              <TextInput
                className="border border-[#36A958] text-[18px] outline-none p-2 rounded-[10px] mt-1"
                placeholder="Ex: Futebol"
                value={filterEsporte}
                onChangeText={setFilterEsporte}
              />

              <View className="mt-4"> 
                <Text className="text-gray-600 mt-2 text-[16px] font-semibold " style={{fontFamily:'Poppins_500Medium',}}>
                  Estado / Cidade
                </Text>
                <TextInput
                  className="border border-[#36A958] text-[18px] outline-none p-2 rounded-[10px] mt-"
                  placeholder="Ex: SP"
                  value={filterEstado}
                  onChangeText={setFilterEstado}
                />
              </View>

              <View className="flex-row gap-2 mt-4 mb-10">
                <View className="flex-1">
                  <Text className="text-[16px] text-gray-600 font-semibold" style={{fontFamily:'Poppins_500Medium',}}>Idade mínima</Text>
                  <TextInput
                    className="border border-[#36A958] text-[18px] outline-none  p-2 rounded-[10px] mt-1"
                    placeholder="Ex: 12"
                    keyboardType="numeric"
                    value={filterIdadeMin}
                    onChangeText={setFilterIdadeMin}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-[16px] text-gray-600 font-semibold"  style={{fontFamily:'Poppins_500Medium',}}>Idade máxima</Text>
                  <TextInput
                    className="border border-[#36A958] text-[18px] outline-none p-2 rounded-[10px] mt-1"
                    placeholder="Ex: 18"
                    keyboardType="numeric"
                    value={filterIdadeMax}
                    onChangeText={setFilterIdadeMax}
                  />
                </View>
              </View>

              <View className="flex-row justify-between mt-4">
                <Pressable
                  className="p-3 rounded-xl bg-gray-200 flex-1 mr-2 items-center"
                  onPress={() => {
                    setFilterModalVisible(false);
                    clearFilters();
                  }}
                >
                  <Text>Limpar</Text>
                </Pressable>

                <Pressable
                  className="p-3 rounded-xl bg-[#49D372] flex-1 ml-2 items-center"
                  onPress={applyFilters}
                >
                  <Text className="text-white">Aplicar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <View className="w-full flex-row justify-around mt-[2%]">
          <Pressable onPress={() => setInscritoAba(false)}>
            <Text
              className={`text-[16px] font-medium ${
                !inscritoAba ? "text-[#2E7844]" : "text-gray-400"
              }`}
              style={{ fontFamily: "Poppins_500Medium" }}
            >
              Oportunidades
            </Text>
            {!inscritoAba && (
              <View className="h-1 bg-[#2E7844] rounded-full mt-1" />
            )}
          </Pressable>

          <Pressable onPress={() => setInscritoAba(true)}>
            <Text
              className={`text-[16px] font-medium ${
                inscritoAba ? "text-[#2E7844]" : "text-gray-400"
              }`}
              style={{ fontFamily: "Poppins_500Medium" }}
            >
              Inscrições
            </Text>
            {inscritoAba && (
              <View className="h-1 bg-[#2E7844] rounded-full mt-1" />
            )}
          </Pressable>
        </View>
      </View>

      {/* FEED */}

      {data.length === 0 && !loading ? (
        <View className="w-full h-[30%] items-center justify-center">
          <Text className="text-gray-400 text-sm">
            {inscritoAba
              ? "Você não tem inscrições no momento"
              : "Nenhuma oportunidade disponível"}
          </Text>
        </View>
      ) : (
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
      )}
    </View>
  );
}
