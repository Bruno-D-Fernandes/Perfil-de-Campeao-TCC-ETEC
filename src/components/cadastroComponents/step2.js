import { View, Text, TextInput } from "react-native";
import tw from "twrnc";
import RNPickerSelect from 'react-native-picker-select';

export default function Step2({ formData, updateField, pickerSelectStyles }) {
  return (
    <View style={tw`flex-1`}>
      {/* Campo Mão Dominante */}
      <View style={tw`mb-6`}>
        <Text style={tw`text-green-400 text-sm font-semibold mb-2`}>Mão Dominante</Text>
        <RNPickerSelect
          onValueChange={(value) => updateField('maoDominante', value)}
          items={[
            { label: 'Destro(a)', value: 'destro' },
            { label: 'Canhoto(a)', value: 'canhoto' },
          ]}
          style={pickerSelectStyles}
          value={formData.maoDominante}
          placeholder={{
            label: 'Selecione...',
            value: null,
          }}
          useNativeAndroidPickerStyle={false}
        />
      </View>

      {/* Campo Pé Dominante */}
      <View style={tw`mb-6`}>
        <Text style={tw`text-green-400 text-sm font-semibold mb-2`}>Pé Dominante</Text>
        <RNPickerSelect
          onValueChange={(value) => updateField('peDominante', value)}
          items={[
            { label: 'Direito', value: 'direito' },
            { label: 'Esquerdo', value: 'esquerdo'},
          ]}
          style={pickerSelectStyles}
          value={formData.peDominante}
          placeholder={{
            label: 'Selecione...',
            value: null,
          }}
          useNativeAndroidPickerStyle={false}
        />
      </View>

      {/* Campos Peso e Altura - Layout horizontal */}
      <View style={tw`flex-row justify-between`}>
        {/* Campo Peso */}
        <View style={tw`w-[48%]`}>
          <Text style={tw`text-green-400 text-sm font-semibold mb-2`}>Peso</Text>
          <TextInput
            style={tw`bg-green-400 border-2 border-green-400 rounded-2xl px-4 bg-white flex-row items-center h-12`}
            placeholderTextColor="#A9A9A9"
            placeholder="kg"
            value={formData.pesoKg}
            onChangeText={(value) => updateField('pesoKg', value)}
            keyboardType="numeric"
          />
        </View>

        {/* Campo Altura */}
        <View style={tw`w-[48%]`}>
          <Text style={tw`text-green-400 text-sm font-semibold mb-2`}>Altura</Text>
          <TextInput
            style={tw`bg-green-400 border-2 border-green-400 rounded-2xl px-4 bg-white flex-row items-center h-12`}
            placeholderTextColor="#A9A9A9"
            placeholder="Cm"
            value={formData.alturaCm}
            onChangeText={(value) => updateField('alturaCm', value)}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );
}

