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
import { fetchEsportesPerfil } from "../../services/esporte";
import Animated from "react-native-reanimated";
import { FlatList } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";

export default function ModalPerfilEsporte({
  crud,
  visible,
  onClose,
  abrirSheet,
  fecharSheet,
  controllSheet,
  perfis,
}) {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
  });

  const navigation = useNavigation();

  // SHEETS
  // SHEETS
  // SHEETS

  const [esportesData, setEsportesData] = useState([]);

  const icons =
    crud === "create"
      ? require("../../../assets/icons/mais.png")
      : require("../../../assets/icons/edit.png");

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
              <Text
                style={[
                  tw`text-lg font-semibold`,
                  { fontFamily: "Poppins_500Medium" },
                ]}
              >
                {crud === "create"
                  ? "Criar Perfil"
                  : crud === "update"
                    ? "Editar Perfil"
                    : "Deletar Perfil"}
              </Text>
              <Pressable onPress={onClose}>
                <Image
                  source={require("../../../assets/icons/cancelar.png")}
                  style={{ width: 18, height: 18 }}
                />
              </Pressable>
            </View>

            {/* Body Modal */}
            {/* Body Modal */}
            {/* Body Modal */}

            <FlatList
              data={esportesData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <Pressable
                  onPress={() => handleCrudPerfil({ item })}
                  style={tw` mt-4 mx-2 rounded-2 border-2 border-[#61D48340] p-4 flex flex-row items-center justify-between`}
                >
                  <Text
                    style={[
                      tw`text-base text-[#2E7844]`,
                      { fontFamily: "Poppins_500Medium" },
                    ]}
                  >
                    {crud === "create"
                      ? item.nomeEsporte
                      : item?.esporte.nomeEsporte}
                  </Text>
                  <Image source={icons} style={{ width: 18, height: 18 }} />
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}
