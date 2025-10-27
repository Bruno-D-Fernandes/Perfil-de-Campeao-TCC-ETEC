import { View, Text, TextInput, StyleSheet } from "react-native";
import tw from "twrnc";
import { Picker } from "@react-native-picker/picker";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import Animated, { SlideOutLeft, SlideInRight } from "react-native-reanimated";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";

export default function Step2({ formData, updateField }) {
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
      {/* Campo Mão Dominante */}
      <View style={tw`mb-6`}>
        <Text
          style={[
            tw`text-green-400 text-sm  mb-2`,
            { fontFamily: "Poppins_500Medium" },
          ]}
        >
          Mão Dominante
        </Text>
        <View
          style={tw`bg-green-400 border-2 border-green-400 justify-between rounded-2xl px-4 bg-white flex-row items-center p-3 w-full`}
        >
          <Icon
            name="hand-back-right"
            size={20}
            color="#61D483"
            style={{ marginRight: 6 }}
          />
          <View style={{ flex: 1 }}>
            <Picker
              selectedValue={formData.maoDominante}
              onValueChange={(value) => updateField("maoDominante", value)}
              style={{ height: 20, width: "100%", borderRadius: 15 }}
            >
              <Picker.Item label="Selecione..." value={null} />
              <Picker.Item label="Destro(a)" value="Destro" />
              <Picker.Item label="Canhoto(a)" value="Canhoto" />
            </Picker>
          </View>
        </View>
      </View>

      {/* Campo Pé Dominante */}
      <View style={tw`mb-6`}>
        <Text
          style={[
            tw`text-green-400 text-sm mb-2`,
            { fontFamily: "Poppins_500Medium" },
          ]}
        >
          Pé Dominante
        </Text>
        <View
          style={tw`bg-green-400 border-2 border-green-400 justify-between rounded-2xl px-4 bg-white flex-row items-center p-3 w-full`}
        >
          <Icon
            name="foot-print"
            size={23}
            color="#61D483"
            style={{ marginRight: 6 }}
          />
          <View style={{ flex: 1 }}>
            <Picker
              selectedValue={formData.peDominante}
              onValueChange={(value) => updateField("peDominante", value)}
              style={{ height: 20, width: "100%", borderRadius: 15 }}
            >
              <Picker.Item label="Selecione..." value={null} />
              <Picker.Item label="Direito" value="Direito" />
              <Picker.Item label="Esquerdo" value="Esquerdo" />
            </Picker>
          </View>
        </View>
      </View>

      {/* Campos Peso e Altura - Layout horizontal */}
      <View style={tw`flex-row justify-between`}>
        {/* Campo Peso */}
        <View style={tw`w-[48%]`}>
          <Text
            style={[
              tw`text-green-400 text-sm mb-2`,
              { fontFamily: "Poppins_500Medium" },
            ]}
          >
            Peso
          </Text>
          <TextInput
            style={[
              tw`bg-green-400 border-2 border-green-400 rounded-2xl px-4 bg-white flex-row items-center h-12`,
              { fontFamily: "Poppins_500Medium" },
            ]}
            placeholderTextColor="#A9A9A9"
            placeholder="kg"
            value={formData.pesoKg}
            onChangeText={(value) => updateField("pesoKg", value)}
            keyboardType="numeric"
          />
        </View>

        {/* Campo Altura */}
        <View style={tw`w-[48%]`}>
          <Text
            style={[
              tw`text-green-400 text-sm mb-2`,
              { fontFamily: "Poppins_500Medium" },
            ]}
          >
            Altura
          </Text>
          <TextInput
            style={[
              tw`bg-green-400 border-2 border-green-400 rounded-2xl px-4 bg-white flex-row items-center h-12 outline-none`,
              { fontFamily: "Poppins_500Medium" },
            ]}
            placeholderTextColor="#A9A9A9"
            placeholder="Cm"
            value={formData.alturaCm}
            onChangeText={(value) => updateField("alturaCm", value)}
            keyboardType="numeric"
          />
        </View>
      </View>
    </Animated.View>
  );
}
