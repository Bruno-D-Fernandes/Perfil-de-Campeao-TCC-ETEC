import { Text, View, Pressable } from "react-native";

export default function Configuracao({
  titulo = "Configurações",
  notificacao = "",
  tema = "",
  email = "",
  senha = "",
  autentifica = "",
  sair = "",
  excluir = "",
  politicas = "",
  termos = "",
  saiba = ""
}) {
  return (
    <View className="flex-1 p-4">
      <View className="items-center mb-4">
        <Text className="text-[#61D483] text-xl font-bold">{titulo}</Text>
      </View>
        <View className="flex-1 flex-col space-y-20 p-4">

            <View className="p-4">
            <Text className=" text-[#61D483]">Preferências</Text>
            
                <Pressable><Text className="text-[#4ADC76] font-bold">Notificações</Text></Pressable>
                <Pressable><Text className="text-[#4ADC76] font-bold">Tema</Text></Pressable>
            </View>

            <View className="p-4">
            <Text className=" text-[#61D483] ">Conta</Text>
                <Pressable><Text className="text-[#4ADC76] font-bold">Email</Text></Pressable>
                 <Pressable><Text className="text-[#4ADC76] font-bold">Senha</Text></Pressable>
                <Pressable><Text className="text-[#4ADC76] font-bold">Autentificação de 2 fatores</Text></Pressable>
                 <Pressable><Text className="text-[#D46161] font-bold">Sair</Text></Pressable>
                 <Pressable><Text className="text-[#D46161] font-bold">Excluir conta</Text></Pressable>
            </View>

            <View className="p-4">
            <Text className=" text-[#61D483]">Sobre</Text>
                <Pressable><Text className="text-[#4ADC76] font-bold">Políticas de privacidade</Text></Pressable>
                <Pressable><Text className="text-[#4ADC76] font-bold">Termos e condições</Text></Pressable>
                <Pressable><Text className="text-[#4ADC76] font-bold">Saiba mais</Text></Pressable>
            </View>

      </View>
    </View>
  );
}
