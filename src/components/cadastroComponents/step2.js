import { View, Text, TextInput, StyleSheet } from "react-native";
import tw from "twrnc";
import RNPickerSelect from "react-native-picker-select";
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useFonts, Poppins_400Regular, Poppins_700Bold, Poppins_500Medium } from "@expo-google-fonts/poppins";


export default function Step2({ formData, updateField }) {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_500Medium
  });

  return (
    <View style={tw`mb-8`}>
      {/* Campo Mão Dominante */}
      <View style={tw`mb-6`}>
        <Text style={[tw`text-green-400 text-sm  mb-2`, {fontFamily:'Poppins_500Medium'}]}>
          Mão Dominante
        </Text>
        <View
          style={tw`bg-green-400 border-2 border-green-400 justify-between rounded-2xl px-4 bg-white flex-row items-center p-3 w-full`}
        >
          <Icon name="hand-back-right" size={20} color="#61D483" style={{ marginRight: 6 }} />
          <View style={{ flex: 1, alignItems: "center" }}>
            <RNPickerSelect
              onValueChange={(value) => updateField("maoDominante", value)}
              items={[
                { label: "Destro(a)", value: "destro" },
                { label: "Canhoto(a)", value: "canhoto" },
              ]}
              style={pickerSelectStyles}
              value={formData.maoDominante}
              placeholder={{
                label: "Selecione...",
                value: null,
              }}
              useNativeAndroidPickerStyle={false}
            />
          </View>
        </View>
      </View>

      {/* Campo Pé Dominante */}
      <View style={tw`mb-6`}>
        <Text style={[tw`text-green-400 text-sm mb-2`, {fontFamily:'Poppins_500Medium'}]}>
          Pé Dominante
        </Text>
        <View
          style={tw`bg-green-400 border-2 border-green-400 justify-between rounded-2xl px-4 bg-white flex-row items-center p-3 w-full`}
        >
          <Icon name="foot-print" size={23} color="#61D483" style={{ marginRight: 6 }} />
          <View style={{ flex: 1, alignItems: "center" }}>
            <RNPickerSelect
            outline=''
              onValueChange={(value) => updateField("peDominante", value)}
              items={[
                { label: "Direito", value: "direito" },
                { label: "Esquerdo", value: "esquerdo" },
              ]}
              style={pickerSelectStyles}
              value={formData.peDominante}
              placeholder={{
                label: "Selecione...",
                value: null,
              }}
              useNativeAndroidPickerStyle={false}
            />
          </View>
        </View>
      </View>

      {/* Campos Peso e Altura - Layout horizontal */}
      <View style={tw`flex-row justify-between`}>
        {/* Campo Peso */}
        <View style={tw`w-[48%]`}>
          <Text style={[tw`text-green-400 text-sm mb-2`, {fontFamily:'Poppins_500Medium'}]}>
            Peso
          </Text>
          <TextInput
            style={[tw`bg-green-400 border-2 border-green-400 rounded-2xl px-4 bg-white flex-row items-center h-12`, {fontFamily:'Poppins_500Medium'}]}
            placeholderTextColor="#A9A9A9"
            placeholder="kg"
            value={formData.pesoKg}
            onChangeText={(value) => updateField("pesoKg", value)}
            keyboardType="numeric"
          />
        </View>

        {/* Campo Altura */}
        <View style={tw`w-[48%]`}>
          <Text style={[tw`text-green-400 text-sm mb-2`, {fontFamily:'Poppins_500Medium'}]}>
            Altura
          </Text>
          <TextInput
            style={[tw`bg-green-400 border-2 border-green-400 rounded-2xl px-4 bg-white flex-row items-center h-12 outline-none`, {fontFamily:'Poppins_500Medium'}]}
            placeholderTextColor="#A9A9A9"
            placeholder="Cm"
            value={formData.alturaCm}
            onChangeText={(value) => updateField("alturaCm", value)}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 8,
    fontFamily:'Poppins_500Medium',
    color: "#333",
    textAlign: "center", 
  },
  inputAndroid: {
    fontSize: 16,
    fontFamily:'Poppins_500Medium',
    color: "#333",
          
    textAlign: "center",
  },
  placeholder: {
    color: "#A9A9A9",
    textAlign: "center",
  },
  iconContainer: {
    top: 12,
    right: 12,
  },
});
