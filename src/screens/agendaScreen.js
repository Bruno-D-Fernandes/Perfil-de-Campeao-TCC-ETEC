import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";

// ------------ MOCK (Você irá trocar pela API no futuro) ------------
const mockConvites = [
  {
    id: 1,
    clube: "Santos FC",
    oportunidade: "Sub-17 - Atacante",
    data: "2025-02-20",
    hora: "14:00",
    local: "CT Rei Pelé",
  },
  {
    id: 2,
    clube: "Corinthians",
    oportunidade: "Sub-15 - Lateral",
    data: "2025-12-22",
    hora: "09:00",
    local: "Parque São Jorge",
  },
];

const mockAgenda = [
  {
    id: 10,
    clube: "Palmeiras",
    oportunidade: "Sub-20 - Meia",
    data: "2025-12-18",
    hora: "13:00",
    local: "Academia de Futebol",
  },
];
// -------------------------------------------------------------------

export default function AgendaScreen() {
  const today = new Date().toISOString().split("T")[0];

  const [convites, setConvites] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today);

  const [modalDayVisible, setModalDayVisible] = useState(false);
  const [modalConvitesVisible, setModalConvitesVisible] = useState(false);

  // 👉 NOVO MODAL DE HORÁRIOS
  const [modalHorasVisible, setModalHorasVisible] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  // Lista de 00h às 23h
  const horasDia = Array.from({ length: 24 }, (_, i) =>
    `${i.toString().padStart(2, "0")}:00`
  );

  useEffect(() => {
    setConvites(mockConvites);
    setAgenda(mockAgenda);
  }, []);

  function aceitarConvite(id) {
    const convite = convites.find((c) => c.id === id);
    setAgenda([...agenda, convite]);
    setConvites(convites.filter((c) => c.id !== id));
  }

  function recusarConvite(id) {
    setConvites(convites.filter((c) => c.id !== id));
  }

  // Marca dias com evento
  function getMarkedDates() {
    const marks = {};

    agenda.forEach((event) => {
      marks[event.data] = {
        marked: true,
        dotColor: "#22c55e",
      };
    });

    marks[selectedDate] = {
      ...(marks[selectedDate] || {}),
      selected: true,
      selectedColor: "#16a34a",
    };

    return marks;
  }

  const eventosDoDia = agenda.filter((e) => e.data === selectedDate);

  return (
    <View className="flex-1 p-3 bg-white">
      {/* ---------- CALENDÁRIO ---------- */}
      <Calendar
        markedDates={getMarkedDates()}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          setModalHorasVisible(true); // 👈 Agora abre o modal de HORÁRIOS
        }}
        theme={{
          todayTextColor: "#16a34a",
        }}
      />

      {/* BOTÃO PARA CONVITES */}
      <TouchableOpacity
        className="bg-blue-600 p-4 mt-3 rounded-xl items-center"
        onPress={() => setModalConvitesVisible(true)}
      >
        <Text className="text-white font-semibold text-lg">
          Ver Convites Pendentes
        </Text>
      </TouchableOpacity>

      {/* MINHA AGENDA */}
      <Text className="text-xl font-bold mt-5 mb-2">Minha Agenda</Text>

      {agenda.length === 0 && (
        <Text className="opacity-50">Nenhuma peneira marcada...</Text>
      )}

      <FlatList
        data={agenda}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="p-4 bg-green-100 rounded-2xl mb-3">
            <Text className="font-bold text-lg">{item.clube}</Text>
            <Text>{item.oportunidade}</Text>
            <Text>
              {item.data} às {item.hora}
            </Text>
            <Text>Local: {item.local}</Text>
          </View>
        )}
      />

      {/* =================================================== */}
      {/*       NOVO MODAL — HORÁRIOS DO DIA                 */}
      {/* =================================================== */}
      <Modal visible={modalHorasVisible} animationType="slide">
        <View className="flex-1 bg-white p-5">
          <Text className="text-2xl font-bold mb-3">
            Horários de {selectedDate}
          </Text>

          <FlatList
            data={horasDia}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const evento = eventosDoDia.find((e) => e.hora === item);

              return (
                <TouchableOpacity
                  className={`p-4 rounded-xl mb-2 ${
                    evento ? "bg-green-300" : "bg-gray-100"
                  }`}
                  onPress={() => {
                    if (evento) {
                      setEventoSelecionado(evento);
                      setModalDayVisible(true);
                    }
                  }}
                >
                  <Text className="text-lg">{item}</Text>
                  {evento && (
                    <Text className="font-bold text-green-900">
                      {evento.clube}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            }}
          />

          <TouchableOpacity
            onPress={() => setModalHorasVisible(false)}
            className="mt-5 p-4 bg-red-600 rounded-xl items-center"
          >
            <Text className="text-white font-semibold">Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* =================================================== */}
      {/*   MODAL ANTIGO — DETALHES DO EVENTO DO DIA         */}
      {/* =================================================== */}
      <Modal visible={modalDayVisible} animationType="slide">
        <View className="flex-1 bg-white p-5">
          {eventoSelecionado ? (
            <>
              <Text className="text-2xl font-bold mb-3">
                {eventoSelecionado.clube}
              </Text>
              <Text>{eventoSelecionado.oportunidade}</Text>
              <Text>
                {eventoSelecionado.data} às {eventoSelecionado.hora}
              </Text>
              <Text>Local: {eventoSelecionado.local}</Text>
            </>
          ) : (
            <Text>Nenhum evento encontrado.</Text>
          )}

          <TouchableOpacity
            onPress={() => setModalDayVisible(false)}
            className="mt-5 p-4 bg-black rounded-xl items-center"
          >
            <Text className="text-white font-semibold">Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* =================================================== */}
      {/*              MODAL DE CONVITES                     */}
      {/* =================================================== */}
      <Modal visible={modalConvitesVisible} animationType="slide">
        <View className="flex-1 p-5 bg-white">
          <Text className="text-2xl font-bold mb-4">Convites Pendentes</Text>

          <ScrollView>
            {convites.map((item) => (
              <View key={item.id} className="p-4 bg-gray-100 rounded-2xl mb-3">
                <Text className="font-bold text-lg">{item.clube}</Text>
                <Text>{item.oportunidade}</Text>
                <Text>
                  {item.data} às {item.hora}
                </Text>
                <Text>Local: {item.local}</Text>

                <View className="flex-row gap-3 mt-4">
                  <TouchableOpacity
                    className="bg-green-600 p-3 rounded-xl flex-1 items-center"
                    onPress={() => aceitarConvite(item.id)}
                  >
                    <Text className="text-white font-semibold">Aceitar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="bg-red-600 p-3 rounded-xl flex-1 items-center"
                    onPress={() => recusarConvite(item.id)}
                  >
                    <Text className="text-white font-semibold">Recusar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            className="bg-black p-4 rounded-xl mt-5 items-center"
            onPress={() => setModalConvitesVisible(false)}
          >
            <Text className="text-white font-semibold text-lg">Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
