import { Pressable, Text, View } from 'react-native';


export default function Postagem({ idUsuario = '1', tags = ['Legal', 'opa'], descricao = 'postgane', imagem, likes = 10, comentarios=19}) {
  return (
    <View className="bg-white m-2 p-4 rounded-lg shadow border-[2px] border-[#61D483]">
        <Text className="font-bold text-lg mb-2">Usuário: {idUsuario}</Text>
        <Text className="text-gray-700 mb-2">{descricao}</Text>
        <Text className="text-gray-600 mb-2">Tags: {tags.join(', ')}</Text>
      {imagem && (
        <View className="mb-4">
            {/* imagem */}
        </View>
      )}
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-600">Likes: {likes}</Text>
        <Text className="text-gray-600">Comentários: {comentarios}</Text>
      </View>
    </View>
  );
    

}
