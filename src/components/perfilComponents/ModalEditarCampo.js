import React from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import tw from "twrnc";

export default function ModalEditarCampo({
  visible,
  onClose,
  fieldLabel,
  fieldKey,
  editData,
  setEditData,
  onSave,
}) {
  if (!fieldKey) return null; // evita erro caso não tenha campo selecionado

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View
        style={tw`flex-1 bg-black/60 justify-center items-center px-6`}
      >
        <View
          style={tw`w-full bg-white rounded-2xl p-6`}
        >
          <Text
            style={[
              tw`text-xl text-[#61D483] font-bold mb-3`,
              { fontFamily: "Poppins_600SemiBold" },
            ]}
          >
            Editar {fieldLabel}
          </Text>

          <TextInput
            style={[
              tw`border border-gray-300 rounded-xl px-4 py-3 text-base`,
              { fontFamily: "Poppins_400Regular" },
            ]}
            placeholder={`Digite o novo ${fieldLabel.toLowerCase()}`}
            value={editData[fieldKey] || ""}
            onChangeText={(value) =>
              setEditData({ ...editData, [fieldKey]: value })
            }
          />

          <View style={tw`flex-row justify-end gap-4 mt-5`}>
            <Pressable
              style={tw`px-5 py-2 border border-gray-300 rounded-lg`}
              onPress={onClose}
            >
              <Text
                style={[
                  tw`text-gray-500`,
                  { fontFamily: "Poppins_500Medium" },
                ]}
              >
                Cancelar
              </Text>
            </Pressable>

            <Pressable
              style={tw`px-6 py-2 bg-[#61D483] rounded-lg`}
              onPress={() => {
                onSave();
                onClose();
              }}
            >
              <Text
                style={[
                  tw`text-white font-semibold`,
                  { fontFamily: "Poppins_500Medium" },
                ]}
              >
                Salvar
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
