import { Image, Text } from "react-native";
import { s } from "./Header.style";
export function Header(){
return (
<>
<Image  style={s.img} source={require('../assets/logo.png')} resizeMode="contain"/>
<Text style={s.substitle}>tu as probablement un truc à faire</Text>

</>
);
}