import { View, Text, Image } from "react-native";
import tw from "twrnc";

export default function InfoCard({ label, value, iconSource, capitalizeValue = false }) {
  if (!value) {
    return null;
  }

  const displayValue = capitalizeValue ? value.charAt(0).toUpperCase() + value.slice(1) : value;

  return (
    <View style={tw`bg-white w-[48%] rounded-xl p-4 mb-3`}>
      <Image
        source={iconSource}
        style={tw`w-10 h-10 rounded-full`}
      />
      <Text style={tw`text-[#61D483] text-sm`}>{label}</Text>
      <Text style={tw`text-green-600 font-bold ${capitalizeValue ? 'capitalize' : ''}`}>
        {displayValue}
      </Text>
    </View>
  );
}
