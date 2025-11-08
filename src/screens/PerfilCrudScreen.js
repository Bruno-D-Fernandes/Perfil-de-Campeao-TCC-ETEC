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
    console.log("reponse da construção de formulario: ", response);
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

    console.log(selectedPosicoes);
    carregarDados();
  }, [crud, esporte, perfis]);

  return (
    <ScrollView style={tw`flex-1 p-4`}>
      <Text style={tw`text-3xl font-bold mb-6`}>
        {crud === "create"
          ? `Criar perfil para ${esporte.item?.nomeEsporte}`
          : `Editar perfil de ${esporte.item?.esporte.nomeEsporte}`}
      </Text>

      {/* Categoria Picker */}
      <Text style={tw`text-xl font-semibold mt-4 mb-2`}>Categoria:</Text>
      <View style={tw`border border-gray-300 rounded-lg mb-4`}>
        <Picker
          selectedValue={selectedCategoria}
          onValueChange={(itemValue) => setSelectedCategoria(itemValue)}
          style={tw`w-full`}
        >
          <Picker.Item label="Selecione uma Categoria" value={null} />
          {categorias.map((cat) => (
            <Picker.Item
              key={cat.id}
              label={cat.nomeCategoria}
              value={cat.id}
            />
          ))}
        </Picker>
      </View>

      {/* Posições Multi-select */}
      <Text style={tw`text-xl font-semibold mt-4 mb-2`}>Posições:</Text>
      <View style={tw`flex-row flex-wrap mb-4`}>
        {posicoes.map((pos) => (
          <Pressable
            key={pos.id}
            style={tw`px-4 py-2 m-1 rounded-full ${
              selectedPosicoes.includes(pos.id) ? "bg-blue-500" : "bg-gray-200"
            }`}
            onPress={() => togglePosicao(pos.id)}
          >
            <Text
              style={tw`${
                selectedPosicoes.includes(pos.id)
                  ? "text-white"
                  : "text-gray-800"
              }`}
            >
              {pos.nomePosicao}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Características Dinâmicas */}
      <Text style={tw`text-xl font-semibold mt-4 mb-2`}>Características:</Text>
      {caracteristicas.map((carac) => (
        <View key={carac.id} style={tw`mb-4`}>
          {console.log("Caracterista:", carac)}
          <Text style={tw`text-lg mb-1`}>
            {carac.caracteristica} ({carac.unidade_medida}):
          </Text>
          <TextInput
            style={tw`border border-gray-300 p-3 rounded-lg`}
            keyboardType="numeric"
            placeholder={`Digite a ${carac.caracteristica}`}
            value={caracteristicaValues[carac.id] || ""}
            onChangeText={(text) => handleCaracteristicaChange(carac.id, text)}
          />
        </View>
      ))}

      <Pressable
        style={tw`bg-green-500 p-4 rounded-lg mt-6 mb-10 items-center`}
        onPress={handleSubmit}
      >
        <Text style={tw`text-white text-lg font-bold`}>Salvar Perfil</Text>
      </Pressable>

      <Pressable
        style={tw`bg-yellow-500 p-4 rounded-lg mt-6 mb-10 items-center`}
        onPress={() => {
          navigation.replace("MainTabs", {
            screen: "Perfil",
          });
        }}
      >
        <Text style={tw`text-white text-lg font-bold`}>Cancelar</Text>
      </Pressable>

      {crud === "update" && (
        <Pressable
          style={tw`bg-red-500 p-4 rounded-lg mt-6 mb-10 items-center`}
          onPress={handleDelete}
        >
          <Text style={tw`text-white text-lg font-bold`}>Excluir Perfil</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}
