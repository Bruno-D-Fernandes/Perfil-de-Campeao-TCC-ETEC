import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Animated,
  Pressable,
} from "react-native";
import tw from "twrnc";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";

export default function Step3({
  formData,
  updateField,
  passwordStrength,
  setPasswordStrength,
}) {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_500Medium,
  });

  const animatedWidth = useState(new Animated.Value(0))[0];
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const password = formData.senhaUsuario || "";
    let strength = 0;

    if (password.length >= 8) {
      strength += 1;
    }
    if (/[A-Z]/.test(password)) {
      strength += 1;
    }
    if (/[a-z]/.test(password)) {
      strength += 1;
    }
    if (/[0-9]/.test(password)) {
      strength += 1;
    }
    if (/[^A-Za-z0-9]/.test(password)) {
      strength += 1;
    }

    setPasswordStrength(strength);

    Animated.timing(animatedWidth, {
      toValue: (strength / 5) * 100,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [formData.senhaUsuario]);

  const getStrengthColor = () => {
    if (passwordStrength === 0) return "#A9A9A9";
    if (passwordStrength <= 2) return "#FF6B6B";
    if (passwordStrength <= 4) return "#FFD166";
    return "#4ADC76";
  };

  const getStrengthText = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 2) return "Fraca";
    if (passwordStrength <= 4) return "Média";
    return "Forte";
  };

  return (
    <View style={tw`flex-1`}>
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
            secureTextEntry={!showPassword}
          />
          <Pressable
            onPress={() => setShowPassword((s) => !s)}
            style={tw`pr-3`}
          >
            {showPassword ?
                   <Image
                
                style={{ width: 18, height: 18, tintColor:'#4ADC76', }}
                source={require("../../../assets/login/olho-fechado.png")}
              />
                    : 
                       <Image
                style={{ width: 18, height: 18, tintColor:'#4ADC76' }}
                source={require("../../../assets/login/olho-aberto.png")}
              />
                    }
          </Pressable>
        </View>
        {formData.senhaUsuario.length > 0 && (
          <View style={tw`mt-2`}>
            <Text style={[tw`text-xs mb-1`, { color: getStrengthColor() }]}>
              Força da Senha: {getStrengthText()}
            </Text>
            <View style={tw`h-2 rounded-full bg-gray-300`}>
              <Animated.View
                style={[
                  tw`h-full rounded-full`,
                  {
                    width: animatedWidth.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "100%"],
                    }),
                    backgroundColor: getStrengthColor(),
                  },
                ]}
              />
            </View>
          </View>
        )}
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
            secureTextEntry={!showConfirmPassword}
          />
          <Pressable
            onPress={() => setShowConfirmPassword((s) => !s)}
            style={tw`pr-3`}
          >
             {showConfirmPassword ?
                   <Image
                
                style={{ width: 18, height: 18, tintColor:'#4ADC76', }}
                source={require("../../../assets/login/olho-fechado.png")}
              />
                    : 
                       <Image
                style={{ width: 18, height: 18, tintColor:'#4ADC76' }}
                source={require("../../../assets/login/olho-aberto.png")}
              />
                    }
          </Pressable>
        </View>
      </View>
    </View>
  );
}
