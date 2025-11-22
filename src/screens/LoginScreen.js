import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ImageBackground,
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";

import AsyncStorage from "@react-native-async-storage/async-storage";
import usuario from "../services/usuario";
import TopNotification from "../components/TopNotification";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const navigation = useNavigation();

  const [emailUsuario, setEmailUsuario] = useState("");
  const [senhaUsuario, setSenhaUsuario] = useState("");
  const [emailValido, setEmailValido] = useState(true);
  const [senhaValida, setSenhaValida] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState();
  const [viewError, setViewError] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_500Medium,
  });

  async function handleLogin() {
    const validarEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    let camposValidos = true;

    if (!emailUsuario.trim()) {
      setEmailValido(false);
      camposValidos = false;
    } else if (!validarEmail(emailUsuario)) {
      setEmailValido(false);
      camposValidos = false;
      setError("Email inválido", "Por favor, insira um email válido.");
      return setViewError(true);
    } else {
      setEmailValido(true);
    }

    if (!senhaUsuario.trim()) {
      setSenhaValida(false);
      camposValidos = false;
    } else {
      setSenhaValida(true);
    }

    if (!camposValidos) {
      setError("Campos obrigatórios", "Por favor, preencha todos os campos.");
      return setViewError(true);
    }

    try {
      const response = await usuario.loginUser({ emailUsuario, senhaUsuario });

      if (response?.data?.access_token) {
        await AsyncStorage.setItem("token", response.data.access_token);

        const responseDois = await usuario.perfilUser(
          response.data.access_token
        );
        const user = responseDois.data;

        await AsyncStorage.setItem("user", JSON.stringify(user));
        navigation.navigate("MainTabs");
      }
    } catch (error) {
      setError(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Ocorreu um erro inesperado. Tente novamente."
      );

      setViewError(true);
      console.error("Erro ao criar usuário:", error.response.data.message);
    }
  }

  useEffect(() => {
    if (viewError) {
      const timer = setTimeout(() => {
        setViewError(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [viewError]);

  return (
    <ImageBackground
      source={require("../../assets/login/bgBasquete.png")}
      style={{ width: "100%", height: "100%" }}
      resizeMode="cover"
    >
      {viewError && <TopNotification error={error} />}
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 justify-center items-center p-[2%] gap-4">
          <View className="w-[90%] h-[23%] ">
            <Text
              className="text-[29px] w-[50%] font-bold text-white leading-tight"
              style={{ fontFamily: "Poppins_500Medium" }}
            >
              Se <Text className="text-[#98FFB7]">você </Text>acredita...
            </Text>
            <Text
              className="text-[29px] w-[80%] font-bold text-white leading-tight"
              style={{ fontFamily: "Poppins_500Medium" }}
            >
              O <Text className="text-[#98FFB7]">mundo</Text> também vai
              acreditar.
            </Text>
          </View>

          <View className="w-[90%] h-[25%] mt-[10%] ">
            {/* Email */}
            <Text
              className="text-[14px] text-[#98FFB7]"
              style={{ fontFamily: "Poppins_500Medium" }}
            >
              E-mail
            </Text>
            <View
              className={`w-full mb-[10%] p-[3%] rounded-[8px] border-[3px] flex-row items-center ${
                emailValido ? "border-[#98FFB7]" : "border-red-500"
              }`}
            >
              <Image
                className="mr-[3%]"
                style={{ width: 16, height: 12 }}
                source={require("../../assets/login/icon_email.png")}
              />
              <TextInput
                value={emailUsuario}
                onChangeText={(text) => {
                  setEmailUsuario(text);
                  if (text.trim()) setEmailValido(true);
                }}
                placeholder="Digite seu e-mail"
                placeholderTextColor="#ccc"
                className="w-[98%] h-[100%] text-white outline-none"
                style={{ fontFamily: "Poppins_500Medium" }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Senha */}
            <Text
              className="text-[14px] text-[#98FFB7]"
              style={{ fontFamily: "Poppins_500Medium" }}
            >
              Senha
            </Text>
            <View
              className={`w-full mb-[10%] p-[3%] rounded-[8px] border-[3px] flex-row items-center ${
                senhaValida ? "border-[#98FFB7]" : "border-red-500"
              }`}
            >
              <Image
                className="mr-[3%]"
                style={{ width: 16, height: 16 }}
                source={require("../../assets/login/icon_senha.png")}
              />
              <TextInput
                value={senhaUsuario}
                onChangeText={(text) => {
                  setSenhaUsuario(text);
                  if (text.trim()) setSenhaValida(true);
                }}
                secureTextEntry={!showPassword}
                placeholder="Digite sua senha"
                placeholderTextColor="#ccc"
                className="w-[98%] h-[100%] text-white outline-none"
                style={{ fontFamily: "Poppins_500Medium" }}
              />
              <Pressable
                onPress={() => setShowPassword((s) => !s)}
                className="pr-[3%]"
              >
                <Text
                  style={{ color: "#98FFB7", fontFamily: "Poppins_500Medium" }}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Botões */}
          <View className="w-[75%] h-[20%] gap-6 items-center justify-center">
            <Pressable
              onPress={handleLogin}
              className="bg-[#4ADC76] w-64 h-12 bg rounded-[30px] items-center justify-between pl-[8%] flex-row"
            >
              <Text
                className="text-white text-[18px]"
                style={{ fontFamily: "Poppins_500Medium" }}
              >
                Entrar
              </Text>
              <View className="w-[16%] h-[80%] bg-white m-[3%] rounded-full items-center justify-center">
                <Image
                  className="ml-[19%]"
                  style={{ width: 12, height: 20, marginRight: 3 }}
                  source={require("../../assets/login/icon_seta.png")}
                />
              </View>
            </Pressable>

            <Pressable
              onPress={() => navigation.replace("Cadastro")}
              className="w-full items-center"
            >
              <Text
                className="text-[#98FFB7]"
                style={{ fontFamily: "Poppins_500Medium" }}
              >
                Ainda não tem <Text className="underline">cadastro?</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
