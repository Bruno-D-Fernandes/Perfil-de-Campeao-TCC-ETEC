import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native'; // Importação correta
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

// Usamos Animated.View para aplicar estilos animados
const AnimatedView = Animated.createAnimatedComponent(View);

const ListItem = React.memo(
  ({ item }) => {
    // Usamos useSharedValue do Reanimated para gerenciar o estado da animação
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.6);

    useEffect(() => {
      // Inicia a animação quando o componente é montado
      opacity.value = withTiming(1, { duration: 500 });
      scale.value = withTiming(1, { duration: 500 });
    }, []);

    // Define os estilos animados
    const animatedStyle = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
      };
    });

    return (
      <AnimatedView style={[styles.listItem, animatedStyle]} />
    );
  }
);

const styles = StyleSheet.create({
  listItem: {
    height: 80,
    width: '90%',
    backgroundColor: '#78CAD2',
    marginVertical: 10, 
    marginHorizontal: 'auto',
    borderRadius: 15,
  },
});

export { ListItem };