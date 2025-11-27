import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  Pressable,
  Switch,
  Modal,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import usuario from "../services/usuario";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const ConfiguracaoItem = ({
  icon,
  text,
  actionText,
  actionType = "text",
  color = "#4ADC76",
  onPress,
}) => {
  return (
    <Pressable
      className="flex-row items-center justify-between bg-white p-3 rounded-lg mb-3"
      onPress={onPress}
    >
      <View className="flex-row items-center space-x-3">
        {icon}
        <Text style={{ color }} className="font-bold">
          {text}
        </Text>
      </View>
      <View>
        {actionType === "text" && actionText && (
          <Text style={{ color }} className="font-bold">
            {actionText}
          </Text>
        )}
        {actionType === "switch" && (
          <Switch
            trackColor={{ false: "#767577", true: "#61D483" }}
            thumbColor={"#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            value={false}
          />
        )}
        {actionType === "chevron" && (
          <View className="flex-row items-center space-x-1">
            <Text style={{ color }} className="font-bold">
              {actionText}
            </Text>
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
  const [privModalVisible, setPrivModalVisible] = useState(false);
  const [termosModalVisible, setTermosModalVisible] = useState(false);
  const [sobreModalVisible, setSobreModalVisible] = useState(false);



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
      const userJSON = await AsyncStorage.getItem("user");

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
    <SafeAreaView className="flex-1 p-4 bg-[#ffff]">

      <View className="flex-row items-center justify-center mb-4 mt-3">
         <Pressable className="flex-row bg-[#61D483] w-10 absolute left-1   h-10 rounded-full items-center justify-center p-2 " onPress={() =>  navigation.navigate("MainTabs", { screen: "Oportunidades" })}>
                  <Image source={require("../../assets/cadastro/icon_voltar.png")} style={{width:11, height:18, marginRight:5,}}/>
              </Pressable>
        <Text style={{ fontSize: 20, fontFamily: "Poppins_500Medium", color:'#61D483',}}>
          Configuração
        </Text>
      </View>

      {/* Seção de Conta */}
      <View className="mb-4">
        <Text className="text-[#61D483] text-lg font-semibold mb-2 ml-2">
          Conta
        </Text>
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
      
      <View className="mb-4">
        <Text className="text-[#61D483] text-lg font-semibold mb-2 ml-2">
          sobre
        </Text>
        <View className="bg-[#E6F9EC] p-4 rounded-xl">
          <ConfiguracaoItem
            icon={<MaterialIcons name="privacy-tip" size={24} color="#4ADC76" />}
            text="Privacidade"
            actionType="chevron"
            actionText=""
            onPress={() => setPrivModalVisible(true)}
          />

          <ConfiguracaoItem
            icon={<MaterialIcons name="description" size={24} color="#4ADC76" />}
            text="Termos e Condições"
            actionType="chevron"
            actionText=""
            onPress={() => setTermosModalVisible(true)}
          />

          <ConfiguracaoItem
            icon={<AntDesign name="info-circle" size={24} color="#4ADC76" />}
            text="Saiba Mais"
            actionType="chevron"
            actionText=""
            onPress={() => setSobreModalVisible(true)}
          />
        </View>


      </View>

      <Modal
  visible={sobreModalVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setSobreModalVisible(false)}
>
   <View className="flex-1 justify-center items-center bg-black/40">
    <View className="bg-white p-6 rounded-3xl w-full max-w-[340px] ">

      <Text className="text-xl font-semibold mb-3 text-center text-[#61D483]">
        Sobre o Aplicativo
      </Text>

      <Text className="text-sm text-gray-700 mb-4 text-center">
        Este aplicativo foi criado com a proposta de funcionar como uma 
        <Text className="font-bold"> plataforma de conexão esportiva</Text>, conectando atletas, 
        treinadores, equipes e oportunidades reais dentro do mundo esportivo.
        {"\n\n"}
        Nosso objetivo é facilitar a descoberta de talentos, ampliar a visibilidade 
        de atletas e abrir portas para novas oportunidades profissionais.
        {"\n\n"}
        Criado com dedicação e inovação pela empresa 
        <Text className="font-bold"> Norven</Text>, que acredita no poder do esporte 
        para transformar vidas.
      </Text>

      <TouchableOpacity
        onPress={() => setSobreModalVisible(false)}
        className="px-5 py-2 bg-[#61D483] rounded-lg mx-auto"
      >
        <Text className="text-white font-semibold">Fechar</Text>
      </TouchableOpacity>

    </View>
  </View>
</Modal>


      {/* Modal de Privacidade */}
<Modal
  visible={privModalVisible }
  transparent
  animationType="fade"
  onRequestClose={() => setPrivModalVisible(false)}
>
  <View className="flex-1 justify-center items-center bg-black/40">
    <View className="bg-white p-6 rounded-3xl w-80 ">

      <Text className="text-lg font-semibold mb-3 text-center text-[#61D483]">
        Política de Privacidade
      </Text>

      <Text className="text-sm text-gray-700 mb-4">
        • Suas informações são utilizadas apenas para melhorar sua experiência.
        {"\n"}• Não compartilhamos seus dados com terceiros sem sua permissão.
        {"\n"}• Você pode solicitar remoção de dados a qualquer momento.
      </Text>

      <TouchableOpacity
        onPress={() => setPrivModalVisible(false)}
        className="bg-[#61D483] py-2 rounded-xl"
      >
        <Text className="text-center text-white font-bold">Fechar</Text>
      </TouchableOpacity>

    </View>
  </View>
</Modal>

{/* Modal de Termos */}
<Modal
  visible={termosModalVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setTermosModalVisible(false)}
>
  <View className="flex-1 justify-center items-center bg-black/40">
    <View className="bg-white p-6 rounded-3xl w-80  ">

      <Text className="text-lg font-semibold mb-3 text-center text-[#61D483]">
        Termos e Condições
      </Text>

      <Text className="text-sm text-gray-700 mb-4">
        • Ao usar o aplicativo, você concorda com nossas diretrizes.
        {"\n"}• É proibido uso para fins ilegais ou abusivos.
        {"\n"}• Reservamo-nos o direito de ajustar regras a qualquer momento.
      </Text>

      <TouchableOpacity
        onPress={() => setTermosModalVisible(false)}
        className="bg-[#61D483] py-2 rounded-xl"
      >
        <Text className="text-center text-white font-bold">Fechar</Text>
      </TouchableOpacity>

    </View>
  </View>
</Modal>



      {/* Modal de Logout */}
      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
    <View className="flex-1 justify-center items-center bg-black/40">
          <View className="bg-white p-6 rounded-3xl w-80 ">
            <Text className="text-lg font-semibold mb-4 text-center ">
              Deseja mesmo sair?
            </Text>
            <View className="flex-row justify-evenly">
              <TouchableOpacity
                onPress={() => setLogoutModalVisible(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogout}
                className="px-4 py-2 bg-[#D46161] rounded"
              >
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
            <Text className="text-lg font-semibold mb-4 text-center text-red-600">
              Tem certeza que deseja excluir sua conta?
            </Text>
            <Text className="text-sm text-center mb-4">
              Essa ação não pode ser desfeita.
            </Text>
            <View className="flex-row justify-evenly">
              <TouchableOpacity
                onPress={() => setDeleteModalVisible(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeleteAccount}
                className="px-4 py-2 bg-[#D46161] rounded"
              >
                <Text className="text-white">Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
