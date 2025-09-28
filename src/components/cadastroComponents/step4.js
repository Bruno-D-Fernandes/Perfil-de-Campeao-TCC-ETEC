import { View, Text, TextInput, Image } from "react-native";
import tw from "twrnc";

export default function Step4() {
    return(
            <View style={tw`flex-1 justify-center items-center px-8`}>
                {/* Texto principal "Cadastro realizado!" */}
                <Text style={tw`text-6xl font-bold text-green-400 text-center leading-tight`}>
                    Cadastro{'\n'}realizado!
                </Text>
            </View>
    )
}
