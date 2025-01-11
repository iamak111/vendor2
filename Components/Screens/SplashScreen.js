import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import AnimatedSplash from "react-native-animated-splash-screen";
import OnBoardScreen from "./OnBoardScreen";
import LoginScreen from "./LoginScreen";

const SplashScreen = ({ navigation }) => {
  const [screen, setScreen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function checkuser() {
    const data = await SecureStore.getItemAsync("Onbording");
    if (data === "true") {
      setScreen(true);
    }
  }

  setTimeout(() => {
    setLoading(true);
  }, 3000);

  useEffect(() => {
    checkuser();
  }, []);

  return (
    <AnimatedSplash
      translucent={true}
      isLoaded={loading}
      logoImage={require("../../assets/Mobster.png")}
      backgroundColor={"#FFFFFF"}
      logoHeight={150}
      logoWidth={150}
    >
      {screen ? (
        <LoginScreen navigation={navigation} />
      ) : (
        <OnBoardScreen navigation={navigation} />
      )}
    </AnimatedSplash>
  );
};

export default SplashScreen;
