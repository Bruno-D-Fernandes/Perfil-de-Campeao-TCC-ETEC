import React from "react";
import { View, Pressable, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const PlusButton = ({ onPress }) => (
  <Pressable
    onPress={onPress}
    style={{
      // Estilos do botão central
      top: 0,
      width: 52,
      height: 40,
      borderRadius: 30,
      backgroundColor: "#49D372",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Feather name="plus" size={30} color="#fff" />
  </Pressable>
);

const TabBarItem = ({ route, isFocused, onPress, iconName, size = 24 }) => {
  const color = isFocused ? "#49D372" : "#888";

  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Feather name={iconName} size={size} color={color} />
    </Pressable>
  );
};

export default function CustomTabBar({ state, descriptors, navigation }) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarStyle?.display === "none") {
    return null;
  }

  const tabContainerWidth = width * 0.95;
  const paddingHorizontal = 10;
  const itemsAreaWidth = tabContainerWidth - paddingHorizontal * 2;
  const itemWidth = itemsAreaWidth / state.routes.length;

  const indicatorTranslateX = useSharedValue(0);

  const getIconName = (routeName) => {
    switch (routeName) {
      case "Oportunidades":
        return "home";
      case "Portfolio":
        return "file-text";
      case "Perfil":
        return "user";
      case "Notificacao":
        return "bell";
      case "Config":
        return "settings";
      default:
        return "circle";
    }
  };

  const indicatorWidth = itemWidth * 0.4;
  const indicatorOffset = (itemWidth - indicatorWidth) / 2;

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorTranslateX.value + indicatorOffset }],
    };
  });

  React.useEffect(() => {
    const focusedIndex = state.index;
    const targetX = focusedIndex * itemWidth;
    indicatorTranslateX.value = withTiming(targetX, { duration: 250 });
  }, [state.index, itemWidth]);

  return (
    <View
      style={{
        position: "absolute",
        bottom: 10,
        width: "100%",
        alignItems: "center",
      }}
    >
      <View
        style={{
          height: 70,
          width: tabContainerWidth,
          position: "absolute",
          bottom: 30,
          borderRadius: 60,
          paddingHorizontal: paddingHorizontal,
          backgroundColor: "#ffff",
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 1, height: 0.1 },
          shadowOpacity: 0.1,
          shadowRadius: 15,
          elevation: 5,
        }}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              top: 8,
              left: paddingHorizontal,
              width: indicatorWidth,
              height: 4,
              borderRadius: 2,
              backgroundColor: "#49D372",
            },
            animatedIndicatorStyle,
          ]}
        />
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          if (route.name === "Postagem") {
            return (
              <View
                key={route.key}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PlusButton onPress={onPress} />
              </View>
            );
          }

          return (
            <TabBarItem
              key={route.key}
              route={route}
              isFocused={isFocused}
              onPress={onPress}
              iconName={getIconName(route.name)}
            />
          );
        })}
      </View>
    </View>
  );
}
