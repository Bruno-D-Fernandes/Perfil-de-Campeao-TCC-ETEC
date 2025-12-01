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
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Oportunidade from "../components/Oportunidade";
import oportunidadesService from "../services/oportunidades";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import usuarioService from "../services/usuario";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { inscricoesOportunidades } from "../services/oportunidades";
import { useNavigation } from "@react-navigation/native";
import ChatScreen from "./ChatScreen";
import api from "../services/axios";
import ProfileCreationBottomSheet from "../components/ProfileCreationBottomSheet";
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
  const [hasPerfil, setHasPerfil] = useState(false);

  const navigation = useNavigation();
  const profileSheetRef = useRef(null);

  const showProfileCreationSheet = useCallback(() => {
    profileSheetRef.current?.present();
  }, []);

  useEffect(() => {
    async function temPerfil() {
      try {
        const response = await api.get("/hasPerfil");
        const userHasProfile = response?.data?.hasPerfil === true;

        AsyncStorage.setItem("firstTime", String(userHasProfile));

        setHasPerfil(userHasProfile);

        if (!userHasProfile) {
          setTimeout(showProfileCreationSheet, 500);
        }
      } catch (error) {
        console.error("Erro ao verificar perfil:", error);
        setHasPerfil(false);
        setTimeout(showProfileCreationSheet, 500);
      }
    }

    temPerfil();
  }, []);

  // Carrega oportunidades quando volta para aba de Oportunidades
  useEffect(() => {
    const fetchOportunidadesAba = async () => {
      try {
        setLoading(true);
        setData([]);
        setPage(1);
        setHasMore(true);
        
        const response = await usuarioService.oportunidadeData(1, perPage);
        const newItems = response?.data?.data || response?.data || [];
      
        
        setData(newItems);
        setHasMore(newItems.length >= perPage);
      } catch (error) {
        console.error("Erro ao buscar oportunidades:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!inscritoAba) {
      fetchOportunidadesAba();
    }
  }, [inscritoAba]);

  const fetchOportunidades = async () => {
    // Não carrega mais se estamos na aba de inscrições
    if (inscritoAba) return;
    
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

  const loadMoreOportunidades = useCallback(() => {
    if (!inscritoAba) {
      fetchOportunidades();
    }
  }, [inscritoAba, page, loading, hasMore, searchText, appliedFilters]);

  const applyFilters = async () => {
    const filters = {};
    if (filterEsporte) filters.esporte = filterEsporte;
    if (filterEstado) filters.estado = filterEstado;
    if (filterIdadeMin) filters.idadeMinima = Number(filterIdadeMin);
    if (filterIdadeMax) filters.idadeMaxima = Number(filterIdadeMax);

    setFilterModalVisible(false);
    setAppliedFilters(Object.keys(filters).length ? filters : null);

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
        const inscricoes = response?.data?.data || response?.data || [];


        const transformedData = inscricoes.map((item) => {
          if (item.oportunidade) {
            return {
              ...item.oportunidade,
              status: item.status ?? item.oportunidade?.status ?? null,
              oportunidade: item.oportunidade,
              clube: item.oportunidade?.clube ?? item.clube ?? null,
            };
          }

          return {
            ...item,
            status: item.status ?? null,
            oportunidade: item,
            clube: item.clube ?? null,
          };
        });

        console.log("Dados transformados para setar:", transformedData);
        console.log("======================");
        setData(transformedData);
      } catch (error) {
        console.error("Errzo ao buscar inscrições:", error);
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
    <View className="bg-white flex-1 w-full px-6">
      {/* HEADER */}
      <View className="w-full pt-6 pb-4 flex-none">
        <View className="w-full flex-row items-center justify-end mb-8">
                 <Image source={require("../../assets/logoNome.png")} style={{width:150, height:70, tintColor:'#36A958', position:"absolute", top:-10, left:-25,}}/>

          <View className="w-[30%] h-[45px] mr-5 flex-row items-center justify-center gap-4">
            <Pressable
              onPress={() => navigation.navigate("Contatos")}
              className="rounded-full bg-[#EFEFEF] h-8 w-8 items-center justify-center"
            >
              <Image
                source={require("../../assets/icons/mensagem.png")}
                style={{ width: 16, height: 16 }}
              />
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate("Agenda")}
              className="rounded-full bg-[#EFEFEF] h-8 w-8 items-center justify-center"
            >
              <Image
                source={require("../../assets/cadastro/icon_data.png")}
                style={{
                  width: "18px",
                  height: "16px",
                  tintColor: "#36A958",
                }}
              />
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate("Config")}
              className="rounded-full bg-[#EFEFEF] h-8 w-8 items-center justify-center"
            >
              <Image
                source={require("../../assets/icons/config.png")}
                style={{ width: 18, height: 16, tintColor: "#36A958" }}
              />
            </Pressable>
          </View>
        </View>

        <View className="w-full mb-[7%] gap-2">
          <Text
            className="text-[26px] font-medium"
            style={{ fontFamily: "Poppins_500Medium" }}
          >
            Olá, {nameUser}
          </Text>
          <Text
            className="text-[18px] font-medium text-[#2E7844]"
            style={{ fontFamily: "Poppins_500Medium" }}
          >
            {inscritoAba ? "Inscrições" : "Oportunidades"}
          </Text>
        </View>

        <View className="w-full flex-row gap-2 mb-[2%]">
          {/*BTN FILTRO*/}
          <Pressable
            className="rounded-full bg-[#EFEFEF] h-[50px] w-[50px] items-center justify-center"
            onPress={() => setFilterModalVisible(true)}
          >
            <Image
              source={require("../../assets/icons/filtro.png")}
              style={{ width: 20, height: 20 }}
            />
          </Pressable>

          <View className="h-[50px] w-[85%] rounded-full bg-[#EFEFEF] gap-4 flex-row items-center justify-center">
            <Image
              source={require("../../assets/icons/pesquisa.png")}
              style={{ width: 22, height: 22, marginLeft: 15 }}
            />
            <TextInput
              className="color-gray-600 font-normal w-[80%] h-[90%] mt-[5px] m-auto"
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
                <Text
                  className="text-lg font-medium mb-2"
                  style={{ fontFamily: "Poppins_500Medium" }}
                >
                  Filtrar oportunidades
                </Text>

                <Pressable onPress={() => setFilterModalVisible(false)}>
                  <Image
                    source={require("../../assets/icons/cancelar.png")}
                    className="mb-2"
                  />
                </Pressable>
              </View>

              <Text
                className="mt-2 text-[18px] font-semibold"
                styles={{ fontFamily: "Poppins_500Medium" }}
              >
                Esporte
              </Text>
              <TextInput
                className="border border-[#36A958] text-[18px] outline-none p-2 rounded-[10px] mt-1"
                placeholder="Ex: Futebol"
                value={filterEsporte}
                onChangeText={setFilterEsporte}
              />

              <View className="mt-4">
                <Text
                  className="text-gray-600 mt-2 text-[16px] font-semibold "
                  style={{ fontFamily: "Poppins_500Medium" }}
                >
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
                  <Text
                    className="text-[16px] text-gray-600 font-semibold"
                    style={{ fontFamily: "Poppins_500Medium" }}
                  >
                    Idade mínima
                  </Text>
                  <TextInput
                    className="border border-[#36A958] text-[18px] outline-none  p-2 rounded-[10px] mt-1"
                    placeholder="Ex: 12"
                    keyboardType="numeric"
                    value={filterIdadeMin}
                    onChangeText={setFilterIdadeMin}
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-[16px] text-gray-600 font-semibold"
                    style={{ fontFamily: "Poppins_500Medium" }}
                  >
                    Idade máxima
                  </Text>
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

        <View className="w-full flex-row justify-between mt-[2%] px-9">
          <Pressable
            onPress={() => setInscritoAba(false)}
            className="items-center" // CORRIGIDO: Removido w-1/2 ou flex-1
          >
            <Text
              className={`text-[16px] font-medium ${
                !inscritoAba ? "text-[#2E7844]" : "text-gray-400"
              }`}
              style={{ fontFamily: "Poppins_500Medium" }}
              numberOfLines={1}
            >
              Oportunidades
            </Text>
            {!inscritoAba && (
              <View className="w-[50%] h-1 bg-[#2E7844] rounded-full mt-1" />
            )}
          </Pressable>
          <Pressable
            onPress={() => setInscritoAba(true)}
            className="items-center pr-4"
          >
            <Text
              className={`text-[16px] font-medium ${
                inscritoAba ? "text-[#2E7844]" : "text-gray-400"
              }`}
              style={{ fontFamily: "Poppins_500Medium" }}
              numberOfLines={1} // NOVO: Impede a quebra de linha
            >
              Inscrições
            </Text>
            {inscritoAba && (
              <View className="w-[50%] h-1 bg-[#2E7844] rounded-full mt-1" />
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
          onEndReached={loadMoreOportunidades}
          onEndReachedThreshold={0.2}
          contentContainerStyle={{ paddingTop: "4%", paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            loading && !searchText ? (
              <ActivityIndicator
                size="large"
                color="#2E7844"
                style={{ marginVertical: 16, marginTop: 20 }}
              />
            ) : null
          }
        />
      )}

      <ProfileCreationBottomSheet ref={profileSheetRef} onDismiss={() => {}} />
    </View>
  );
}
