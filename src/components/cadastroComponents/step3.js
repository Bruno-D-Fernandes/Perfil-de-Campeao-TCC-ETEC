import { View, Text, TextInput, Image } from "react-native";
import tw from "twrnc";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";
import Animated, { SlideOutLeft, SlideInRight } from "react-native-reanimated";

export default function Step3({ formData, updateField }) {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_500Medium,
  });

  return (
    <Animated.View
      style={tw`flex-1`}
      entering={SlideInRight}
      exiting={SlideOutLeft}
    >
      {/* Email */}
      <View style={tw`w-full`}>
        <Text
          style={[
            tw`text-[#4ADC76] text-sm mb-2`,
            { fontFamily: "Poppins_500Medium" },
          ]}
        >
          E-mail
        </Text>
        <View
          style={tw`flex-row items-center rounded-xl h-12 border-[#4ADC76] border-2`}
        >
          <Image
            style={{ width: 16, height: 12, marginHorizontal: 12 }}
            source={require("../../../assets/cadastro/icon_email.png")}
          />
          <TextInput
            style={[
              tw`flex-1 h-full text-sm`,
              { fontFamily: "Poppins_500Medium" },
            ]}
            placeholder="E-mail"
            placeholderTextColor="#A9A9A9"
            value={formData.emailUsuario}
            onChangeText={(text) => updateField("emailUsuario", text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Senha */}
      <View style={tw`w-full mt-4`}>
        <Text
          style={[
            tw`text-[#4ADC76] text-sm mb-2`,
            { fontFamily: "Poppins_500Medium" },
          ]}
        >
          Senha
        </Text>
        <View
          style={tw`flex-row items-center rounded-xl h-12 border-[#4ADC76] border-2`}
        >
          <Image
            style={{ width: 16, height: 18, marginHorizontal: 12 }}
            source={require("../../../assets/cadastro/icon_senha.png")}
          />
          <TextInput
            style={[
              tw`flex-1 h-full text-sm`,
              { fontFamily: "Poppins_500Medium" },
            ]}
            placeholder="Senha"
            placeholderTextColor="#A9A9A9"
            value={formData.senhaUsuario}
            onChangeText={(text) => updateField("senhaUsuario", text)}
            secureTextEntry
          />
        </View>
      </View>

      {/* Confirmação de Senha */}
      <View style={tw`w-full mt-4`}>
        <Text
          style={[
            tw`text-[#4ADC76] text-sm  mb-2`,
            { fontFamily: "Poppins_500Medium" },
          ]}
        >
          Confirme a Senha
        </Text>
        <View
          style={tw`flex-row items-center rounded-xl h-12 border-[#4ADC76] border-2`}
        >
          <Image
            style={{ width: 16, height: 18, marginHorizontal: 12 }}
            source={require("../../../assets/cadastro/icon_senha.png")}
          />
          <TextInput
            style={[
              tw`flex-1 h-full text-sm`,
              { fontFamily: "Poppins_500Medium" },
            ]}
            placeholder="Confirme sua senha"
            placeholderTextColor="#A9A9A9"
            value={formData.confirmacaoSenhaUsuario}
            onChangeText={(text) =>
              updateField("confirmacaoSenhaUsuario", text)
            }
            secureTextEntry
          />
        </View>
      </View>
    </Animated.View>
  );
}
