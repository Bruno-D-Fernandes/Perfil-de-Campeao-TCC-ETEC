import React from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import Modal from "react-native-modal";
import { useFonts, Poppins_400Regular, Poppins_700Bold, Poppins_500Medium } from "@expo-google-fonts/poppins";

const { width } = Dimensions.get("window");

export default function FloatingOptionsModal({
  visible,
  onClose,
  onEdit,
  onDelete,
  position = { top: 200, left: width / 2 - 80 },
}) {

      const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_500Medium
  });
  return (
    <Modal
      isVisible={visible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropOpacity={0}
      onBackdropPress={onClose}
      style={styles.modalContainer}
    >
      <View style={[styles.popup, { top: position.top, left: position.left }]}>
        <Pressable style={styles.option} onPress={onEdit}>
          <Text style={styles.editText}>Editar</Text>
        </Pressable>
        <View style={styles.divider} />
        <Pressable style={styles.option} onPress={onDelete}>
          <Text style={styles.deleteText}>Excluir</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { margin: 0, position: "absolute" },
  popup: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    width: 150,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  option: { paddingVertical: 6 },
  editText: { color: "#4AD372", fontSize: 15, fontFamily:"Poppins_500Medium" },
  deleteText: { color: "#F44336", fontSize: 15, fontFamily:"Poppins_500Medium" },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 4 },
});
