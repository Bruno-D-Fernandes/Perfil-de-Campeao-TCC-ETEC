import React, { createContext, useContext, useEffect, useState } from "react";
import Pusher from "pusher-js/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EXPO_PUBLIC_PUSHER_KEY, API_URL } from "@env";

import axios from "axios";

const PusherContext = createContext();

export const PusherProvider = ({ children }) => {
  const [pusher, setPusher] = useState(null);

  useEffect(() => {
    const initPusher = async () => {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");

      if (token && userJson) {
        const user = JSON.parse(userJson);
        const PUSHER_KEY = EXPO_PUBLIC_PUSHER_KEY;
        const API_url = API_URL;

        const pusherInstance = new Pusher(PUSHER_KEY, {
          cluster: "sa1",
          forceTLS: true,
          authorizer: (channel, options) => {
            return {
              authorize: async (socketId, callback) => {
                console.log(
                  "Iniciando autorização com uma nova instância Axios..."
                );
                try {
                  const response = await axios.post(
                    `${API_url}/api/broadcasting/auth`,
                    {
                      socket_id: socketId,
                      channel_name: channel.name,
                    },
                    {
                      headers: {
                        Accept: "application/json",
                        Authorization: `${token}`,
                      },
                    }
                  );

                  console.log(
                    "Autorização via nova instância Axios bem-sucedida."
                  );
                  callback(null, response.data);
                } catch (error) {
                  if (error.response) {
                    console.error(
                      `Falha na autorização. Status: ${error.response.status}.`,
                      error.response.data
                    );
                    callback(
                      new Error(`Erro do servidor: ${error.response.status}`),
                      null
                    );
                  } else if (error.request) {
                    console.error("Erro de rede:", error.request);
                    callback(
                      new Error("Erro de rede ao tentar autorizar."),
                      null
                    );
                  } else {
                    console.error(
                      "Erro crítico na configuração do Axios:",
                      error.message
                    );
                    callback(error, null);
                  }
                }
              },
            };
          },
        });

        console.log("Conexão Pusher estabelecida globalmente.");
        setPusher(pusherInstance);

        const channelName = `private-chat.${user.id}`;
        console.log(`Contexto: Inscrevendo-se no canal global: ${channelName}`);
        const channel = pusherInstance.subscribe(channelName);

        channel.bind("pusher:subscription_succeeded", () => {
          console.log(
            `Contexto: Inscrição no canal ${channelName} foi um SUCESSO!`
          );
        });

        channel.bind("pusher:subscription_error", (error) => {
          console.error(
            `Contexto: pusher:subscription_error recebido. Erro:`,
            JSON.stringify(error, null, 2)
          );
        });

        channel.bind("new-message", (data) => {
          console.log("Mensagem recebida globalmente no contexto!", data);
        });

        const notificationChannelName = `notifications.user.${user.id}`;
        console.log(
          `Contexto: Inscrevendo-se no canal de notificações: ${notificationChannelName}`
        );
        const notificationChannel = pusherInstance.subscribe(
          notificationChannelName
        );

        notificationChannel.bind("pusher:subscription_succeeded", () => {
          console.log(
            `Contexto: Inscrição no canal ${notificationChannelName} foi um SUCESSO!`
          );
        });

        notificationChannel.bind("pusher:subscription_error", (error) => {
          console.error(
            `Contexto: pusher:subscription_error no canal de notificações. Erro:`,
            JSON.stringify(error, null, 2)
          );
        });

        notificationChannel.bind("NewNotification", (data) => {
          console.log("Nova notificação recebida!", data);
        });
      }
    };

    initPusher();

    return () => {
      if (pusher) {
        console.log("Desconectando do Pusher globalmente.");
        pusher.disconnect();
      }
    };
  }, []);

  return (
    <PusherContext.Provider value={pusher}>{children}</PusherContext.Provider>
  );
};

export const usePusher = () => {
  return useContext(PusherContext);
};
