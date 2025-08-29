import { Text, View, Image, TextInput } from 'react-native';


export default function Cadastro({
  idUser = '1',
  fraseImagem1 = ['Venha conhercer um'],
  fraseImagem2 = ['mundo'],
  fraseImagem3 = ['de'],
  fraseImagem4 = ['oportunidades'],
  nameUser = '',
  anoNascUser = '',
  generoUser = '',
  estadoUser = '',
  cidadeUser = '',
  categoriaUser = '',
  temporadasUser = '',
  alturaUser = '',
  esporteUser = '',
  posicaoUser = '',
  emailUser = '',
  senhaUser = '',
  tipoUser = '',
  imagem = true
}) {
    return(
       <View className="w-full h-64 relative"> 
  {imagem && (
    <Image
      source={require("../../assets/cadastro/cadastro_imagem.png")}
      style={{ width: "100%", height: "100%" }}
      className="rounded-lg"
      resizeMode="cover"
    />
  )}


  <View className="absolute inset-0 justify-center items-baseline p-4">
    <Text className="text-white text-lg font-bold ">{fraseImagem1}</Text>
    <Text className="text-[#98FFB7] text-lg font-bold">{fraseImagem2}</Text>
    <Text className="text-white text-lg font-bold">{fraseImagem3}</Text>
    <Text className="text-[#98FFB7] text-lg font-bold">{fraseImagem4}</Text>
  </View>

  <View className= "bg-white justify-baseline items-center rounded-sm">
    <Text className = "text-[#4ADC76] self-start">Nome</Text>
      <TextInput
        placeholder=""
        className="border-2 border-[#4ADC76] rounded-lg px-4 py-2 bg-white text-black w-sm self-start"
      />
       <Text className = "text-[#4ADC76] self-start">Ano Nasc</Text>
        <TextInput
         placeholder=""
         className="border-2 border-[#4ADC76] rounded-lg px-4 py-2 bg-white text-black w-32 self-start"
        />
        <Text className = "text-[#4ADC76] self-end-safe">Genêro</Text>
        <TextInput
         placeholder=""
         className="border-2 border-[#4ADC76] rounded-lg px-4 py-2 bg-white text-black w-32 self-end"
        />
  </View>
</View>

    );
}