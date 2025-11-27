import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
} from "react-native";
import tw from "twrnc";
import usuario from "../services/usuario";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  interpolate,
  FadeIn, // Usado para o Step 4
  SlideInRight,
  SlideInLeft,
  SlideOutLeft,
  SlideOutRight,
  FadeOut,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import usuarioService from "../services/usuario";

import Step1 from "../components/cadastroComponents/step1";
import Step2 from "../components/cadastroComponents/step2";
import Step3 from "../components/cadastroComponents/step3";
import Step4 from "../components/cadastroComponents/step4";
import TopNotification from "../components/TopNotification";

export default function CadastroScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [error, setError] = useState("");
  const [viewError, setViewError] = useState(false);

  const [barWidth, setBarWidth] = useState(0);
  const progress = useSharedValue(0);

  const [passwordStrength, setPasswordStrength] = useState(0);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  const iconStyle = useAnimatedStyle(() => {
    const position = interpolate(
      progress.value,
      [0, 100],
      [0, barWidth],
      "clamp"
    );
    return {
      transform: [{ translateX: position }],
    };
  });

  const [currentStep, setCurrentStep] = useState(0);
  const direction = useRef(1);

  const [formData, setFormData] = useState({
    nomeCompletoUsuario: "",
    dataNascimentoUsuario: "",
    generoUsuario: "",
    estadoUsuario: "",
    cidadeUsuario: "",
    emailUsuario: "",
    senhaUsuario: "",
    confirmacaoSenhaUsuario: "",
    alturaCm: "",
    pesoKg: "",
    peDominante: "",
    maoDominante: "",
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (passwordStrength < 2) {
      setError("A senha é muito fraca. Por favor, tente uma mais complexa.");
      setViewError(true);
      return;
    }

    if (formData.confirmacaoSenhaUsuario !== formData.senhaUsuario) {
      setError("Senhas não coincidem");
      setViewError(true);
      return;
    }

    try {
      const data = formData.dataNascimentoUsuario.split("/");
      if (data.length === 3) {
        formData.dataNascimentoUsuario = `${data[2]}-${data[1]}-${data[0]}`;
      }
      console.log("Enviando para API:", formData);
      const token = await usuario.createUser(formData);
      await AsyncStorage.setItem("token", token.data.access_token);

      const response = await usuarioService.perfilUser();
      console.log("aqui esta a response", response);
      const userObj = response?.data || response;
      await AsyncStorage.setItem("user", JSON.stringify(userObj));
      setCurrentStep(3);
      progress.value = withTiming(100, { duration: 500 });
    } catch (error) {
      setError(error.response?.data?.error || "Ocorreu um erro inesperado.");
      setViewError(true);
      console.error(
        "Erro ao criar usuário:",
        error.response?.data?.error || error
      );
    }
  };

  useEffect(() => {
    if (viewError) {
      const timer = setTimeout(() => setViewError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [viewError]);

  const renderCurrentStep = () => {
    const enteringAnimation =
      direction.current > 0 ? SlideInRight : SlideInLeft;
    const exitingAnimation =
      direction.current > 0 ? SlideOutLeft : SlideOutRight;

    return (
      <View style={tw`flex-1 overflow-hidden`}>
        {currentStep === 0 && (
          <Animated.View
            key="step0"
            style={tw`flex-1`}
            // entering={FadeIn.duration(200)}
            // exiting={FadeOut.duration(200)}
          >
            <Step1 formData={formData} updateField={updateField} />
          </Animated.View>
        )}
        {currentStep === 1 && (
          <Animated.View
            key="step1"
            style={tw`flex-1`}
            // entering={FadeIn.duration(200)}
            // exiting={FadeOut.duration(200)}
          >
            <Step2 formData={formData} updateField={updateField} />
          </Animated.View>
        )}
        {currentStep === 2 && (
          <Animated.View
            key="step2"
            style={tw`flex-1`}
            // entering={FadeIn.duration(200)}
            // exiting={FadeOut.duration(200)}
          >
            <Step3
              formData={formData}
              updateField={updateField}
              passwordStrength={passwordStrength}
              setPasswordStrength={setPasswordStrength}
            />
          </Animated.View>
        )}
        {currentStep === 3 && (
          <Animated.View
            key="step3"
            style={tw`flex-1`}
            entering={FadeIn.duration(500)} // Step de sucesso pode usar FadeIn
          >
            <Step4 />
          </Animated.View>
        )}
      </View>
    );
  };

  const handleStep = (num) => {
    const novoStep = currentStep + num;
    if (novoStep < 0 || novoStep > 3) return;

    direction.current = num > 0 ? 1 : -1;

    setCurrentStep(novoStep);

    let targetProgress = 0;
    if (novoStep === 1) targetProgress = 33;
    if (novoStep === 2) targetProgress = 66;
    if (novoStep === 3) targetProgress = 100;

    progress.value = withTiming(targetProgress, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });
  };

  const handleBackToLogin = () => {
    navigation.replace("AuthStack", { screen: "Login" });
  };

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {/* Notificação de erro */}
      {viewError && <TopNotification error={error} />}

      <Image
        style={[
          { width: "100%", height: "40%", position: "absolute", top: 0 },
          Platform.OS === "android" && { marginTop: -StatusBar.currentHeight },
        ]}
        source={require("../../assets/cadastro/cadastro_imagem.png")}
        resizeMode="cover"
      />

      <View
        style={[
          tw`absolute bottom-0 w-full max-w-xl self-center bg-white p-5 rounded-tl-[30px] rounded-tr-[30px] shadow-lg h-[74%]`,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        <View style={tw`w-full h-10 justify-center`}>
          <View
            style={tw`w-full h-[10px] bg-gray-400 rounded-full`}
            onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)}
          >
            <Animated.View
              style={[tw`h-full bg-[#4ADC76] rounded-full`, progressStyle]}
            />
            <Animated.Image
              style={[
                {
                  width: 30,
                  height: 30,
                  marginLeft: -12,
                  position: "absolute",
                  top: -35,
                },
                iconStyle,
              ]}
              source={require("../../assets/icons/pessoa.png")}
              resizeMode="contain"
            />
          </View>
        </View>

        {renderCurrentStep()}

        {/* Botões */}
        <View className="flex-row-reverse justify-between w-full">
          <Pressable
            style={tw`flex-row justify-between w-40 h-12 bg-[#4ADC76] rounded-full items-center`}
            onPress={() => {
              if (currentStep === 3) {
                navigation.replace("AuthStack");
              } else if (currentStep === 2) {
                handleSubmit();
              } else {
                handleStep(1);
              }
            }}
          >
            <Text style={tw`ml-3 font-semibold text-lg text-white`}>
              {currentStep === 2
                ? "Finalizar"
                : currentStep === 3
                  ? "Concluir"
                  : "Próximo"}
            </Text>
            <View
              style={tw`mr-2 justify-center items-center w-[22%] h-[75%] rounded-full bg-white`}
            >
              <Image
                style={{ width: 12, height: 20, marginLeft: 3 }}
                source={require("../../assets/cadastro/icon_proximo.png")}
              />
            </View>
          </Pressable>

          {currentStep > 0 && currentStep < 3 && (
            <Pressable
              style={tw`justify-center items-center w-12 h-12 rounded-full bg-[#4ADC76]`}
              onPress={() => handleStep(-1)}
            >
              <Image
                style={{ width: 12, height: 20 }}
                source={require("../../assets/cadastro/icon_voltar.png")}
              />
            </Pressable>
          )}

          {currentStep === 0 && (
            <Pressable
              style={tw`justify-center items-center w-12 h-12 rounded-full bg-green-400`}
              onPress={handleBackToLogin}
            >
              <Image
                style={{ width: 12, height: 20, marginRight: 4 }}
                source={require("../../assets/cadastro/icon_voltar.png")}
              />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
