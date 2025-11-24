import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
  Pressable,
} from "react-native";
import { Calendar } from "react-native-calendars";

const mockConvites = [
  {
    id: 1,
    clube: "Santos FC",
    oportunidade: "Sub-17 - Atacante",
    data: "2025-12-20",
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
  {
    id: 2,
    clube: "Botafogo",
    oportunidade: "Sub-15 - Lateral",
    data: "2025-12-22",
    hora: "09:00",
    local: "Parque São Jorge",
  },
  {
    id: 2,
    clube: "Vasco da Gama",
    oportunidade: "Sub-15 - Lateral",
    data: "2025-12-22",
    hora: "09:00",
    local: "Parque São Jorge",
  },
  {
    id: 2,
    clube: "Barcelona",
    oportunidade: "Sub-25 - Lateral",
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
  {
    id: 11,
    clube: "São Paulo FC",
    oportunidade: "Sub-17 - Goleiro",
    data: "2025-12-25",
    hora: "10:00",
    local: "CT de Cotia",
  },
];

export default function AgendaScreen() {
  const today = new Date().toISOString().split("T")[0];

  const [convites, setConvites] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today);

  const [modalDayVisible, setModalDayVisible] = useState(false);
  const [modalConvitesVisible, setModalConvitesVisible] = useState(false);
  const [modalHorasVisible, setModalHorasVisible] = useState(false);
  const [modalMeusEventos, setModalMeusEventos] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

    // BottomSheet
const sheetRef = useRef(null);
const snapPoints = useMemo(() => ["40%", "70%"], []);

const abrirBottomSheet = useCallback(() => {
  sheetRef.current?.present();
}, []);

const fecharBottomSheet = useCallback(() => {
  sheetRef.current?.dismiss();
}, []);

const handleDismiss = () => {
  setEventoSelecionado(null);
};


  const horasDia = Array.from({ length: 24 }, (_, i) =>
    `${i.toString().padStart(2, "0")}:00`
  );

  useEffect(() => {
    const sortedAgenda = [...mockAgenda].sort((a, b) => {
        const dateA = new Date(`${a.data}T${a.hora}`);
        const dateB = new Date(`${b.data}T${b.hora}`);
        return dateA - dateB;
    });

    setConvites(mockConvites);
    setAgenda(sortedAgenda);
  }, []);

  function aceitarConvite(id) {
    const convite = convites.find((c) => c.id === id);
    if (convite) {
        setAgenda((prevAgenda) => {
            const newAgenda = [...prevAgenda, convite];
            return newAgenda.sort((a, b) => {
                const dateA = new Date(`${a.data}T${a.hora}`);
                const dateB = new Date(`${b.data}T${b.hora}`);
                return dateA - dateB;
            });
        });
    }
    setConvites(convites.filter((c) => c.id !== id));
  }

  function recusarConvite(id) {
    setConvites(convites.filter((c) => c.id !== id));
  }

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

    const formatDateForTimeline = (dateString) => {
    const date = new Date(dateString + 'T00:00:00'); 
    const day = date.getDate().toString().padStart(2, '0');
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const dayOfWeek = dayNames[date.getDay()];
    return { day, dayOfWeek: dayOfWeek.slice(0, 3) }; 
  };

  const TimelineItem = ({ item, isFirst, isLast }) => {
    const { day, dayOfWeek } = formatDateForTimeline(item.data);
    
    const cardColor = "bg-white";
    const textColor = "text-gray-800";
    const circleColor = "bg-[#61D483]";
    
    const displayDate = isFirst; 

    return (
      <View className="flex-row">
        <View className="flex-col items-center w-20 pr-4">
            {displayDate && (
                <>
                    <Text className="text-gray-900 font-bold text-2xl leading-7">{day}</Text>
                    <Text className="text-gray-500 text-sm mb-2 font-semibold">{dayOfWeek}</Text>
                </>
            )}
            
            <View className="flex-col items-center flex-1">
                <View className={`w-3 h-3 rounded-full ${circleColor} z-10`} />
                
                {!isLast && (
                    <View className="flex-1 w-0.5 bg-gray-300 -mt-0.5" />
                )}
                {!displayDate && isLast && (
                    <View className="h-4" />
                )}
            </View>
        </View>

        <View className="flex-1 ml-2">
            <TouchableOpacity 
                className={`p-3 ${cardColor} rounded-xl shadow-md mb-6`}
                onPress={() => {
                    setEventoSelecionado(item);
                    setModalDayVisible(true);
                }}
            >
                {isFirst && item.clube === "Palmeiras" && (
                    <View className="absolute top-0 right-0 p-2 bg-[#61D483] rounded-tr-xl rounded-bl-lg">
                        <Text className="text-white font-bold text-xs">NOVO</Text>
                    </View>
                )}
                
                <Text className={`font-bold text-base ${textColor}`}>{item.clube}</Text>
                <Text className={`text-sm ${textColor} opacity-80 mt-1`}>{item.oportunidade}</Text>
                <Text className={`text-sm ${textColor} opacity-80 mt-1`}>
                    {item.hora} (Ajuste o formato final se tiver duração)
                </Text>
                <Text className={`text-xs ${textColor} opacity-60 mt-1`}>Local: {item.local}</Text>
                
            </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 p-3 bg-white">
      <Pressable onPress={() => setModalMeusEventos(true)}>
        <Text> meus eventos </Text>
      </Pressable>

      <Calendar
        markedDates={getMarkedDates()}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          setEventoSelecionado(null); 
          abrirBottomSheet(); 
        }}

        theme={{
          todayTextColor: "#16a34a",
        }}
      />

      <Modal 
        visible={modalMeusEventos}
        animationType="slide"
      >
        <View className="flex-1 bg-gray-50 pt-10 px-5">
            
            <View className="flex-row justify-between items-center mb-6">
                <TouchableOpacity onPress={() => setModalMeusEventos(false)}>
                    <Text className="text-3xl font-light text-gray-800">☰</Text>
                </TouchableOpacity>
                <Text className="text-2xl font-semibold text-gray-800">Agenda de Peneiras</Text> 
                <TouchableOpacity onPress={() => console.log('Mais Opções')}>
                    <Text className="text-3xl font-light text-gray-800">⋮</Text>
                </TouchableOpacity>
            </View>

            <View className="flex-1">
                <TouchableOpacity

                    className="bg-[#61D483] p-4 rounded-xl items-center mb-6"
                    onPress={() => setModalConvitesVisible(true)}
                >
                    <Text className="text-white font-semibold text-lg">
                        Ver Convites Pendentes ({convites.length})
                    </Text>
                </TouchableOpacity>

                <Text className="text-xl font-bold mb-4 text-gray-800">Próximas Peneiras</Text>

                {agenda.length === 0 ? (
                    <Text className="opacity-50 mt-4">Nenhuma peneira marcada...</Text>
                ) : (
                    <FlatList
                        data={agenda}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            const isLast = index === agenda.length - 1;

                            const previousItem = agenda[index - 1];
                            const isNewDay = !previousItem || previousItem.data !== item.data;

                            return (
                                <TimelineItem 
                                    item={item} 
                                    isFirst={isNewDay}
                                    isLast={isLast} 
                                />
                            );
                        }}
                    />
                )}
            </View>
        </View>
      </Modal>

    
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
<BottomSheetModal
  ref={sheetRef}
  index={0}
  snapPoints={snapPoints}
  onDismiss={handleDismiss}
  backgroundStyle={{
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 12,
  }}
>

 <BottomSheetView style={{ flex: 1 }}> 
    <View style={{ paddingHorizontal: 20 }}>
        <Text className="text-2xl font-bold mb-3">
            Horários de {selectedDate}
        </Text>
    </View>

    <FlatList
        data={horasDia}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }} 
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
    
    {eventoSelecionado && (
        <View className="mt-5 p-4 bg-white rounded-xl shadow" style={{ marginHorizontal: 20 }}>
            <Text className="text-xl font-bold">
                {eventoSelecionado.clube}
            </Text>
            <Text>{eventoSelecionado.oportunidade}</Text>
            <Text>
                {eventoSelecionado.data} às {eventoSelecionado.hora}
            </Text>
            <Text>Local: {eventoSelecionado.local}</Text>
        </View>
    )}
</BottomSheetView>
</BottomSheetModal>


    </View>
  );
}