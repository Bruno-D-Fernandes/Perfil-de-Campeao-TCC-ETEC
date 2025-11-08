import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { useState, useEffect, use } from "react";
import * as ImagePicker from "expo-image-picker";
import tw from "twrnc";
import { fetchEsportesPerfil } from "../../../services/esporte";
import Animated from "react-native-reanimated";
import { FlatList } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";

export default function ModalPerfilEsporte({
  crud,
  visible,
  onClose,
  abrirSheet,
  fecharSheet,
  controllSheet,
  perfis,
}) {
  const navigation = useNavigation();

  // SHEETS
  // SHEETS
  // SHEETS

  const [esportesData, setEsportesData] = useState([]);

  useEffect(() => {
    if (crud === "create") {
      fetchDataCreate();
    } else if (perfis) {
      const listaPerfis = Array.isArray(perfis)
        ? perfis
        : Object.values(perfis).flat();

      setEsportesData(listaPerfis);
      console.log("modal de edição chamado, perfis:", listaPerfis);
    }
  }, [crud, perfis]);

  // FUNÇÕES DE USO
  // FUNÇÕES DE USO
  // FUNÇÕES DE USO
  // FUNÇÕES DE USO

  const fetchDataCreate = async () => {
    try {
      let esportes = await fetchEsportesPerfil();
      esportes = esportes.data;
      setEsportesData(esportes);
      console.log("Esportes buscados:");
      console.log(esportes);
    } catch (error) {
      console.error("Erro ao buscar esportes:", error);
    }
  };

  const handleCrudPerfil = (esporte) => {
    if (crud === "create") {
      navigation.replace("PerfilCrudScreen", {
        esporte: esporte,
        crud: "create",
      });
    } else {
      console.log("esporte escolhido: ", esporte);

      navigation.replace("PerfilCrudScreen", {
        esporte: esporte,
        crud: "update",
        perfis: perfis,
      });
    }

    // abrirSheet();
    onClose();
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={tw`flex-1 bg-black/30`}>
          <View style={tw`bg-white m-8 rounded-4 flex-1`}>
            {/* Header Modal */}
            {/* Header Modal */}
            {/* Header Modal */}

            <View
              style={tw`flex-row justify-between items-center border-b border-gray-200 pb-2 p-4`}
            >
              <Text style={tw`text-lg font-semibold`}>
                {crud === "create"
                  ? "Criar Perfil"
                  : crud === "update"
                    ? "Editar Perfil"
                    : "Deletar Perfil"}
              </Text>
              <Pressable onPress={onClose}>
                <Text style={tw`text-lg font-semibold text-red-500`}>
                  Cancelar
                </Text>
              </Pressable>
            </View>

            {/* Body Modal */}
            {/* Body Modal */}
            {/* Body Modal */}

            <FlatList
              data={esportesData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <View
                  style={tw` mt-1 mx-2 rounded-2 border-2 border-green-300 p-4 flex flex-row justify-between`}
                >
                  <Text style={tw`text-base font-medium`}>
                    {crud === "create"
                      ? item.nomeEsporte
                      : item?.esporte.nomeEsporte}
                  </Text>

                  <Pressable onPress={() => handleCrudPerfil({ item })}>
                    <Text style={tw`text-sm text-green-400 underline mt-2`}>
                      {crud === "create"
                        ? "Criar"
                        : crud === "update"
                          ? "Editar"
                          : "Deletar"}
                    </Text>
                  </Pressable>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}
