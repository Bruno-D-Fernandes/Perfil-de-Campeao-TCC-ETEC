import { Text, View, Image } from 'react-native';

export default function Postagem({
  idUsuario = '1',
  nameUser = '',
  tags = ['Legal', 'opa'],
  descricao = 'postgane',
  imagem = true,
  likes = 10,
  comentarios = 19
}) {
  return (
    <View className="w-full bg-white p-4 rounded-3xl border-[2px] border-[#61D483] gap-4">
      {/* Cabeçalho */}
      <View className="flex-row items-center">
        <Image
          source={require("../../assets/post/perfilFoto.png")} // Aqui
          className="w-10 h-10 rounded-full"
        />
        <Text className="font-bold text-lg ml-2">{nameUser} {idUsuario}</Text>
      </View>

      {/* Descrição */}
      <Text className="text-gray-700 mt-4">{descricao}</Text>
      <Text className="text-gray-600 mb-2">Tags: {tags.join(', ')}</Text>

      {/* Imagem do post */}
      {imagem && (
        <View className="w-[100%] items-center mb-4">
          <Image
            source={require("../../assets/post/postFoto1.png")}
            style={{ width: "100%",}}
            className="rounded-3xl"
            resizeMode="cover"
          />
        </View>
      )}

      {/* Rodapé */}
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-600">Likes: {likes}</Text>
        <Text className="text-gray-600">Comentários: {comentarios}</Text>
      </View>
    </View>
  );
}
