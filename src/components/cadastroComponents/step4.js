import { View, Text, TextInput, Image } from "react-native";
import tw from "twrnc";
import Animated, { SlideOutLeft, SlideInRight } from "react-native-reanimated";

export default function Step4() {
    return (
        <Animated.View style={tw`flex-1 justify-center items-center px-8`}
            entering={SlideInRight}
            exiting={SlideOutLeft}
        >
            {/* Texto principal "Cadastro realizado!" */}
            <Text style={tw`text-6xl font-bold text-green-400 text-center leading-tight`}>
                Cadastro{'\n'}realizado!
            </Text>
        </Animated.View>
    )
}
