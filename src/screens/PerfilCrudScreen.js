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
  handleForm,
  createPerfil,
  loadPerfilAll,
  updatePerfil,
  excluirPerfil,
} from "../../services/perfil";
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

  const handleCreateForm = async (id) => {
    const response = await handleForm(id);
    setPosicoes(response.posicoes);
    setCategorias(response.categorias);
    setCaracteristicas(response.caracteristicas);
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
    const perfil = Object.entries(perfis)
      .flat()
      .find((p) => p.esporte_id === esporte.item.id);
    if (!perfil) return;

    await excluirPerfil(perfil.id);

    await carregarPerfisUsuario();
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
      esporte_id: esporte.item.id,
      caracteristicas: caracteristicasFormatadas,
      posicoes: selectedPosicoes,
    };

    console.log("Form Data para envio:", form);

    try {
      if (crud === "create") {
        const response = await createPerfil(form);
        console.log("Perfil criado:", response);
        navigation.replace("MainTabs", {
          screen: "Perfil",
        });
      } else if (crud === "update") {
        const perfil = Object.values(perfis)
          .flat()
          .find((p) => p.esporte_id === esporte.item.id);

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
      await handleCreateForm(esporte.item.id);

      if (crud === "update" && perfis && esporte?.item?.id) {
        const perfil = Object.values(perfis)
          .flat()
          .find((p) => p.esporte_id === esporte.item.id);

        if (perfil) {
          setSelectedCategoria(perfil.categoria_id);
          setSelectedPosicoes(perfil.posicoes.map((p) => p.id));
          const caracteristicasMap = {};
          perfil.caracteristicas.forEach((c) => {
            caracteristicasMap[c.id] = c.pivot?.valor || "";
          });
          setCaracteristicaValues(caracteristicasMap);

          console.log("Perfil carregado para edição:", perfil);
        } else {
          console.warn("Nenhum perfil encontrado para esse esporte.");
        }
      }
    };

    carregarDados();
  }, [crud, esporte, perfis]);

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
              style={{ width: 12, height: 22, tintColor: "#FFFFFF", marginRight: 4 }}
            />
          </Pressable>
          <Text style={tw`text-[20px] `}>
            {crud === "create" ? "Criar Perfil" : "Editar Perfil"}
          </Text>
        </View>
        <Text style={tw`text-3xl font-semiBold text-gray-700 mb-6`}>
          {esporte?.item?.nomeEsporte}
        </Text>
      </View>

      {/* Categoria Picker */}
      <Text style={tw`text-[22px] font-semibold mb-2 text-[#61D483]`}>
        Categoria
      </Text>
      <View style={tw`border border-gray-300 rounded-lg mb-4 p-2`}>
        <Picker
          selectedValue={selectedCategoria}
          onValueChange={(itemValue) => setSelectedCategoria(itemValue)}
          className="outline-none text-gray-700"
        >
          <Picker.Item label="Selecione uma Categoria" value={null} />
          {categorias.map((cat) => (
            <Picker.Item key={cat.id} label={cat.nomeCategoria} value={cat.id} />
          ))}
        </Picker>
      </View>

      {/* Posições */}
        {posicoes.length > 0 && (
        <>
    <Text style={tw`text-[22px] font-semibold mt-4 mb-2 text-[#61D483]`}>Posições</Text>
      <View style={tw`flex-row flex-wrap mb-2`}>
        {posicoes.map((pos) => (
          <Pressable
            key={pos.id}
            style={tw`px-5 py-3 m-1 rounded-[12px] ${
              selectedPosicoes.includes(pos.id) ? "bg-[#61D48370]" : "bg-gray-200"
            }`}
            onPress={() => togglePosicao(pos.id)}
          >
            <Text
              style={[tw`${
                selectedPosicoes.includes(pos.id)
                  ? "text-[#2E7844]"
                  : "text-gray-800"
              } semi-bold`]}
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
          <Text style={tw`text-[22px] font-semibold mt-4 mb-2 text-[#61D483]`}>
            Características
          </Text>
          {caracteristicas.map((carac) => (
            <View key={carac.id} style={tw`mb-4`}>
              <Text style={tw`text-[16px] mb-1`}>
                {carac.caracteristica} ({carac.unidade_medida}):
              </Text>
              <TextInput
                style={tw`border border-[#61D483] border-2 p-3 outline-none rounded-lg`}
                keyboardType="numeric"
                placeholder={`Digite a ${carac.caracteristica}`}
                value={caracteristicaValues[carac.id] || ""}
                onChangeText={(text) => handleCaracteristicaChange(carac.id, text)}
              />
            </View>
          ))}
        </>
      )}

      <View style={tw`flex-row justify-between gap-4 mt-10`}>
        {crud === "update" && (
          <Pressable
            className="bg-[#f06969] w-[150px] h-12 flex-row items-center justify-center rounded-[12px] p-1 gap-2"
            onPress={handleDelete}
          >
            <Image
                source={require("../../assets/icons/delete.png")}
                style={{ width: 16, height: 23, tintColor: "#ffff" }}
              />
            <Text style={tw`font-semibold text-base text-[120%] ml-2 text-white`}>
              Apagar
            </Text> 
          </Pressable>
        )}

        <Pressable
          className="bg-[#61D483] w-[150px] h-12 flex-row items-center justify-center gap-8 rounded-[12px] p-1 flex"
          onPress={handleSubmit}
        >
          <Text style={tw`font-semibold text-base text-[120%] ml-2 text-white`}>
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
