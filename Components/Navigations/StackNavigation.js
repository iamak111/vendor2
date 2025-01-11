import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../Screens/SplashScreen";
import LoginScreen from "../Screens/LoginScreen";
import OTPScreen from "../Screens/OTPScreen";
import VendorRegister from "../Screens/VendorRegisterScreen";
import SecondStackNavigation from "./SecondStackNavigation";
import VendorWaiting from "../Screens/VendorWaitingScreen";
import VendorReject from "../Screens/VendorRejectedScreen";

const Stack = createStackNavigator();
const StackNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OTP"
        component={OTPScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Vendor Register"
        component={VendorRegister}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Vendor Waiting"
        component={VendorWaiting}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Vendor Reject"
        component={VendorReject}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Second Navigation"
        component={SecondStackNavigation}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigation;
