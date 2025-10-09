import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import tw from "twrnc";
import usuario from "../../services/usuario";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";

import Step1 from "../components/cadastroComponents/step1";
import Step2 from "../components/cadastroComponents/step2";
import Step3 from "../components/cadastroComponents/step3";
import Step4 from "../components/cadastroComponents/step4";
import TopNotification from "../components/TopNotification";

export default function CadastroScreen() {
  const navigation = useNavigation();

  const [error, setError] = useState("");
  const [viewError, setViewError] = useState(false);

  const [barWidth, setBarWidth] = useState(0);
  const progress = useSharedValue(0);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value}%`,
    };
  });

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

    if(formData.confirmacaoSenhaUsuario != formData.senhaUsuario){
      setError("Senhas não coincidem")
      return setViewError(true)
    } 

    try {
      const data = formData.dataNascimentoUsuario.split("/");
      if (data.length === 3) {
        formData.dataNascimentoUsuario = `${data[2]}-${data[1]}-${data[0]}`;
      }

      console.log(formData);

      const token = await usuario.createUser(formData);
      await AsyncStorage.setItem("token", token.data.access_token);

      setCurrentStep(3);
      progress.value = withTiming(100, { duration: 500 });
    } catch (error) {
      setError(
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : "Ocorreu um erro inesperado. Tente novamente."
      );

      setViewError(true);
      console.error("Erro ao criar usuário:", error.response.data.error);
    }
  };

  
  useEffect(() => {
    if (viewError) {
      const timer = setTimeout(() => {
        setViewError(false);
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [viewError]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Step1
            formData={formData}
            updateField={updateField}
            pickerSelectStyles={pickerSelectStyles}
          />
        );
      case 1:
        return <Step2 formData={formData} updateField={updateField} />;
      case 2:
        return <Step3 formData={formData} updateField={updateField} />;
      case 3:
        return <Step4 />;
      default:
        return null;
    }
  };

  const handleStep = (num) => {
    const novoStep = currentStep + num;
    if (novoStep < 0 || novoStep > 3) return;

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

  // Função para voltar à tela de login
  const handleBackToLogin = () => {
    navigation.goBack(); // ou navigation.navigate("Login")
  };

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {/* Notificação de erro */}

      {viewError && <TopNotification error={error}/>}

      <Image
        style={{ width: "100%", height: "40%", position: "absolute" }}
        source={require("../../assets/cadastro/cadastro_imagem.png")}
      />
      <View
        style={tw`absolute h-[74%] bottom-0 w-full max-w-xl self-center bg-white p-5 rounded-tl-[30px] rounded-tr-[30px] shadow-lg`}
      >
        <View style={[tw`w-full h-10 justify-center`]}>
          <View
            style={[tw`w-full h-[10px] bg-gray-400 rounded-full`]}
            onLayout={(event) => {
              const { width } = event.nativeEvent.layout;
              setBarWidth(width);
            }}
          >
            {/* barra verde animada */}
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

        {/* Form atual */}
        {renderCurrentStep()}

        {/* Botões */}
        <View style={tw`flex-row-reverse justify-between w-full`}>
          <Pressable
            style={tw`flex-row justify-between w-[48%] h-12 bg-[#4ADC76] rounded-full items-center`}
            onPress={() => {
              if (currentStep === 3) {
                navigation.navigate("MainTabs");
              } else if (currentStep < 2) {
                handleStep(1);
              } else {
                handleSubmit();
              }
            }}
          >
            <Text style={tw`ml-3 font-semibold text-lg text-white`}>
              {currentStep < 3 ? "Próximo" : "Finalizar"}
            </Text>
            <View
              style={tw`justify-center items-center w-[27%] h-full rounded-full bg-white`}
            >
              <Image
                style={{ width: 12, height: 20 }}
                source={require("../../assets/cadastro/icon_proximo.png")}
              />
            </View>
          </Pressable>

          {/* Botão de voltar modificado para incluir step 0 (step1) */}
          {currentStep > 0 && currentStep < 3 && (
            <Pressable
              style={tw`justify-center items-center w-[25%] h-full rounded-full bg-[#4ADC76]`}
              onPress={() => handleStep(-1)}
            >
              <Image
                style={{ width: 12, height: 20 }}
                source={require("../../assets/cadastro/icon_voltar.png")}
              />
            </Pressable>
          )}

          {/* Novo botão para voltar ao login quando estiver no step 0 (step1) */}
          {currentStep === 0 && (
            <Pressable
              style={tw`justify-center items-center w-[25%] h-full rounded-full bg-green-400`}
              onPress={handleBackToLogin}
            >
              <Image
                style={{ width: 12, height: 20 }}
                source={require("../../assets/cadastro/icon_voltar.png")}
              />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "#333",
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "#333",
    paddingRight: 30,
  },
  placeholder: {
    color: "#A9A9A9",
  },
  iconContainer: {
    top: 12,
    right: 12,
  },
});
