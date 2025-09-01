import { Text, View, Pressable } from "react-native";

export default function Configuracao({
    titulo = "",
    notificacao = "",
    tema ="",
    email = "",
    senha ="",
    autentifica ="",
    sair ="",
    excluir ="",
    politicas ="",
    termos ="",
    saiba =""

}){
    return(
        <View classname="flex-1 items-baseline">
            <View classname="justify-items-center ">
                <Text classname="">Configurações</Text>
            </View>
        <Text classname="font-bold">Preferências</Text>

        <View classname="flex-1">
            <View>
                 <Pressable>
                    <Text>
                     Notificações
                     </Text>
                </Pressable>
        </View>
        <View>
            <Pressable>
                <Text>
                Tema
                </Text>
            </Pressable>
        </View>

        </View>

        <Text>Conta</Text>
        <View classname="flex-1">
            <View>
                <Pressable>
                    <Text>
                    Email
                    </Text>
                </Pressable>
            </View>
            <View>
                <Pressable>
                    <Text>
                    Senha
                    </Text>
                </Pressable>
</View>
<View>
                <Pressable>
                    <Text>
                    Autentificação de 2 fatores
                    </Text>
                </Pressable>
            </View>
      <View>      
                <Pressable>
                    <Text>
                    Sair
                    </Text>
                </Pressable>
           </View>
     <View>
                <Pressable>
                 <Text>
                    Excluir conta
                    </Text>
                </Pressable>
         </View>
        </View>
        <Text>Sobre</Text>
        <View classname="flex-1">
         <View>
                <Pressable>
                  <Text>
                    Políticas de privacidade
                    </Text>
                </Pressable>
           </View>
            <View>
                <Pressable>
                    <Text>
                    Termos e condições 
                    </Text>
                </Pressable>
           </View>
            <View>
                <Pressable>
                <Text>
                    Saiba mais
                    </Text>
                </Pressable>
            </View>
        </View>
        </View>
    );
}
