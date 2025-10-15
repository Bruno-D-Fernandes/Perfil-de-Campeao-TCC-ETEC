import React, { useEffect, useState } from "react";
import {
  View,
  Pressable,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import postagemService from "../../services/postagem";

export default function PrtifolioScreen() {
  const [pop, setPop] = useState(false);
  const [postagens, setPostagens] = useState([]);
  const [loading, setLoading] = useState(true);


  const icon1 = useSharedValue(40); // Lixeira
  const icon2 = useSharedValue(40); // Edição
  const icon3 = useSharedValue(40); // Postagem
  const iconHeight = useSharedValue(10);

  const styleIcon1 = useAnimatedStyle(() => ({
    bottom: icon1.value,
    right: 15,
    height: iconHeight.value,
    width: iconHeight.value,
    zIndex:1,
  }));

  const styleIcon2 = useAnimatedStyle(() => ({
    bottom: icon2.value + 50,
    right: icon2.value - 20,
    height: iconHeight.value,
    width: iconHeight.value,
    zIndex:1,
  }));

  const styleIcon3 = useAnimatedStyle(() => ({
    right: icon3.value,
    bottom: 80,
    height: iconHeight.value,
    width: iconHeight.value,
    zIndex:1,
  }));

  const popIn = () => {
    setPop(true);
    icon1.value = withSpring(190);
    icon2.value = withSpring(110);
    icon3.value = withSpring(120);
    iconHeight.value = withSpring(56);
  };

  const popOut = () => {
    setPop(false);
    icon1.value = withTiming(40, { duration: 200 });
    icon2.value = withTiming(40, { duration: 200 });
    icon3.value = withTiming(40, { duration: 200 });
    iconHeight.value = withTiming(10, { duration: 200 });
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const userId = 1; 
        const data = await postagemService.getPostagensPorUsuario(userId);
        setPostagens(data);
      } catch (error) {
        console.error("❌ Erro ao buscar postagens do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#49D372" />
        <Text className="mt-2 text-gray-500">Carregando postagens...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* BOTÕES ANIMADOS */}
      <Animated.View
        style={styleIcon1}
        className="bg-gray-400 absolute rounded-full justify-center items-center"
      >
        <Pressable onPress={() => console.log("🗑️ Deletar postagem")}>
          <Icon name="trash" size={25} color="#FFF" />
        </Pressable>
      </Animated.View>

      <Animated.View
        style={styleIcon2}
        className="bg-gray-400 absolute rounded-full justify-center items-center"
      >
        <Pressable onPress={() => console.log("✏️ Editar postagem")}>
          <Icon name="edit" size={25} color="#FFF" />
        </Pressable>
      </Animated.View>

      <Animated.View
        style={styleIcon3}
        className="bg-gray-400 absolute rounded-full justify-center items-center"
        
      >
        <Pressable onPress={() => console.log("➕ Nova postagem")}>
          <Icon name="plus" size={25} color="#FFF" />
        </Pressable>
      </Animated.View>

      {/* BOTÃO PRINCIPAL */}
      <Pressable
        className="bg-gray-400 w-14 h-14 absolute bottom-10 mb-10 right-5 rounded-full justify-center items-center" style={{zIndex:1,}}
        onPress={() => (pop ? popOut() : popIn())}
      >
        <Icon name="plus" size={25} color="#FFF" />
      </Pressable>

      {/* FEED DE POSTAGENS */}
      {postagens.length === 0 ? (
        <Text className="text-center text-gray-500 mt-10">
          Nenhuma postagem encontrada.
        </Text>
      ) : (
        <FlatList
          data={postagens}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="mb-4 bg-gray-100 p-4 rounded-xl shadow-sm mx-4 mt-2">
              <Text className="font-bold text-lg mb-1 text-gray-800">
                {item.usuario?.name || "Usuário"}
              </Text>
              <Text className="text-gray-700">{item.textoPostagem}</Text>

              {item.imagens && item.imagens.length > 0 ? (
                <Image
                  source={{
                    uri: `http://192.168.15.5:8000/storage/${item.imagens[0].caminhoImagem}`,
                  }}
                  className="w-full h-48 mt-2 rounded-lg"
                  resizeMode="cover"
                />

              ) : (
                <View className="w-full h-48 mt-2 bg-gray-300 rounded-lg justify-center items-center">
                  <Text className="text-gray-500">Sem imagem</Text>
                </View>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}
