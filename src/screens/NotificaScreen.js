import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Pressable,
} from 'react-native';

const DATA = [
  {
    id: '1',
    title: 'Nova peneira aberta',
    message: 'O Corinthians abriu peneira para sub-20. Inscreva-se até 30/11/2024.',
    time: '2 h',
    read: false,
  },
  {
    id: '2',
    title: 'Mensagem do técnico',
    message: 'Treino extra amanhã às 7:00 no campo A.',
    time: '1 dia',
    read: true,
  },
  {
    id: '3',
    title: 'Atualização de perfil',
    message: 'Seu perfil foi atualizado com sucesso.',
    time: '3 dias',
    read: true,
  },
  {
    id: '4',
    title: 'Convite para seletiva',
    message: 'Você foi convidado para a seletiva do time B. Confirme presença.',
    time: '5 dias',
    read: false,
  },
];

export default function Notifications() {
  const renderItem = ({ item }) => (
    <Pressable
      className="bg-white rounded-2xl px-4 py-3 mb-3 flex-row items-start justify-between"
      android_ripple={{ color: '#e6f5ea' }}
    >
      <View className="flex-row items-start gap-3">
        <View
          className={`w-12 h-12 rounded-full items-center justify-center ${
            item.read ? 'bg-gray-200' : 'bg-[#49D372]'
          }`}
        >
          <Text className={`text-sm font-bold ${item.read ? 'text-gray-600' : 'text-white'}`}>
            {item.title.split(' ').slice(0,1)[0].charAt(0)}
          </Text>
        </View>

        <View className="max-w-[70%]">
          <View className="flex-row items-center justify-between">
            <Text className={`font-semibold text-base ${item.read ? 'text-gray-700' : 'text-black'}`}>
              {item.title}
            </Text>
            <Text className="text-xs text-gray-400 ml-2">{item.time}</Text>
          </View>
          <Text className="text-sm text-gray-500 mt-1">{item.message}</Text>
        </View>
      </View>

      {!item.read && (
        <View className="w-3 h-3 rounded-full bg-[#49D372] ml-2 self-start" />
      )}
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F3F7F5]">
      <View className="px-6 pt-6 pb-3 flex-row items-center justify-between">
        <Text className="text-2xl font-bold">Notificações</Text>
        <Pressable className="px-3 py-2 bg-white rounded-xl">
          <Text className="text-sm font-medium text-[#49D372]">Marcar todas</Text>
        </Pressable>
      </View>

      <View className="px-6">
        <Text className="text-sm text-gray-500 mb-4">Recentes</Text>

        <FlatList
          data={DATA}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </View>

      <View className="absolute bottom-6 left-6 right-6">
        <Pressable className="bg-[#49D372] py-3 rounded-2xl items-center justify-center">
          <Text className="text-white font-semibold">Ver todas as notificações</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
