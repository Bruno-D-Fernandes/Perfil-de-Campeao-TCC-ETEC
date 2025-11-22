import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";

const HOURS = Array.from({ length: 24 }).map((_, i) =>
  `${String(i).padStart(2, "0")}:00`
);

export default function AgendaScreen() {
  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [events, setEvents] = useState({});
  const [modalHoursVisible, setModalHoursVisible] = useState(false);
  const [modalEventVisible, setModalEventVisible] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);
  const [eventTitle, setEventTitle] = useState("");

  function openHoursModal(date) {
    setSelectedDate(date);
    setModalHoursVisible(true);
  }

  function openEventModal(hour) {
    setSelectedHour(hour);
    setModalEventVisible(true);
  }

  function saveEvent() {
    if (!eventTitle || !selectedHour) return;

    const dayEvents = events[selectedDate] || {};
    const hourEvents = dayEvents[selectedHour] || [];

    const updatedEvents = {
      ...events,
      [selectedDate]: {
        ...dayEvents,
        [selectedHour]: [
          ...hourEvents,
          {
            id: Date.now(),
            title: eventTitle,
          },
        ],
      },
    };

    setEvents(updatedEvents);
    setEventTitle("");
    setModalEventVisible(false);
  }

  function getMarkedDates() {
    const marks = {};

    // marcar hoje
    marks[today] = { selected: true, selectedColor: "#4ade80" };

    // marcar dias com eventos
    Object.keys(events).forEach((day) => {
      marks[day] = {
        ...marks[day],
        marked: true,
        dotColor: "#dc2626",
      };
    });

    // marcar dia selecionado
    marks[selectedDate] = {
      ...marks[selectedDate],
      selected: true,
      selectedColor: "#16a34a",
    };

    return marks;
  }

  return (
    <View className="flex-1 p-3 bg-white">
      {/* Calendário */}
      <Calendar
        onDayPress={(day) => openHoursModal(day.dateString)}
        markedDates={getMarkedDates()}
        theme={{
          todayTextColor: "#16a34a",
        }}
      />

      {/* MODAL DE HORAS */}
      <Modal visible={modalHoursVisible} animationType="slide">
        <View className="flex-1 bg-gray-100 p-4">
          <Text className="text-2xl font-bold mb-3">
            {selectedDate}
          </Text>

          <ScrollView>
            {HOURS.map((hour) => (
              <TouchableOpacity
                key={hour}
                className="bg-white p-4 rounded-xl mb-2"
                onPress={() => openEventModal(hour)}
              >
                <Text className="text-lg font-semibold">{hour}</Text>

                {events[selectedDate]?.[hour]?.map((ev) => (
                  <Text key={ev.id} className="text-gray-500 ml-2">
                    • {ev.title}
                  </Text>
                ))}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            onPress={() => setModalHoursVisible(false)}
            className="mt-3 p-3 rounded-xl bg-red-600 items-center"
          >
            <Text className="text-white font-semibold">Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* MODAL DE EVENTO */}
      <Modal visible={modalEventVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white w-4/5 p-5 rounded-2xl">
            <Text className="text-xl font-bold mb-3">
              Novo Evento — {selectedHour}
            </Text>

            <TextInput
              placeholder="Título do evento"
              value={eventTitle}
              onChangeText={setEventTitle}
              className="bg-gray-100 p-3 rounded-xl mb-4"
            />

            <TouchableOpacity
              className="bg-green-600 p-3 rounded-xl items-center"
              onPress={saveEvent}
            >
              <Text className="text-white font-semibold">Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-red-600 p-3 rounded-xl items-center mt-2"
              onPress={() => setModalEventVisible(false)}
            >
              <Text className="text-white font-semibold">Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
