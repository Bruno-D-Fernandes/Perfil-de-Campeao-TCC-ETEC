import { useRoute } from "@react-navigation/native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";
import {
  handleForm,
  createPerfil,
  loadPerfilAll,
  updatePerfil,
  excluirPerfil,
} from "../services/perfil";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PerfilCrudScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { esporte, crud, perfis } = route.params || {};
  const [categorias, setCategorias] = useState([]);
  const [posicoes, setPosicoes] = useState([]);
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [selectedPosicoes, setSelectedPosicoes] = useState([]);
  const [caracteristicaValues, setCaracteristicaValues] = useState({});
  const [totalPerfisUsuario, setTotalPerfisUsuario] = useState(0); // Novo estado

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_500Medium,
  });

  const handleCreateForm = async (id) => {
    const response = await handleForm(id);
    console.log("reponse da construção de formulario: ", response);
    setPosicoes(response.posicoes);
    setCategorias(response.categorias);
    setCaracteristicas(response.caracteristicas);
  };

  // Função para contar o total de perfis do usuário
  const contarTotalPerfis = async () => {
    try {
      const todosPerfis = await loadPerfilAll();
      let total = 0;

      // Conta todos os perfis em todas as categorias
      Object.values(todosPerfis).forEach((perfisPorEsporte) => {
        total += perfisPorEsporte.length;
      });

      setTotalPerfisUsuario(total);
      console.log("Total de perfis do usuário:", total);
    } catch (error) {
      console.error("Erro ao contar perfis:", error);
    }
  };

  const togglePosicao = (posicaoId) => {
    setSelectedPosicoes((prev) =>
      prev.includes(posicaoId)
        ? prev.filter((id) => id !== posicaoId)
        : [...prev, posicaoId]
    );
  };

  const handleCaracteristicaChange = (id, value) => {
    setCaracteristicaValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleDelete = async () => {
    const perfilArray = Object.values(perfis).flat();
    const perfil = perfilArray[0];
    const response = await excluirPerfil(perfil.id);

    navigation.replace("MainTabs", {
      screen: "Perfil",
    });
  };

  const handleSubmit = async () => {
    const caracteristicasFormatadas = Object.entries(caracteristicaValues).map(
      ([id, valor]) => ({
        id: parseInt(id),
        valor: valor,
      })
    );

    let userId = await AsyncStorage.getItem("user");
    userId = JSON.parse(userId);

    const form = {
      usuario_id: userId.id,
      categoria_id: selectedCategoria,
      esporte_id: esporte.item.esporte_id,
      caracteristicas: caracteristicasFormatadas,
      posicoes: selectedPosicoes,
    };

    console.log("Form Data para envio:", form);

    try {
      if (crud === "create") {
        form.esporte_id = esporte.item.id;

        const response = await createPerfil(form);
        console.log("Perfil criado:", response);
        navigation.replace("MainTabs", {
          screen: "Perfil",
        });
      } else if (crud === "update") {
        const perfilArray = Object.values(perfis).flat();
        const perfil = perfilArray[0];

        if (!perfil) {
          console.warn("Nenhum perfil encontrado para atualizar.");
          return;
        }

        const response = await updatePerfil(perfil.id, form);
        console.log("Perfil atualizado:", response);

        navigation.replace("MainTabs", {
          screen: "Perfil",
        });
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
    }
  };

  useEffect(() => {
    const carregarDados = async () => {
      console.log("esporte solicitado para construção: ", esporte.item.id);

      crud === "create"
        ? await handleCreateForm(esporte.item.id)
        : await handleCreateForm(esporte.item.esporte_id);

      if (crud === "update" && perfis) {
        const perfisArray = Object.values(perfis).flat();
        const perfil = perfisArray[0];

        if (perfil) {
          setSelectedCategoria(perfil.categoria_id);
          setSelectedPosicoes(perfil.posicoes.map((p) => p.id));
          const caracteristicasMap = {};
          perfil.caracteristicas.forEach((c) => {
            caracteristicasMap[c.id] = c.pivot?.valor || "";
          });
          setCaracteristicaValues(caracteristicasMap);

          console.log("Perfil carregado para edição:", caracteristicas);
        } else {
          console.warn("Nenhum perfil encontrado para esse esporte.");
        }
      }
    };

    // Carrega o total de perfis quando o componente montar
    contarTotalPerfis();

    console.log(selectedPosicoes);
    carregarDados();
  }, [crud, esporte, perfis]);

  if (!fontsLoaded) return null;

  return (
    <ScrollView style={tw`flex-1 p-4 bg-white`}>
      <View style={tw``}>
        <View style={tw`flex-row items-center gap-20 mb-8`}>
          <Pressable
            style={tw`p-3 h-12 w-12 bg-[#61D483] rounded-full items-center justify-center`}
            onPress={() => {
              navigation.replace("MainTabs", {
                screen: "Perfil",
              });
            }}
          >
            <Image
              source={require("../../assets/icons/icon_voltar.png")}
              style={{
                width: 12,
                height: 22,
                tintColor: "#FFFFFF",
                marginRight: 4,
              }}
            />
          </Pressable>
          <Text style={[tw`text-[20px]`, { fontFamily: "Poppins_500Medium" }]}>
            {crud === "create" ? "Criar Perfil" : "Editar Perfil"}
          </Text>
        </View>
        <Text
          style={[
            tw`text-3xl font-semiBold mb-6`,
            { fontFamily: "Poppins_500Medium" },
          ]}
        >
          {crud === "create"
            ? `${esporte.item?.nomeEsporte}`
            : `${esporte.item?.esporte.nomeEsporte}`}
        </Text>
      </View>

      {/* Categoria Picker */}
      <Text
        style={[
          tw`text-[22px]  mb-2 text-[#61D483]`,
          { fontFamily: "Poppins_500Medium" },
        ]}
      >
        Categoria
      </Text>
      <View style={tw`border border-gray-300 rounded-lg mb-4 p-2`}>
        <Picker
          selectedValue={selectedCategoria}
          onValueChange={(itemValue) => setSelectedCategoria(itemValue)}
          className="outline-none text-gray-700"
          style={{ fontFamily: "Poppins_500Medium" }}
        >
          <Picker.Item
            label="Selecione uma Categoria"
            value={null}
            style={{ fontFamily: "Poppins_500Medium" }}
          />
          {categorias.map((cat) => (
            <Picker.Item
              key={cat.id}
              label={cat.nomeCategoria}
              value={cat.id}
              style={{ fontFamily: "Poppins_500Medium" }}
            />
          ))}
        </Picker>
      </View>

      {/* Posições */}
      {posicoes.length > 0 && (
        <>
          <Text
            style={[
              tw`text-[22px]  mt-4 mb-2 text-[#61D483]`,
              { fontFamily: "Poppins_500Medium" },
            ]}
          >
            Posições
          </Text>
          <View style={tw`flex-row flex-wrap mb-2`}>
            {posicoes.map((pos) => (
              <Pressable
                key={pos.id}
                style={tw`px-5 py-3 m-1 rounded-[12px] ${
                  selectedPosicoes.includes(pos.id)
                    ? "bg-[#61D48370]"
                    : "bg-gray-200"
                }`}
                onPress={() => togglePosicao(pos.id)}
              >
                <Text
                  style={[
                    tw`${
                      selectedPosicoes.includes(pos.id)
                        ? "text-[#2E7844]"
                        : "text-gray-800"
                    }`,
                    { fontFamily: "Poppins_500Medium" },
                  ]}
                >
                  {pos.nomePosicao}
                </Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      {caracteristicas.length > 0 && (
        <>
          <Text
            style={[
              tw`text-[22px] mt-4 mb-2 text-[#61D483]`,
              { fontFamily: "Poppins_500Medium" },
            ]}
          >
            Características
          </Text>
          {caracteristicas.map((carac) => (
            <View key={carac.id} style={tw`mb-4`}>
              <Text
                style={[
                  tw`text-[14px] mb-1`,
                  { fontFamily: "Poppins_400Regular" },
                ]}
              >
                {carac.caracteristica} ({carac.unidade_medida}):
              </Text>
              <TextInput
                style={[
                  tw`border border-[#61D483] border-2 p-3 outline-none rounded-lg`,
                  { fontFamily: "Poppins_400Regular" },
                ]}
                keyboardType="numeric"
                placeholder={`Digite a ${carac.caracteristica}`}
                value={caracteristicaValues[carac.id] || ""}
                onChangeText={(text) =>
                  handleCaracteristicaChange(carac.id, text)
                }
              />
            </View>
          ))}
        </>
      )}

      <View style={tw`flex-row justify-between gap-4 mt-10`}>
        {/* Botão de deletar - APENAS se for update E o usuário tiver mais de um perfil */}
        {crud === "update" && totalPerfisUsuario > 1 && (
          <Pressable
            className="bg-[#f06969] w-[150px] h-12 flex-row items-center justify-center rounded-[12px] p-1 gap-2"
            onPress={handleDelete}
          >
            <Image
              source={require("../../assets/icons/delete.png")}
              style={{ width: 16, height: 23, tintColor: "#ffff" }}
            />
            <Text
              style={[
                tw`font-semibold text-base text-[6] ml-2 text-white`,
                { fontFamily: "Poppins_500Medium" },
              ]}
            >
              Apagar
            </Text>
          </Pressable>
        )}

        <Pressable
          className="bg-[#61D483] w-[150px] h-12 flex-row items-center justify-center gap-4 rounded-[12px] p-1 flex"
          onPress={handleSubmit}
        >
          <Text
            style={[
              tw`font-semibold text-base text-[6] ml-2 text-white`,
              { fontFamily: "Poppins_500Medium" },
            ]}
          >
            Salvar
          </Text>
          <Image
            source={require("../../assets/icons/icon_salvar.png")}
            style={{ width: 18, height: 13, tintColor: "#ffff" }}
          />
        </Pressable>
      </View>
    </ScrollView>
  );
}
