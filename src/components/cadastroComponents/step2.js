import { View, Text, TextInput, StyleSheet } from "react-native";
import tw from "twrnc";
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export default function Step2({ formData, updateField }) {
  return (
    <View style={tw`flex-1`}>
      {/* Campo Mão Dominante */}
      <View style={tw`mb-6`}>
        <Text style={tw`text-green-400 text-sm font-semibold mb-2`}>
          Mão Dominante
        </Text>
        <View
          style={tw`bg-green-400 border-2 border-green-400 justify-between rounded-2xl px-4 bg-white flex-row items-center h-12 w-full`}
        >
          <Icon name="hand-back-right" size={20} color="#61D483" style={{ marginRight: 6 }} />
          <View style={{ flex: 1 }}>
            <Picker
              selectedValue={formData.maoDominante}
              onValueChange={(value) => updateField('maoDominante', value)}
                style={{ height: 30, width: '100%', borderRadius: 10}}
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
        <Text style={tw`text-green-400 text-sm font-semibold mb-2`}>
          Pé Dominante
        </Text>
        <View
          style={tw`bg-green-400 border-2 border-green-400 justify-between rounded-2xl px-4 bg-white flex-row items-center h-12 w-full`}
        >
          <Icon name="foot-print" size={23} color="#61D483" style={{ marginRight: 6 }} />
          <View style={{ flex: 1 }}>
            <Picker
              selectedValue={formData.peDominante}
              onValueChange={(value) => updateField('peDominante', value)}
              style={{ height: 30, width: '100%', borderRadius: 10}}
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
          <Text style={tw`text-green-400 text-sm font-semibold mb-2`}>
            Peso
          </Text>
          <TextInput
            style={tw`bg-green-400 border-2 border-green-400 rounded-2xl px-4 bg-white flex-row items-center h-12`}
            placeholderTextColor="#A9A9A9"
            placeholder="kg"
            value={formData.pesoKg}
            onChangeText={(value) => updateField("pesoKg", value)}
            keyboardType="numeric"
          />
        </View>

        {/* Campo Altura */}
        <View style={tw`w-[48%]`}>
          <Text style={tw`text-green-400 text-sm font-semibold mb-2`}>
            Altura
          </Text>
          <TextInput
            style={tw`bg-green-400 border-2 border-green-400 rounded-2xl px-4 bg-white flex-row items-center h-12`}
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