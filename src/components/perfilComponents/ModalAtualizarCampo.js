import React from "react";
import { View, Text, TextInput, Pressable, Modal } from "react-native";
import tw from "twrnc";

export default function ModalAtualizarCampo({
  visible,
  onClose,
  campoAtual,
  valorCampo,
  setValorCampo,
  onSave,
}) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 justify-center items-center bg-black/40`}>
        <View style={tw`bg-white w-10/12 rounded-[30px] p-5 relative`}>
          {/* Título */}
          <Text style={tw`text-lg font-bold text-[#61D483] mb-5`}>
            Alterar {campoAtual?.label?.toLowerCase()}
          </Text>

          {/* Campo antigo */}
          <Text style={tw`text-[#61D483] mb-1`}>
            Antigo {campoAtual?.label?.toLowerCase()}:
          </Text>
          <TextInput
            value={campoAtual?.valorAntigo || ""}
            editable={false}
            style={tw`border border-gray-300 w-full rounded-lg p-3 mb-4 bg-gray-100 text-gray-600 outline-none`}
          />

          {/* Campo novo */}
          <Text style={tw`text-gray-500 mb-1`}>
            Novo {campoAtual?.label?.toLowerCase()}:
          </Text>
          <TextInput
            value={valorCampo}
            onChangeText={setValorCampo}
            placeholder={`Digite o novo ${campoAtual?.label?.toLowerCase()}`}
            keyboardType={
              campoAtual?.key === "alturaCm" || campoAtual?.key === "pesoKg"
                ? "numeric"
                : "default"
            }
            style={tw`border-2 border-[#61D483] w-full rounded-lg p-3 mb-5 text-gray-700`}
          />

          {/* Botões */}
          <View style={tw`flex-row justify-between mt-2`}>
            <Pressable
              onPress={onClose}
              style={tw`border border-[#61D483] p-2 items-center justify-center rounded-[12px] w-[45%]`}
            >
              <Text style={tw`text-[#61D483]`}>Cancelar</Text>
            </Pressable>

            <Pressable
              onPress={onSave}
              style={tw`bg-[#61D483] items-center justify-center rounded-[12px] w-[45%]`}
            >
              <Text style={tw`text-white`}>Salvar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
