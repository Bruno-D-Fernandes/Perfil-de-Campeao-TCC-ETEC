import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  Switch,
  Modal,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import usuario from "../services/usuario";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const ConfiguracaoItem = ({
  icon,
  text,
  actionText,
  actionType = "text",
  color = "#4ADC76",
  onPress,
}) => {
  return (
    <Pressable
      className="flex-row items-center justify-between bg-white p-3 rounded-lg mb-3"
      onPress={onPress}
    >
      <View className="flex-row items-center space-x-3">
        {icon}
        <Text style={{ color }} className="font-bold">
          {text}
        </Text>
      </View>
      <View>
        {actionType === "text" && actionText && (
          <Text style={{ color }} className="font-bold">
            {actionText}
          </Text>
        )}
        {actionType === "switch" && (
          <Switch
            trackColor={{ false: "#767577", true: "#61D483" }}
            thumbColor={"#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            value={false}
          />
        )}
        {actionType === "chevron" && (
          <View className="flex-row items-center space-x-1">
            <Text style={{ color }} className="font-bold">
              {actionText}
            </Text>
            <MaterialIcons name="chevron-right" size={24} color="#4ADC76" />
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default function ConfigScreen() {
  const navigation = useNavigation();

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [privModalVisible, setPrivModalVisible] = useState(false);
  const [termosModalVisible, setTermosModalVisible] = useState(false);
  const [sobreModalVisible, setSobreModalVisible] = useState(false);



  const handleLogout = async () => {
    try {
      await usuario.logoutUser();
      await AsyncStorage.clear();
      setLogoutModalVisible(false);
      navigation.navigate("Splash");
    } catch (e) {
      console.error("Erro ao sair:", e);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const userJSON = await AsyncStorage.getItem("user");

      if (!userJSON) {
        console.error("Tentativa de exclusão sem usuário logado.");
        navigation.navigate("Splash");
        return;
      }

      const user = JSON.parse(userJSON);
      const id = user.id;

      await usuario.deleteUser(id);

      await AsyncStorage.clear();
      setDeleteModalVisible(false);
      navigation.navigate("Splash");
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4 bg-[#ffff]">

      <View className="flex-row items-center justify-center mb-4 mt-3">
         <Pressable className="flex-row bg-[#61D483] w-10 absolute left-1   h-10 rounded-full items-center justify-center p-2 " onPress={() =>  navigation.navigate("MainTabs", { screen: "Oportunidades" })}>
                  <Image source={require("../../assets/cadastro/icon_voltar.png")} style={{width:11, height:18, marginRight:5,}}/>
              </Pressable>
        <Text style={{ fontSize: 20, fontFamily: "Poppins_500Medium", color:'#61D483',}}>
          Configuração
        </Text>
      </View>

      {/* Seção de Conta */}
      <View className="mb-4">
        <Text className="text-[#61D483] text-lg font-semibold mb-2 ml-2">
          Conta
        </Text>
        <View className="bg-[#E6F9EC] p-4 rounded-xl">
          <ConfiguracaoItem
            icon={<MaterialIcons name="email" size={24} color="#4ADC76" />}
            text="Email"
            actionText="Alterar"
          />
          <ConfiguracaoItem
            icon={<MaterialIcons name="lock" size={24} color="#4ADC76" />}
            text="Senha"
            actionText="Alterar"
          />
          <ConfiguracaoItem
            icon={<MaterialIcons name="logout" size={24} color="#D46161" />}
            text="Sair"
            color="#D46161"
            onPress={() => setLogoutModalVisible(true)}
          />
          <ConfiguracaoItem
            icon={<AntDesign name="delete" size={24} color="#D46161" />}
            text="Excluir conta"
            color="#D46161"
            onPress={() => setDeleteModalVisible(true)}
          />
        </View>
      </View>
      
      <View className="mb-4">
        <Text className="text-[#61D483] text-lg font-semibold mb-2 ml-2">
          Sobre
        </Text>
        <View className="bg-[#E6F9EC] p-4 rounded-xl">
          <ConfiguracaoItem
            icon={<MaterialIcons name="privacy-tip" size={24} color="#4ADC76" />}
            text="Privacidade"
            actionType="chevron"
            actionText=""
            onPress={() => setPrivModalVisible(true)}
          />

          <ConfiguracaoItem
            icon={<MaterialIcons name="description" size={24} color="#4ADC76" />}
            text="Termos e Condições"
            actionType="chevron"
            actionText=""
            onPress={() => setTermosModalVisible(true)}
          />

          <ConfiguracaoItem
            icon={<AntDesign name="info-circle" size={24} color="#4ADC76" />}
            text="Saiba Mais"
            actionType="chevron"
            actionText=""
            onPress={() => setSobreModalVisible(true)}
          />
        </View>


      </View>

      <Modal
  visible={sobreModalVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setSobreModalVisible(false)}
>
   <View className="flex-1 justify-center items-center bg-black/40">
    <View className="bg-white p-6 rounded-3xl w-full max-w-[340px] ">

      <Text className="text-xl font-semibold mb-3 text-center text-[#61D483]">
        Sobre o Aplicativo
      </Text>

      <Text className="text-sm text-gray-700 mb-4 text-center">
        Este aplicativo foi criado com a proposta de funcionar como uma 
        <Text className="font-bold"> plataforma de conexão esportiva</Text>, conectando atletas, 
        treinadores, equipes e oportunidades reais dentro do mundo esportivo.
        {"\n\n"}
        Nosso objetivo é facilitar a descoberta de talentos, ampliar a visibilidade 
        de atletas e abrir portas para novas oportunidades profissionais.
        {"\n\n"}
        Criado com dedicação e inovação pela empresa 
        <Text className="font-bold"> Norven</Text>, que acredita no poder do esporte 
        para transformar vidas.
      </Text>

      <TouchableOpacity
        onPress={() => setSobreModalVisible(false)}
        className="px-5 py-2 bg-[#61D483] rounded-lg mx-auto"
      >
        <Text className="text-white font-semibold">Fechar</Text>
      </TouchableOpacity>

    </View>
  </View>
</Modal>


      {/* Modal de Privacidade */}
{/* Modal de Política de Privacidade */}
<Modal
  visible={privModalVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setPrivModalVisible(false)}
>
  <View className="flex-1 justify-center items-center bg-black/40">
    <View className="bg-white p-6 rounded-3xl w-80 max-h-[80%]">

      {/* Título */}
      <Text className="text-lg font-semibold mb-3 text-center text-[#61D483]">
        Política de Privacidade
      </Text>

      {/* Scroll interno */}
      <ScrollView className="mb-4">

        <Text className="text-sm text-gray-700 leading-5">

A presente Política de Privacidade estabelece como o Perfil de Campeão,
desenvolvido pela Norven, coleta, utiliza, armazena, compartilha e protege
os dados pessoais dos usuários de sua plataforma mobile e web. O uso do
sistema implica plena concordância com as práticas aqui descritas.{"\n\n"}


1. Coleta de Informações{"\n\n"}

Coletamos diferentes tipos de dados para garantir o funcionamento adequado
da plataforma.{"\n\n"}

1.1 Dados fornecidos pelo usuário:{"\n"}
• Nome completo{"\n"}
• E-mail{"\n"}
• Senha (criptografada){"\n"}
• Data de nascimento{"\n"}
• Foto de perfil{"\n"}
• Informações esportivas (modalidade, posição, estatísticas, histórico){"\n"}
• Dados de clubes (razão social, CNPJ, localização, contatos){"\n\n"}

1.2 Dados coletados automaticamente:{"\n"}
• Endereço IP{"\n"}
• Informações de dispositivo e sistema operacional{"\n"}
• Cookies e identificadores únicos{"\n"}
• Dados de navegação dentro do app e site{"\n"}
• Registros de acesso{"\n\n"}

1.3 Conteúdos enviados pelo usuário:{"\n"}
Postagens, vídeos, fotos, mensagens e demais informações publicadas no perfil.{"\n\n"}


2. Uso das Informações{"\n\n"}

As informações coletadas são utilizadas para:{"\n"}
• Criar e gerenciar contas de usuários (atletas e clubes){"\n"}
• Permitir buscas e conexões entre atletas e clubes{"\n"}
• Exibir o perfil esportivo ao público permitido{"\n"}
• Melhorar a experiência de uso e personalizar funcionalidades{"\n"}
• Garantir segurança, monitoramento e prevenção de fraudes{"\n"}
• Cumprir obrigações legais e regulatórias{"\n"}
• Realizar análises internas de desempenho e usabilidade{"\n\n"}


3. Compartilhamento de Informações{"\n\n"}

Os dados dos usuários não são vendidos. O compartilhamento pode ocorrer:{"\n"}
• Com clubes registrados, quando o atleta escolhe tornar seu perfil público{"\n"}
• Com serviços de hospedagem e infraestrutura{"\n"}
• Com autoridades, mediante obrigação legal{"\n"}
• Em prevenção de fraudes ou riscos à segurança{"\n\n"}

Apenas o mínimo necessário de dados é compartilhado.{"\n\n"}


4. Armazenamento e Proteção dos Dados{"\n\n"}

Utilizamos medidas técnicas e administrativas para proteger os dados:{"\n"}
• Criptografia de senhas{"\n"}
• Servidores seguros{"\n"}
• Comunicação criptografada (HTTPS){"\n"}
• Controles de acesso{"\n"}
• Monitoramento e auditorias internas{"\n\n"}

Os dados são mantidos pelo tempo necessário às finalidades propostas
ou conforme exigência legal.{"\n\n"}


5. Direitos do Usuário (LGPD){"\n\n"}

O usuário pode:{"\n"}
• Confirmar tratamento de dados{"\n"}
• Solicitar acesso, correção ou atualização{"\n"}
• Solicitar exclusão de dados ou da conta{"\n"}
• Solicitar portabilidade{"\n"}
• Solicitar anonimização{"\n"}
• Revogar consentimento{"\n"}
• Ver compartilhamentos realizados{"\n\n"}

Solicitações podem ser feitas pelo suporte do Perfil de Campeão.{"\n\n"}


6. Exclusão da Conta e Dados{"\n\n"}

Ao solicitar exclusão:{"\n"}
• Dados pessoais são removidos{"\n"}
• Conteúdos podem ser anonimizados{"\n"}
• Dados podem ser retidos por exigência legal{"\n\n"}


7. Uso por Menores de Idade{"\n\n"}

• Menores de 13 anos: autorização obrigatória{"\n"}
• Entre 13 e 18: recomendada supervisão{"\n\n"}


8. Cookies e Tecnologias de Rastreamento{"\n\n"}

Utilizamos cookies para:{"\n"}
• Lembrar preferências{"\n"}
• Garantir funcionalidades essenciais{"\n"}
• Análises de desempenho{"\n"}
• Melhoria de usabilidade{"\n\n"}

O usuário pode desativar cookies no navegador,
mas algumas funções podem ser afetadas.{"\n\n"}


9. Alterações na Política{"\n\n"}

A política pode ser atualizada quando necessário.
Alterações importantes serão comunicadas.{"\n\n"}


10. Contato{"\n\n"}

Para dúvidas ou solicitações:{"\n"}
E-mail: norven.suporte@empresa.com{"\n\n"}


Ao utilizar o Perfil de Campeão,
o usuário concorda com esta Política de Privacidade.

        </Text>
      </ScrollView>

      {/* Botão Fechar */}
      <TouchableOpacity
        onPress={() => setPrivModalVisible(false)}
        className="bg-[#61D483] py-2 rounded-xl"
      >
        <Text className="text-center text-white font-bold">Fechar</Text>
      </TouchableOpacity>

    </View>
  </View>
</Modal>

{/* Modal de Termos */}
{/* Modal de Termos e Condições */}
<Modal
  visible={termosModalVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setTermosModalVisible(false)}
>
  <View className="flex-1 justify-center items-center bg-black/40">
    <View className="bg-white p-6 rounded-3xl w-80 max-h-[80%]">

      {/* Título */}
      <Text className="text-lg font-semibold mb-3 text-center text-[#61D483]">
        Termos e Condições de Uso
      </Text>

      {/* Scroll interno */}
      <ScrollView className="mb-4">
        <Text className="text-sm text-gray-700 leading-5">


Os presentes Termos e Condições regulam o uso da plataforma Perfil de Campeão,
disponibilizada nas versões mobile e web pela Norven. Ao acessar ou utilizar
o sistema, o usuário declara ter lido, compreendido e concordado com todas
as regras aqui estabelecidas.{"\n\n"}


1. Aceitação dos Termos{"\n\n"}

O uso da plataforma implica concordância integral com estes Termos.
Caso o usuário não concorde com alguma cláusula, deverá interromper o uso
imediatamente.{"\n\n"}


2. Objetivo da Plataforma{"\n\n"}

O Perfil de Campeão tem como finalidade conectar jovens atletas a clubes,
permitindo a criação de perfis esportivos, publicação de conteúdos e
interação entre usuários.{"\n\n"}

A plataforma não garante contratação, testes ou convites esportivos,
apenas facilita a visibilidade e conexão.{"\n\n"}


3. Cadastro e Conta do Usuário{"\n\n"}

Para utilizar o sistema, o usuário deve fornecer informações verdadeiras
e atualizadas. É proibido criar perfis falsos, duplicados ou usar dados
de terceiros sem autorização.{"\n\n"}

Responsabilidades do usuário:{"\n"}
• Manter a confidencialidade da senha{"\n"}
• Não compartilhar acesso{"\n"}
• Informar uso indevido da conta{"\n\n"}

O Perfil de Campeão pode suspender ou excluir contas que violem estes Termos.{"\n\n"}


4. Conteúdo Publicado pelo Usuário{"\n\n"}

O usuário é totalmente responsável pelos conteúdos enviados.{"\n\n"}

É proibido publicar:{"\n"}
• Conteúdo ofensivo, discriminatório ou ilegal{"\n"}
• Informações falsas{"\n"}
• Material com direitos autorais sem permissão{"\n"}
• Conteúdo violento ou impróprio{"\n\n"}

A plataforma pode remover conteúdos que violem estes Termos.{"\n\n"}


5. Regras de Uso da Plataforma{"\n\n"}

O usuário concorda em NÃO:{"\n"}
• Utilizar o sistema para fins ilegais{"\n"}
• Tentar violar a segurança{"\n"}
• Copiar ou modificar partes da plataforma{"\n"}
• Usar bots ou automações{"\n"}
• Assediar ou ameaçar usuários{"\n"}
• Realizar práticas comerciais não autorizadas{"\n\n"}


6. Conexão Entre Atletas e Clubes{"\n\n"}

A plataforma permite busca e interação. O uso das informações encontradas
deve respeitar:{"\n"}
• A privacidade{"\n"}
• A legislação vigente{"\n"}
• O propósito esportivo da plataforma{"\n\n"}

Conversas ou negociações são responsabilidade exclusiva dos usuários.{"\n\n"}


7. Limitação de Responsabilidade{"\n\n"}

A Norven não se responsabiliza por:{"\n"}
• Conteúdo publicado pelos usuários{"\n"}
• Falhas de conexão ou indisponibilidade{"\n"}
• Atos de atletas, clubes ou terceiros{"\n"}
• Expectativas de contratação ou resultados esportivos{"\n\n"}

O sistema é oferecido “como está”, sem garantias de resultados.{"\n\n"}


8. Suspensão e Exclusão da Conta{"\n\n"}

Contas podem ser suspensas ou excluídas por:{"\n"}
• violação dos Termos{"\n"}
• uso de dados falsos{"\n"}
• condutas suspeitas ou ilegais{"\n"}
• danos ao sistema ou usuários{"\n\n"}

O usuário também pode excluir a própria conta.{"\n\n"}


9. Propriedade Intelectual{"\n\n"}

Todo design, código, nome, marca e funcionalidades do Perfil de Campeão
são propriedade da Norven.{"\n\n"}

É proibido copiar, modificar ou distribuir qualquer parte da plataforma
sem autorização.{"\n\n"}


10. Atualizações e Mudanças nos Termos{"\n\n"}

Os Termos podem ser atualizados. Alterações importantes serão comunicadas.{"\n\n"}

O uso contínuo após mudanças implica concordância.{"\n\n"}


11. Legislação Aplicável{"\n\n"}

Documento regido pelas leis brasileiras:{"\n"}
• Código Civil{"\n"}
• Marco Civil da Internet{"\n"}
• LGPD{"\n\n"}

Conflitos serão resolvidos no foro de São Paulo – SP.{"\n\n"}


12. Contato{"\n\n"}

Para dúvidas sobre os Termos:{"\n"}
E-mail: norven.suporte@empresa.com{"\n\n"}


Ao utilizar o Perfil de Campeão, o usuário declara concordar integralmente
com estes Termos e Condições de Uso.

        </Text>
      </ScrollView>

      {/* Botão Fechar */}
      <TouchableOpacity
        onPress={() => setTermosModalVisible(false)}
        className="bg-[#61D483] py-2 rounded-xl"
      >
        <Text className="text-center text-white font-bold">Fechar</Text>
      </TouchableOpacity>

    </View>
  </View>
</Modal>




      {/* Modal de Logout */}
      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
    <View className="flex-1 justify-center items-center bg-black/40">
          <View className="bg-white p-6 rounded-3xl w-80 ">
            <Text className="text-lg font-semibold mb-4 text-center ">
              Deseja mesmo sair?
            </Text>
            <View className="flex-row justify-evenly">
              <TouchableOpacity
                onPress={() => setLogoutModalVisible(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogout}
                className="px-4 py-2 bg-[#D46161] rounded"
              >
                <Text className="text-white">Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Exclusão de Conta */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center">
          <View className="bg-white p-6 rounded-3xl border-[4px] border-[#61D483] w-80">
            <Text className="text-lg font-semibold mb-4 text-center text-red-600">
              Tem certeza que deseja excluir sua conta?
            </Text>
            <Text className="text-sm text-center mb-4">
              Essa ação não pode ser desfeita.
            </Text>
            <View className="flex-row justify-evenly">
              <TouchableOpacity
                onPress={() => setDeleteModalVisible(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeleteAccount}
                className="px-4 py-2 bg-[#D46161] rounded"
              >
                <Text className="text-white">Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
