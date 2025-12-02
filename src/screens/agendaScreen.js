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
    horarioCompleto: `${horaInicio} - ${horaFim}`,
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
  const [linhas, setLinhas] = useState([]);


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

function gerarLinhasDoDia(eventos) {
  const linhas = new Set();

  // adiciona apenas horas inteiras do dia (00:00, 01:00, 02:00... 23:00)
  for (let h = 0; h < 24; h++) {
    linhas.add(String(h).padStart(2, "0") + ":00");
  }

  // Se houver eventos, adiciona as horas que os eventos ocupam
  eventos.forEach((e) => {
    if (!e.data_hora_inicio || !e.data_hora_fim) return;

    const inicio = new Date(e.data_hora_inicio);
    const fim = new Date(e.data_hora_fim);

    // Adiciona horário QUEBRADO de início (com minutos se existirem)
    const horarioInicio = String(inicio.getHours()).padStart(2, "0") + ":" + String(inicio.getMinutes()).padStart(2, "0");
    if (inicio.getMinutes() !== 0) {
      linhas.add(horarioInicio);
    } else {
      linhas.add(String(inicio.getHours()).padStart(2, "0") + ":00");
    }

    // Adiciona todas as horas inteiras ENTRE início e fim
    let hora = new Date(inicio);
    hora.setMinutes(0, 0, 0);
    hora.setHours(hora.getHours() + 1); // Começa da próxima hora inteira

    while (hora.getTime() < fim.getTime()) {
      const hStr = String(hora.getHours()).padStart(2, "0") + ":00";
      linhas.add(hStr);
      hora.setHours(hora.getHours() + 1);
    }

    // Adiciona horário QUEBRADO de fim (com minutos se existirem)
    const horarioFim = String(fim.getHours()).padStart(2, "0") + ":" + String(fim.getMinutes()).padStart(2, "0");
    if (fim.getMinutes() !== 0) {
      linhas.add(horarioFim);
    } else {
      linhas.add(String(fim.getHours()).padStart(2, "0") + ":00");
    }
  });

  // transforma em array e ordena numericamente
  return Array.from(linhas).sort((a, b) => {
    const [ah] = a.split(":").map(Number);
    const [bh] = b.split(":").map(Number);
    return ah - bh;
  });
}



useEffect(() => {
  // recalcula linhas sempre que eventosDoDia mudar
  setLinhas(gerarLinhasDoDia(eventosDoDia));
}, [/* eventosDoDia depende de agenda + selectedDate, então observe ambos */ selectedDate, agenda]);




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

// eventos que ocorrem — total ou parcialmente — no selectedDate
// eventos que ocorrem — total ou parcialmente — no selectedDate
const eventosDoDia = agenda.filter((e) => {
  if (!e.data_hora_inicio) return false;

  // Converte somente a data (AAAA-MM-DD) — sem hora
  const dataEvento = e.data_hora_inicio.split("T")[0];

  return dataEvento === selectedDate;
});



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

      <Modal 
  visible={modalDayVisible} 
  animationType="fade"
  transparent={true} 
>
  <View className="flex-1 justify-center items-center bg-black/50 p-4">
    <View className="w-full max-w-lg bg-white rounded-lg shadow-2xl p-6">
      
      <View className="flex-row justify-between items-center pb-3 border-b border-gray-200 mb-4">
        <View className="flex-row items-center">
          <Text className="text-xl font-bold">Detalhes do Evento</Text>
        </View>
        
        {/* Ícone Fechar (X) */}
        <TouchableOpacity onPress={() => setModalDayVisible(false)}>
          <Text className="text-gray-500 text-xl font-bold">X</Text>
        </TouchableOpacity>
      </View>

      {eventoSelecionado ? (
        <>
          <Text className="text-xl font-bold mb-4">{eventoSelecionado.titulo}</Text>

          <View className="flex-row flex-wrap mb-4">
            
            <View className="w-1/2 mb-3">
              <View className="flex-row items-center mb-1">
                <Image source={require("../../assets/cadastro/icon_tempo.png")} style={{ width: 18, height: 19, marginRight: 8 }} />
                <Text className="text-gray-600 font-semibold">Início</Text>
              </View>
              <Text className="text-base">
                {eventoSelecionado.data} às {eventoSelecionado.hora}
              </Text>
            </View>

            <View className="w-1/2 mb-3">
              <View className="flex-row items-center mb-1">
                <Image source={require("../../assets/cadastro/icon_tempo.png")} style={{ width: 18, height: 19 , marginRight: 8 }} />
                <Text className="text-gray-600 font-semibold">Término</Text>
              </View>
              <Text className="text-base">
                {eventoSelecionado.data} às {eventoSelecionado.horaFim}
              </Text>
            </View>

            <View className="w-1/2 mb-3">
              <View className="flex-row items-center mb-1">
                <Image source={require("../../assets/cadastro/icon_pessoas.png")} style={{ width: 18, height: 18, marginRight: 8, tintColor:'#4adc76', }} />
                <Text className="text-gray-600 font-semibold">Limite de Pessoas</Text>
              </View>
              <Text className="text-base">
                {eventoSelecionado.limite} participantes
              </Text>
            </View>

          </View>
          
          <View className="mb-4">
            <View className="flex-row items-center mb-1">
                <Image source={require("../../assets/cadastro/icon_docs.png")} style={{ width: 18, height: 18, marginRight: 8, tintColor:'#4adc76', }} />
              <Text className="text-gray-600 font-semibold">Descrição</Text>
            </View>
            <Text className="text-base text-gray-700">
              {eventoSelecionado.descricaoCompleta}
            </Text>
          </View>
          
          <View className="mb-6">
            <View className="flex-row items-center mb-1">
                <Image source={require("../../assets/cadastro/icon_local.png")} style={{ width: 16, height: 19, marginRight: 8, tintColor:'#4adc76', }} />
              <Text className="text-gray-600 font-semibold">Localização</Text>
            </View>
            <Text className="text-base text-gray-700">
              {eventoSelecionado.local}
            </Text>
          </View>
          
          <View className="flex-row justify-end">
            <TouchableOpacity
              onPress={() => setModalDayVisible(false)}
              className="px-6 py-2 border border-gray-300 rounded-md bg-white items-center"
            >
              <Text className="text-black font-semibold">Fechar</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text>Nenhum evento encontrado.</Text>
      )}

    </View>
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

{linhas.map((hora, index) => {
  // calcula horaBase (timestamp) para o selectedDate + slot "HH:MM"
  const [hb, mb] = hora.split(":").map(Number);
  const horaBase = new Date(selectedDate + "T00:00:00");
  horaBase.setHours(hb, mb, 0, 0);
  const horaBaseTs = horaBase.getTime();

  // encontra todos os eventos que cobrem esse slot (para marcador/linha)
  const slotEventos = eventosDoDia.filter((e) => {
    if (!e.data_hora_inicio || !e.data_hora_fim) return false;
    const inicioTs = new Date(e.data_hora_inicio).getTime();
    const fimTs = new Date(e.data_hora_fim).getTime();
    return horaBaseTs >= inicioTs && horaBaseTs <= fimTs;
  });

  // Pré-calcula timestamps para cada evento quando necessário

  // Filtra eventos que COMEÇAM NESTA HORA (compara apenas a hora)
  const eventosQueComecam = slotEventos.filter((e) => {
    const inicio = new Date(e.data_hora_inicio);
    return inicio.getHours() === hb && inicio.getMinutes() === 0;
  });

  // Filtra eventos que COMEÇAM NESTE HORÁRIO QUEBRADO (exemplo: 14:30)
  const eventosQueComecamQuebrado = eventosDoDia.filter((e) => {
    if (!e.data_hora_inicio) return false;
    const inicio = new Date(e.data_hora_inicio);
    const inicioFormatado = inicio.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const temMinutos = !inicioFormatado.endsWith(":00");
    return inicioFormatado === hora && temMinutos;
  });

  // Verifica se algum evento TERMINA NESTA HORA (compara apenas a hora)
  // somente considera término inteiro quando os minutos do fim forem 0
  const eventosQueterminam = slotEventos.filter((e) => {
    const fim = new Date(e.data_hora_fim);
    return fim.getHours() === hb && fim.getMinutes() === 0;
  });

  // Filtra eventos que TERMINAM NESTE HORÁRIO QUEBRADO (exemplo: 16:45)
  const eventosQueterminamQuebrado = eventosDoDia.filter((e) => {
    if (!e.data_hora_fim) return false;
    const fim = new Date(e.data_hora_fim);
    const fimFormatado = fim.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const temMinutos = !fimFormatado.endsWith(":00");
    return fimFormatado === hora && temMinutos;
  });

  // Verifica se há eventos que passam por este horário (mas não começam nem terminam)
  // Usa comparações por timestamp estritas (exclui casos onde a hora do slot é exatamente o fim do evento)
  const eventosPassando = eventosDoDia.filter((e) => {
    if (!e.data_hora_inicio || !e.data_hora_fim) return false;
    const inicioTs = new Date(e.data_hora_inicio).getTime();
    const fimTs = new Date(e.data_hora_fim).getTime();
    // em andamento quando o evento começou antes deste slot e termina depois deste slot
    return inicioTs < horaBaseTs && fimTs > horaBaseTs;
  });

  const primeiro = index === 0;
  const ultimo = index === linhas.length - 1;

  const temEventoNeste = eventosQueComecam.length > 0 || eventosPassando.length > 0 || eventosQueterminam.length > 0 || eventosQueterminamQuebrado.length > 0;
  const bgColor = temEventoNeste ? "bg-green-400" : "bg-white";
  const borderColor = temEventoNeste ? "border-green-400" : "border-gray-200";
  const textColor = temEventoNeste ? "text-white" : "text-gray-800";

  return (
    <View key={`${hora}-${index}`} className="flex-row min-h-[80px] relative">
      {!primeiro && (
        <View className="absolute left-[103px] top-0 w-[2px] h-1/2 bg-green-500 z-20" />
      )}
      {!ultimo && (
        <View className="absolute left-[103px] bottom-0 w-[2px] h-1/2 bg-green-500 z-20" />
      )}

      {slotEventos.length > 0 ? (
        <View className="absolute top-1/2 z-30 rounded-full -translate-y-[50%] w-[22px] left-[93px] h-[22px] bg-green-500 border-[3px] border-white" />
      ) : (
        <View className="absolute top-1/2 z-30 rounded-full -translate-y-[50%] w-[8px] left-[100px] h-[8px] bg-green-500" />
      )}

      <View className="mb-2 w-full">
        {eventosQueComecam.length > 0 ? (
          eventosQueComecam.map((evento, evIndex) => (
            <TouchableOpacity
              key={`${evento.id}-${evIndex}-${hora}`}
              onPress={() => { setEventoSelecionado(evento); setModalDayVisible(true); }}
              activeOpacity={0.8}
              
              className={`mb-2 h-[90px] w-full rounded-xl border flex-row justify-around items-center bg-green-400 border-green-400`}>
              <View className="w-[20%] ">
                <Text className="text-white text-lg font-bold" style={{ fontFamily: "Poppins_400Regular" }}>{evento.hora}</Text>
              </View>
              <View className="w-[50%]"><View><Text className="text-white text-base" style={{ fontFamily: "Poppins_500Medium" }}>{evento.titulo}</Text><Text className="text-white text-xs" style={{ fontFamily: "Poppins_400Regular" }}>{evento.local}</Text></View></View>
            </TouchableOpacity>
          ))
        ) : eventosQueComecamQuebrado.length > 0 ? (
          eventosQueComecamQuebrado.map((evento, evIndex) => (
            <View key={`${evento.id}-${evIndex}-${hora}`} className={`mb-2 h-[90px] w-full rounded-xl border flex-row justify-around items-center bg-green-400 border-green-400`}>
              <View className="w-[20%] "><Text className="text-white text-lg font-bold" style={{ fontFamily: "Poppins_400Regular" }}>{hora}</Text></View>
              <View className="w-[50%]"><View><Text className="text-white text-base" style={{ fontFamily: "Poppins_500Medium" }}>{evento.titulo}</Text><Text className="text-white text-xs" style={{ fontFamily: "Poppins_400Regular" }}>{evento.local}</Text></View></View>
            </View>
          ))
        ) : eventosQueterminamQuebrado.length > 0 ? (
          eventosQueterminamQuebrado.map((evento, evIndex) => (
            <View key={`${evento.id}-${evIndex}-${hora}`} className={`mb-2 h-[90px] w-full rounded-xl border flex-row justify-around items-center ${bgColor} ${borderColor}`}>
              <View className="w-[20%] flex-row items-center gap-2"><Text className={`text-lg ${textColor}`} style={{ fontFamily: "Poppins_400Regular" }}>{hora}</Text></View>
              <View className="w-[50%] flex-row items-center gap-2"><Text className={`text-xs ${textColor}`} style={{ fontFamily: "Poppins_400Regular" }}>Término</Text><View className="bg-white px-2 py-1 rounded-full"><Text className="text-green-500 text-xs font-bold">FIM</Text></View></View>
            </View>
          ))
        ) : eventosPassando.length > 0 ? (
          <View className={`mb-2 h-[90px] w-full rounded-xl border flex-row justify-around items-center ${bgColor} ${borderColor}`}>
            <View className="w-[20%]"><Text className={`text-lg ${textColor}`} style={{ fontFamily: "Poppins_400Regular" }}>{hora}</Text></View>
            <View className="w-[50%]"><Text className={`text-xs ${textColor}`} style={{ fontFamily: "Poppins_400Regular" }}>Em andamento</Text></View>
          </View>
        ) : eventosQueterminam.length > 0 ? (
          <View className={`mb-2 h-[90px] w-full rounded-xl border flex-row justify-around items-center ${bgColor} ${borderColor}`}>
            <View className="w-[20%]"><Text className={`text-lg ${textColor}`} style={{ fontFamily: "Poppins_400Regular" }}>{hora}</Text></View>
            <View className="w-[50%] flex-row items-center gap-2"><Text className={`text-xs ${textColor}`} style={{ fontFamily: "Poppins_400Regular" }}>Término</Text><View className="bg-white px-2 py-1 rounded-full"><Text className="text-green-500 text-xs font-bold">FIM</Text></View></View>
          </View>
        ) : (
          <TouchableOpacity activeOpacity={0.7} className="h-[90px] w-full rounded-xl border bg-white border-gray-200 flex-row justify-around items-center">
            <View className="w-[20%]"><Text className="text-gray-800 text-lg" style={{ fontFamily: "Poppins_400Regular" }}>{hora}</Text></View>
            <View className="w-[50%]"><Text className="text-gray-400 text-xs">Sem evento</Text></View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
})}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
}
