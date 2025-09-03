import React, { useState } from "react";
import { Text, View, Pressable, Switch, Modal, TouchableOpacity } from "react-native";
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import usuario from "../../services/usuario";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const ConfiguracaoItem = ({ icon, text, actionText, actionType = 'text', color = "#4ADC76", onPress }) => {
  return (
    <Pressable className="flex-row items-center justify-between bg-white p-3 rounded-lg mb-3" onPress={onPress}>
      <View className="flex-row items-center space-x-3">
        {icon}
        <Text style={{ color }} className="font-bold">{text}</Text>
      </View>
      <View>
        {actionType === 'text' && actionText && (
          <Text style={{ color }} className="font-bold">{actionText}</Text>
        )}
        {actionType === 'switch' && (
          <Switch
            trackColor={{ false: "#767577", true: "#61D483" }}
            thumbColor={"#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            value={false}
          />
        )}
        {actionType === 'chevron' && (
          <View className="flex-row items-center space-x-1">
            <Text style={{ color }} className="font-bold">{actionText}</Text>
            <MaterialIcons name="chevron-right" size={24} color="#4ADC76" />
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default function ConfigScreen() {
  const navigation = useNavigation();

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await usuario.logoutUser();
      await AsyncStorage.clear();
      setLogoutModalVisible(false);
      navigation.navigate("Splash");
    } catch (e) {
      console.error("Erro ao sair:", e);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const userJSON = await AsyncStorage.getItem('user');

      if (!userJSON) {
        console.error("Tentativa de exclusão sem usuário logado.");
        navigation.navigate("Splash");
        return;
      }

      const user = JSON.parse(userJSON);
      const id = user.id;

      await usuario.deleteUser(id);

      await AsyncStorage.clear();
      setDeleteModalVisible(false);
      navigation.navigate("Splash");

    } catch (error) {
      console.error("Erro ao excluir conta:", error);
    }
  };

  return (
    <View className="flex-1 p-4 bg-[#F0FFF4]">

      {/* Seção de Conta */}
      <View className="mb-6">
        <Text className="text-[#61D483] text-lg font-semibold mb-2 ml-2">Conta</Text>
        <View className="bg-[#E6F9EC] p-4 rounded-xl">
          <ConfiguracaoItem
            icon={<MaterialIcons name="email" size={24} color="#4ADC76" />}
            text="Email"
            actionText="Alterar"
          />
          <ConfiguracaoItem
            icon={<MaterialIcons name="lock" size={24} color="#4ADC76" />}
            text="Senha"
            actionText="Alterar"
          />
          <ConfiguracaoItem
            icon={<MaterialIcons name="logout" size={24} color="#D46161" />}
            text="Sair"
            color="#D46161"
            onPress={() => setLogoutModalVisible(true)}
          />
          <ConfiguracaoItem
            icon={<AntDesign name="delete" size={24} color="#D46161" />}
            text="Excluir conta"
            color="#D46161"
            onPress={() => setDeleteModalVisible(true)}
          />
        </View>
      </View>

      {/* Modal de Logout */}
      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center">
          <View className="bg-white p-6 rounded-3xl w-80 border-[4px] border-[#61D483]">
            <Text className="text-lg font-semibold mb-4 text-center">Deseja mesmo sair?</Text>
            <View className="flex-row justify-evenly">
              <TouchableOpacity onPress={() => setLogoutModalVisible(false)} className="px-4 py-2 bg-gray-200 rounded">
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout} className="px-4 py-2 bg-[#D46161] rounded">
                <Text className="text-white">Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Exclusão de Conta */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center">
          <View className="bg-white p-6 rounded-3xl border-[4px] border-[#61D483] w-80">
            <Text className="text-lg font-semibold mb-4 text-center text-red-600">Tem certeza que deseja excluir sua conta?</Text>
            <Text className="text-sm text-center mb-4">Essa ação não pode ser desfeita.</Text>
            <View className="flex-row justify-evenly">
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)} className="px-4 py-2 bg-gray-200 rounded">
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteAccount} className="px-4 py-2 bg-[#D46161] rounded">
                <Text className="text-white">Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}
