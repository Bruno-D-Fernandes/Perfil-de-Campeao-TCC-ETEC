import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { Notificacoes } from "../services/notificacoes";
import Notificacao from "../components/Notificacao";
import { usePusher } from "../context/PusherProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NotificaScreen() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const pusher = usePusher();

  const parseItems = (payload) => {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (payload?.data && Array.isArray(payload.data)) return payload.data;
    if (payload?.items && Array.isArray(payload.items)) return payload.items;
    if (payload?.todas?.data && Array.isArray(payload.todas.data))
      return payload.todas.data;
    return [];
  };

  const fetchNotificacoes = useCallback(
    async (initial = false) => {
      if (loading || (!initial && !hasMore)) return;

      try {
        setLoading(true);
        const result = await Notificacoes(initial ? 1 : page, perPage);

        const newItems = parseItems(result);

        if (initial) {
          setData(newItems);
          setPage(2);
          setHasMore(newItems.length >= perPage);
        } else {
          setData((prev) => [...prev, ...newItems]);
          setPage((prev) => prev + 1);
          if (newItems.length < perPage) setHasMore(false);
        }
      } catch (err) {
        console.error("Erro ao buscar notificações:", err);
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore, page]
  );

  const handleNewNotification = useCallback((notification) => {
    console.log("📡 Nova notificação recebida:", notification);
    setData((prevData) => [notification, ...prevData]);
  }, []);

  useEffect(() => {
    fetchNotificacoes(true);
  }, []);

  useEffect(() => {
    if (!pusher) return;

    let channel;

    const subscribeToNotifications = async () => {
      const userJson = await AsyncStorage.getItem("user");
      if (!userJson) return;

      const user = JSON.parse(userJson);
      const channelName = `notifications.user.${user.id}`;

      console.log("Inscrevendo no canal:", channelName);

      channel = pusher.subscribe(channelName);

      channel.bind("pusher:subscription_succeeded", () => {
        console.log("Sucesso ao inscrever:", channelName);
      });

      channel.bind("pusher:subscription_error", (error) => {
        console.error("Erro na inscrição:", error);
      });

      channel.bind("NewNotification", handleNewNotification);
    };

    subscribeToNotifications();

    return () => {
      if (channel) {
        console.log("❌ Desinscrevendo do canal...");
        channel.unbind("NewNotification", handleNewNotification);
        pusher.unsubscribe(channel.name);
      }
    };
  }, [pusher, handleNewNotification]);

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
            <Text className="text-gray-500 mt-6">
              Nenhuma notificação encontrada.
            </Text>
          ) : null
        }
        ListFooterComponent={
          loading ? (
            <ActivityIndicator
              size="large"
              color="#2E7844"
              style={{ marginVertical: 16 }}
            />
          ) : null
        }
      />
    </View>
  );
}
