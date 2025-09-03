import { View, Text, ActivityIndicator, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import usuario from './../../services/usuario';

export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const response = await usuario.splashUser();
      setUserData(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados do usuário');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);


  return (
    <ScrollView className="flex-1 bg-red-400">
      {/* Header com foto e nome */}
      <View className="items-center py-8 bg-white">
        <View className="w-24 h-24 rounded-full bg-gray-200 justify-center items-center mb-4 border-4 border-blue-100">
          {userData?.foto ? (
            <Image 
              source={{ uri: userData.foto }} 
              className="w-20 h-20 rounded-full"
            />
          ) : (
            <Text className="text-blue-600 text-2xl font-bold">
              {userData?.name?.charAt(0) || userData?.nome?.charAt(0) || 'U'}
            </Text>
          )}
        </View>
        
        <Text className="text-2xl font-bold text-gray-800 text-center">
          {userData?.name || userData?.nome || 'Usuário'}
        </Text>
        
        <Text className="text-gray-500 text-base mt-1">
          {userData?.email}
        </Text>
      </View>

      {/* Informações em cards */}
      <View className="px-10 pb-15 bg-gray-200 flex-1">
        {/* Card de Informações Pessoais */}
        <View className="bg-gray-50 rounded-2xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4 ">
            Informações Pessoais
          </Text>

          <View className="space-y-4">
            {userData?.telefone && (
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600 text-sm">Telefone</Text>
                <Text className="text-gray-800 font-medium">{userData.telefone}</Text>
              </View>
            )}

            {(userData?.data_nascimento || userData?.dataNascimento) && (
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600 text-sm">Data de Nascimento</Text>
                <Text className="text-gray-800 font-medium">
                  {userData.data_nascimento || userData.dataNascimento}
                </Text>
              </View>
            )}

            {userData?.idade && (
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600 text-sm">Idade</Text>
                <Text className="text-gray-800 font-medium">{userData.idade} anos</Text>
              </View>
            )}
          </View>
        </View>

        {/* Card de Dados Físicos */}
        <View className="bg-gray-50 rounded-2xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Dados Físicos
          </Text>

          <View className="space-y-4">
            {userData?.altura && (
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600 text-sm">Altura</Text>
                <Text className="text-gray-800 font-medium">{userData.altura}</Text>
              </View>
            )}

            {userData?.peso && (
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600 text-sm">Peso</Text>
                <Text className="text-gray-800 font-medium">{userData.peso}</Text>
              </View>
            )}

            {userData?.imc && (
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600 text-sm">IMC</Text>
                <Text className="text-gray-800 font-medium">{userData.imc}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Card de Endereço */}
        {(userData?.endereco || userData?.cidade || userData?.estado) && (
          <View className="bg-gray-50 rounded-2xl p-6 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Localização
            </Text>

            <View className="space-y-4">
              {userData?.endereco && (
                <View>
                  <Text className="text-gray-600 text-sm mb-1">Endereço</Text>
                  <Text className="text-gray-800 font-medium">{userData.endereco}</Text>
                </View>
              )}

              {(userData?.cidade || userData?.estado) && (
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-600 text-sm">Cidade/Estado</Text>
                  <Text className="text-gray-800 font-medium">
                    {userData.cidade && userData.estado 
                      ? `${userData.cidade}/${userData.estado}`
                      : userData.cidade || userData.estado
                    }
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Card de Estatísticas (opcional) */}
        <View className="bg-blue-50 rounded-2xl p-6 shadow-sm">
          <Text className="text-lg font-semibold text-blue-800 mb-4">
            Estatísticas
          </Text>

          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">12</Text>
              <Text className="text-blue-500 text-xs mt-1">Projetos</Text>
            </View>
            
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">24</Text>
              <Text className="text-green-500 text-xs mt-1">Concluídos</Text>
            </View>
            
            <View className="items-center">
              <Text className="text-2xl font-bold text-orange-600">98%</Text>
              <Text className="text-orange-500 text-xs mt-1">Rating</Text>
            </View>
          </View>
        </View>
      </View>

    </ScrollView>
  );
}