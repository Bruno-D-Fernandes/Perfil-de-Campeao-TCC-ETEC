import React from "react";
import { View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";

export default function PacienteScreen() {
  // valores compartilhados (posição dos botões)
  const icon1 = useSharedValue(40);
  const icon2 = useSharedValue(40);
  const icon3 = useSharedValue(40);
  const iconHeight = useSharedValue(10);

  const [pop, setPop] = React.useState(false);

  // estilos animados
  const styleIcon1 = useAnimatedStyle(() => ({ // lixeira
    bottom: icon1.value,
    right: 15,
    height: iconHeight.value,
    width: iconHeight.value,
  }));

  const styleIcon2 = useAnimatedStyle(() => ({ // edição
    bottom: icon2.value + 50,
    right: icon2.value - 20,
    height: iconHeight.value,
    width: iconHeight.value,
  }));

  const styleIcon3 = useAnimatedStyle(() => ({ // mais
    right: icon3.value,
    bottom: 80,
    height: iconHeight.value,
    width: iconHeight.value,
  }));

  const popIn = () => {
    setPop(true);
    icon1.value = withSpring(190, { duration: 1000 });
    icon2.value = withSpring(110, { duration: 1000 });
    icon3.value = withSpring(120, { duration: 1000 });
    iconHeight.value = withSpring(56, { duration: 1400 });
  };

  const popOut = () => {
    setPop(false);
    icon1.value = withTiming(40, { duration: 300 });
    icon2.value = withTiming(40, { duration: 300 });
    icon3.value = withTiming(40, { duration: 300 });
    iconHeight.value = withSpring(10, { duration: 1400 });
  };



  return (
    <View className="flex-1">
      {/* Botão 1 */}
      <Animated.View
        style={styleIcon1}
        className="bg-gray-400 absolute rounded-full justify-center items-center"
      >
        <TouchableOpacity> {/* Remover touchOpacity, velho esqueci a palavra --Bruno */}
          <Icon name="trash" size={25} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>

      {/* Botão 2 */}
      <Animated.View
        style={styleIcon2}
        className="bg-gray-400 absolute rounded-full justify-center items-center"
      >
        <TouchableOpacity>
          <Icon name="edit" size={25} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>

      {/* Botão 3 */}
      <Animated.View
        style={styleIcon3}
        className="bg-gray-400 absolute rounded-full justify-center items-center"
      >
        <TouchableOpacity > {/* OnPress aqui */}
          <Icon name="plus" size={25} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>

      {/* Botão principal */}
      <TouchableOpacity
        className="bg-gray-400 w-14 h-14 absolute bottom-10 mb-10 right-5 rounded-full justify-center items-center"
        onPress={() => {
          pop ? popOut() : popIn();
        }}
      >
        <Icon name="plus" size={25} color="#FFF" />
      </TouchableOpacity>

    </View>
  );
}