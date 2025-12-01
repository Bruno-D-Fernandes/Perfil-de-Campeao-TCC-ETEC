import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import api from "../services/axios";

LocaleConfig.locales["pt"] = {
  monthNames: [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ],
  monthNamesShort: [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ],
  dayNames: [
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado",
  ],
  dayNamesShort: ["dom", "seg", "ter", "qua", "qui", "sex", "sab"],
  today: "Hoje",
};

LocaleConfig.defaultLocale = "pt";

const formatEventData = (evento) => {
  const dataInicio = new Date(evento.data_hora_inicio);
  const dataFim = new Date(evento.data_hora_fim);

  const data = dataInicio.toISOString().split("T")[0];
  const horaInicio = dataInicio.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const horaFim = dataFim.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const color = evento.color || "#22c55e";

  return {
    ...evento,
    data: data,
    hora: horaInicio,
    horaFim: horaFim,
    clube: `Clube ID ${evento.clube_id}`,
    oportunidade: evento.titulo,
    local: `${evento.rua}, ${evento.numero} - ${evento.bairro}, ${evento.cidade}/${evento.estado}`,
    descricaoCompleta: evento.descricao,
    limite: evento.limite_participantes,
    color: color,
  };
};

export default function AgendaScreen() {
  const today = new Date().toISOString().split("T")[0];
  const navigation = useNavigation();

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
  const snapPoints = useMemo(() => ["40%", "30%"], []);

  const abrirBottomSheet = useCallback(() => {
    sheetRef.current?.present();
  }, []);

  useFocusEffect(
    useCallback(() => {
      sheetRef.current?.present();

      return () => {
        sheetRef.current?.dismiss();
      };
    }, [])
  );
  const fecharBottomSheet = useCallback(() => {
    sheetRef.current?.dismiss();
  }, []);

  const handleDismiss = () => {
    setEventoSelecionado(null);
  };

  const horasDia = Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`
  );

  useEffect(() => {
    const fetchAgenda = async () => {
      try {
        const dadosAgenda = await api.get("eventos");

        const eventosFormatados = dadosAgenda.data.eventos.map(formatEventData);

        setAgenda(eventosFormatados);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      }
    };

    fetchAgenda();
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
        ...(marks[event.data] || {}),
        marked: true,
        dotColor: event.color || "#22c55e",
      };
      {
        console.log(event);
      }
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
    const date = new Date(dateString + "T00:00:00");
    const day = date.getDate().toString().padStart(2, "0");
    const dayNames = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ];
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
              <Text className="text-green-900 font-bold text-2xl leading-7">
                {day}
              </Text>
              <Text className="text-gray-500 text-sm mb-2 font-semibold">
                {dayOfWeek}
              </Text>
            </>
          )}

          <View className="flex-col items-center flex-1">
            <View className={`w-3 h-3 rounded-full ${circleColor} z-10`} />

            {!isLast && <View className="flex-1 w-0.5 bg-gray-300 -mt-0.5" />}
            {!displayDate && isLast && <View className="h-4" />}
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
            {isFirst && (
              <View className="absolute top-0 right-0 p-2 bg-[#61D483] rounded-tr-xl rounded-bl-lg">
                <Text className="text-white font-bold text-xs">NOVO</Text>
              </View>
            )}

            <Text className={`font-bold text-base ${textColor}`}>
              {item.titulo} {/* Usando o campo 'titulo' do evento */}
            </Text>
            <Text className={`text-sm ${textColor} opacity-80 mt-1`}>
              {item.descricao} {/* Usando o campo 'descricao' do evento */}
            </Text>
            <Text className={`text-sm ${textColor} opacity-80 mt-1`}>
              {item.hora} - {item.horaFim} (Duração)
            </Text>
            <Text className={`text-xs ${textColor} opacity-60 mt-1`}>
              Local: {item.local}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 p-3 bg-[#f0efed] ">
      <View className="w-full flex-row items-center justify-between">
        <Pressable
          className="flex-row px-2 w-[33%] bg-white h-10 mb-2 items-center justify-between rounded-full"
          onPress={() =>
            navigation.navigate("MainTabs", { screen: "Oportunidades" })
          }
        >
          <View className="bg-green-500 rounded-full w-8 p-2">
            <Image
              style={{ width: 10, height: 16 }}
              source={require("../../assets/icons/icon_voltar.png")}
            />
          </View>
          <Text className="mr-2" style={{ fontFamily: "Poppins_500Medium" }}>
            Voltar
          </Text>
        </Pressable>
        <Pressable
          className="flex-row bg-green-50 w-[33%] h-10 mb-2 items-center justify-between p-2 rounded-[12px]"
          onPress={() => setModalMeusEventos(true)}
        >
          <View className="flex-row items-center justify-center w-[80%] ">
            <Text
              className="text-green-600 text-sm"
              style={{ fontFamily: "Poppins_500Medium" }}
            >
              Eventos{" "}
            </Text>
            <Text
              className="text-green-600"
              style={{ fontFamily: "Poppins_500Medium" }}
            >
              {" "}
              {agenda.length}{" "}
            </Text>
          </View>
          <Image
            style={{ width: 10, height: 16 }}
            source={require("../../assets/icons/icon_proximo.png")}
          />
        </Pressable>
      </View>

      <View className="p-1 bg-white rounded-[12px]">
        <Calendar
          markedDates={getMarkedDates()}
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
            setEventoSelecionado(null);
            abrirBottomSheet();
          }}
          firstDay={1}
          theme={{
            todayTextColor: "#16a34a",
            selectedDayBackgroundColor: "#16a34a",
            selectedDayTextColor: "#fff",
            dotColor: "#22c55e",
            textDayHeaderFontSize: 13,
            textMonthFontSize: 17,
            arrowColor: "#72bd4d",
          }}
        />
      </View>

      <Modal visible={modalMeusEventos} animationType="slide">
        <View className="flex-1 bg-gray-50 pt-3 px-5">
          <View className="   mb-6">
            <Pressable
              className="bg-green-500 rounded-full mb-8 w-8 p-2"
              onPress={() => setModalMeusEventos(false)}
            >
              <Image
                style={{ width: 10, height: 16 }}
                source={require("../../assets/icons/icon_voltar.png")}
              />
            </Pressable>
            <Text
              className="text-2xl font-semibold text-gray-800"
              style={{ fontFamily: "Poppins_500Medium" }}
            >
              Agenda de Eventos
            </Text>
          </View>

          <View className="flex-1">
            {/*TIRAR ESSE BTN DEPOIS */}
            <TouchableOpacity
              className="bg-[#61D483] p-4 rounded-xl items-center mb-6"
              onPress={() => setModalConvitesVisible(true)}
            >
              <Text className="text-white font-semibold text-lg">
                Ver Convites Pendentes ({convites.length})
              </Text>
            </TouchableOpacity>

            <Text className="text-xl font-bold mb-4 text-gray-800">
              Próximas Peneiras
            </Text>

            {agenda.length === 0 ? (
              <Text className="opacity-50 mt-4">
                Nenhuma peneira marcada...
              </Text>
            ) : (
              <FlatList
                data={agenda}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item, index }) => {
                  const isLast = index === agenda.length - 1;

                  const previousItem = agenda[index - 1];
                  const isNewDay =
                    !previousItem || previousItem.data !== item.data;

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

      <Modal visible={modalDayVisible} animationType="slide">
        <View className="flex-1 bg-white p-5">
          {eventoSelecionado ? (
            <>
              <Text className="text-2xl font-bold mb-3">
                {eventoSelecionado.titulo}
              </Text>
              <Text className="mb-2">
                {eventoSelecionado.descricaoCompleta}
              </Text>
              <Text className="font-semibold">
                Data: {eventoSelecionado.data}
              </Text>
              <Text className="font-semibold mb-2">
                Horário: {eventoSelecionado.hora} - {eventoSelecionado.horaFim}
              </Text>
              <Text>Local: {eventoSelecionado.local}</Text>
              <Text>Limite de Participantes: {eventoSelecionado.limite}</Text>
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
        snapPoints={["53%", "90%"]}
        enablePanDownToClose={false}
        backgroundStyle={{ backgroundColor: "#f0efed", borderRadius: 20 }}
        handleIndicatorStyle={{ backgroundColor: "#a8a8a8" }} // cor e altura da barra
      >
        <BottomSheetScrollView
          contentContainerStyle={{ paddingHorizontal: 20, flexGrow: 1 }}
          showsVerticalScrollIndicator={true}
          scrollEventThrottle={16}
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } =
              nativeEvent;

            if (
              layoutMeasurement.height + contentOffset.y >=
              contentSize.height - 10
            ) {
              sheetRef.current?.expand();
            }

            if (contentOffset.y <= 0) {
              sheetRef.current?.collapse();
            }
          }}
        >
          <View className="bg-[#d1d1d1] rounded-[12px] p-4 mb-[16px] flex-row justify-between items-center">
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  fontFamily: "Poppins_500Medium",
                }}
              >
                {(() => {
                  const parts = selectedDate.split("-");
                  const year = parseInt(parts[0]);
                  const monthIndex = parseInt(parts[1]) - 1;
                  const day = parseInt(parts[2]);
                  const date = new Date(year, monthIndex, day);
                  const monthNames = [
                    "Janeiro",
                    "Fevereiro",
                    "Março",
                    "Abril",
                    "Maio",
                    "Junho",
                    "Julho",
                    "Agosto",
                    "Setembro",
                    "outubro",
                    "Novembro",
                    "Dezembro",
                  ];
                  const month = monthNames[date.getMonth()];
                  return `${date.getDate()} de ${month}`;
                })()}
              </Text>
            </View>

            <View>
              <Text
                className="color-[#0d9853] text-[14px]"
                style={{ fontFamily: "Poppins_500Medium" }}
              >
                {eventosDoDia.length} Evento
                {eventosDoDia.length !== 1 ? "s" : ""}
              </Text>
            </View>
          </View>

          {horasDia.map((hora, index) => {
            const evento = eventosDoDia.find((e) => e.hora === hora);

            const primeiro = index === 0;
            const ultimo = index === horasDia.length - 1;

            return (
              <View key={hora} className="flex-row min-h-[80px] relative">
                {!primeiro && (
                  <View className="absolute left-[103px] top-0 w-[2px] h-1/2 bg-green-500 z-20" />
                )}
                {!ultimo && (
                  <View className="absolute left-[103px] bottom-0 w-[2px] h-1/2 bg-green-500 z-20" />
                )}

                {evento ? (
                  <View
                    className="
    absolute  top-1/2 z-30 rounded-full
    -translate-y-[50%] w-[22px] left-[93px] h-[22px] bg-green-500 border-[3px] border-[#ffff]"
                  ></View>
                ) : (
                  <View
                    className="
    absolute  top-1/2 z-30 rounded-full
    -translate-y-[50%] w-[8px] left-[100px] h-[8px] bg-green-500"
                  />
                )}

                {/* CAMPO */}
                <TouchableOpacity
                  onPress={() => evento && setEventoSelecionado(evento)}
                  activeOpacity={0.7}
                  className={` mb-2 h-[90px] w-full rounded-xl border flex-row justify-around items-center ${
                    evento
                      ? "bg-green-400  border-green-400"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <View className="w-[20%]">
                    {evento ? (
                      <Text
                        className="text-white text-lg"
                        style={{ fontFamily: "Poppins_400Regular" }}
                      >
                        {hora}
                      </Text>
                    ) : (
                      <Text
                        className="text-gray-800 text-lg"
                        style={{ fontFamily: "Poppins_400Regular" }}
                      >
                        {hora}
                      </Text>
                    )}
                  </View>

                  <View className="w-[50%]">
                    {evento ? (
                      <View>
                        <Text
                          className="text-white text-base"
                          style={{ fontFamily: "Poppins_500Medium" }}
                        >
                          {evento.titulo}
                        </Text>

                        <Text
                          className="text-white text-xs"
                          style={{ fontFamily: "Poppins_400Regular" }}
                        >
                          {evento.local}
                        </Text>
                      </View>
                    ) : (
                      <Text className="text-gray-400 text-xs">Sem evento</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
}
