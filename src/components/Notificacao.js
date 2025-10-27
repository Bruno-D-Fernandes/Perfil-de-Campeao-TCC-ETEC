import { View, Text } from 'react-native';

export default function Notificacao({ data }) {
  const mensagem = data?.data?.message || 'Sem mensagem';
  const dataEnvio = new Date(data?.created_at).toLocaleString('pt-BR');

  return (
    <View className="bg-white p-4 mb-3 rounded-xl shadow-sm border border-gray-200">
      <Text className="text-gray-800 font-medium">{mensagem}</Text>
      <Text className="text-xs text-gray-500 mt-1">{dataEnvio}</Text>
     </View>
  );
}
