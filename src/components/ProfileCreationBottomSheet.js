import React, { forwardRef, useMemo, useCallback } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";

// Componente BottomSheet para incentivar a criação de perfil
const ProfileCreationBottomSheet = forwardRef(({ onDismiss }, ref) => {
  const navigation = useNavigation();
  // Pontos de ancoragem ajustados para o conteúdo da imagem
  const snapPoints = useMemo(() => ["55%", "70%"], []);

  const handleCreateProfile = useCallback(() => {
    navigation.replace("MainTabs", { screen: "Perfil" });
    if (ref && ref.current) {
      ref.current.dismiss();
    }
  }, [navigation, ref]);

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      onDismiss={onDismiss}
      enablePanDownToClose={false}
      bottomInset={0}
      style={{ zIndex: 999 }}
      backdropComponent={({ style }) => (
        <View style={[style, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]} />
      )}
      backgroundStyle={styles.bottomSheetBackground}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View className="w-full items-center justify-center p-4">
          <Image
            source={require("../../assets/image24.png")} // Placeholder
            style={styles.illustrationImage}
            resizeMode="contain"
          />

          <Text style={styles.titleText}>Só falta uma coisinha!</Text>
          <Text style={styles.subtitleText}>
            Vamos criar o seu perfil de esportes.
          </Text>

          <Text style={styles.descriptionText}>
            Isso garante recomendações corretas e conteúdos relevantes.
          </Text>

          <Pressable
            onPress={handleCreateProfile}
            style={styles.createProfileButton}
          >
            <Text style={styles.buttonText}>Criar Perfil de esporte</Text>
            <Image
              source={require("../../assets/Group100.png")} // Placeholder
              style={styles.addButtonIcon}
            />
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 12,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  illustrationImage: {
    width: "100%",
    height: 150,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#36A958",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 18,
    color: "#36A958",
    marginBottom: 30,
    textAlign: "center",
  },
  descriptionText: {
    fontSize: 16,
    color: "#4B5563",
    marginBottom: 40,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  createProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#61D483",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: "80%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  addButtonIcon: {
    width: 20,
    height: 20,
  },
});

export default ProfileCreationBottomSheet;
