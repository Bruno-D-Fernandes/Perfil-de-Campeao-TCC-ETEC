import React, { forwardRef, useMemo } from 'react';
import { Text, Pressable, View } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';

const BottomSheetCriaPerfil = React.forwardRef(({ onDismiss, esporte, onCriarPerfilPress }, ref) => {
  const snapPoints = useMemo(() => ['30%', '60%'], []);

  return (
    <BottomSheetModal
      ref={ref} 
      index={0}
      snapPoints={snapPoints}
      onDismiss={onDismiss}
      backgroundStyle={{
        backgroundColor: 'white',
        borderRadius: 20,
      }}
    >
      <BottomSheetView style={{ padding: 20 }}>
        <View style={{ width: '100%', justifyContent: 'center', gap: 12 }}>
          <Text>Esporte id: {String(esporte)}</Text>
          
          <Pressable 
            onPress={() => onCriarPerfilPress(esporte)} 
            style={{ marginTop: 24, padding: 12, backgroundColor: '#49D372', alignItems: 'center', borderRadius: 12 }}
          >
            <Text style={{ color: 'white', fontWeight: '700' }}>Criar Perfil</Text>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default BottomSheetCriaPerfil;
