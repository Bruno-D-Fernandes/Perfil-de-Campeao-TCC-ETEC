import { Pressable, Text } from 'react-native';
import React, { useState } from 'react';

export default function BtnSeguir() {
  const [seguindo, setSeguindo] = useState(false);

  return (
    <Pressable
      onPress={() => setSeguindo(!seguindo)}
      className={` rounded-[12px] items-center justify-center ${
        seguindo ? 'bg-[#49D372] w-22' : 'border border-[#49D372] w-16'
      }`}
    >
      <Text
        className={` ${seguindo ? 'text-white' : 'text-[#49D372]'} text-[6px]`}
        style={{ fontFamily: 'Poppins_500Medium', margin:5 }}
      >
        {seguindo ? 'Seguindo' : 'Seguir'}
      </Text>
    </Pressable>
  );
}
