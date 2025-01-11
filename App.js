import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigation from "./Components/Navigations/StackNavigation";

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigation></StackNavigation>
    </NavigationContainer>
  );
}
