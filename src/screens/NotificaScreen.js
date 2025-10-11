import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { Notificacoes } from '../../services/notificacoes'; 
import Notificacao from '../components/Notificacao';

export default function NotificationsScreen() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 🧩 Atualizado para lidar com APIs Laravel
  const parseItems = (payload) => {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.todas?.data)) return payload.todas.data; 
    return [];
  };

  const fetchNotificacoes = useCallback(
    async (initial = false) => {
      if (loading || (!initial && !hasMore)) return;

      try {
        setLoading(true);
        const result = await Notificacoes(initial ? 1 : page, perPage);
        console.log('🔔 Retorno da API:', result);

        const newItems = parseItems(result);

        if (initial) {
          setData(newItems);
          setPage(2);
          setHasMore(newItems.length >= perPage);
        } else {
          setData((prev) => [...prev, ...newItems]);
          setPage((p) => p + 1);
          if (newItems.length < perPage) setHasMore(false);
        }
      } catch (err) {
        console.error('Erro ao buscar notificações:', err?.response?.data || err?.message);
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore, page]
  );

  // 🚀 Chama na montagem
  useEffect(() => {
    fetchNotificacoes(true);
  }, []);

  return (
    <View className="flex-1 bg-[#F3F7F5] px-6 pt-6">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-2xl font-bold">Notificações</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item, idx) => String(item?.id ?? idx)}
        renderItem={({ item }) => <Notificacao data={item} />}
        onEndReached={() => fetchNotificacoes(false)}
        onEndReachedThreshold={0.2}
        ListEmptyComponent={
          !loading ? (
            <Text className="text-gray-500 mt-6">Nenhuma notificação encontrada.</Text>
          ) : null
        }
        ListFooterComponent={
          loading ? (
            <ActivityIndicator size="large" color="#2E7844" style={{ marginVertical: 16 }} />
          ) : null
        }
      />
    </View>
  );
}
