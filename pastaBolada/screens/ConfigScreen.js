import { Text, View, Pressable, Switch } from "react-native";
import { MaterialIcons, Feather, AntDesign, Ionicons } from '@expo/vector-icons';

// Componente reutilizável para cada linha de configuração
const ConfiguracaoItem = ({ icon, text, actionText, actionType = 'text', color = "#4ADC76"}) => {
  return (
    <Pressable className="flex-row items-center justify-between bg-white p-3 rounded-lg mb-3">
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
            value={false} // Você pode controlar o estado aqui
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

export default function Configuracao() {
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
            onPress={() => {/* Lógica para sair */}}
          />
          <ConfiguracaoItem
            icon={<AntDesign name="delete" size={24} color="#D46161" />}
            text="Excluir conta"
            color="#D46161"
            onPress={() => {/* Lógica para excluir conta */}}
          />
        </View>
      </View>
    </View>
  );
}
