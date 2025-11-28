import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Linking,
} from "react-native";
import api from "../services/axios";
import { useRoute } from "@react-navigation/native";
import { API_URL } from "@env";

export default function PerfilClubeScreen() {
  const route = useRoute();
  const { idClube } = route.params;

  const [dataClube, setDataClube] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchClube() {
      try {
        const response = await api.get(`/clube/${idClube}`);
        setDataClube(response.data);
      } catch (err) {
        setError("Erro ao carregar os dados do clube.");
      } finally {
        setLoading(false);
      }
    }

    fetchClube();
  }, [idClube]);

  function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );

  if (!dataClube)
    return (
      <View style={styles.center}>
        <Text>Clube não encontrado.</Text>
      </View>
    );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Banner (se existir) */}
      {dataClube?.fotoBannerClube ? (
        <ImageBackground
          source={{ uri: `${API_URL}/storage/${dataClube.fotoBannerClube}` }}
          style={styles.banner} /* styles.banner */
          resizeMode="cover"
        />
      ) : null}

      <View style={styles.header} /* styles.header */>
        <Image
          source={
            dataClube?.fotoPerfilClube
              ? { uri: `${API_URL}/storage/${dataClube.fotoPerfilClube}` }
              : require("../../assets/perfil/fotoPerfil.png")
          }
          style={styles.avatar} /* styles.avatar */
        />

        <View style={styles.headerInfo} /* styles.headerInfo */>
          <Text style={[styles.nome, { fontFamily: "Poppins_500Medium" }]}>
            {dataClube?.nomeClube}
          </Text>
          <Text style={styles.cidade}>
            {dataClube?.cidadeClube} - {dataClube?.estadoClube}
          </Text>
        </View>
      </View>

      <View style={styles.card} /* styles.card */>
        <Text style={styles.label} /* styles.label */>Fundação</Text>
        <Text>{formatDate(dataClube?.anoCriacaoClube)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Categoria</Text>
        <Text>{dataClube?.categoria?.nomeCategoria ?? "-"}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Esporte</Text>
        <Text>{dataClube?.esporte?.nomeEsporte ?? "-"}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Contato</Text>
        <Pressable
          onPress={() => Linking.openURL(`mailto:${dataClube?.emailClube}`)}
        >
          <Text style={styles.link}>{dataClube?.emailClube ?? "-"}</Text>
        </Pressable>
        <Text>{dataClube?.enderecoClube ?? "-"}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Sobre</Text>
        <Text>{dataClube?.bioClube ?? "-"}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  banner: { width: "100%", height: 140, borderRadius: 8, marginBottom: 12 }, // usado no ImageBackground
  header: { flexDirection: "row", alignItems: "center", marginBottom: 12 }, // usado no View do header
  avatar: { width: 70, height: 70, borderRadius: 35, marginRight: 12 }, // usado na Image do perfil
  headerInfo: { flex: 1 }, // usado na View com nome e cidade
  nome: { fontSize: 18, fontWeight: "600" }, // usado no Text do nome
  cidade: { color: "#666" },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  }, // usado nos blocos de info
  label: { fontSize: 12, color: "#888", marginBottom: 4 }, // usado nos labels
  link: { color: "#0066cc" }, // usado no email Pressable
});
