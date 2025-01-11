import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigation from "./TabNavigation";
import AccountScreen from "../Screens/AccountScreen";
import AboutUsScreen from "../Screens/AboutUsScreen";
import SupportScreen from "../Screens/SupportScreen";
import VendorOrderDetails from "../Screens/VendorOrderDetails";
import VendorProductDetails from "../Screens/VendorProductDetails";
import VendorProductAdd from "../Screens/VendorProductAddScreen";
import VendorProductUpdate from "../Screens/VendorProductUpdateScreen";
const Stack = createStackNavigator();
const SecondStackNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tab Navigation"
        component={TabNavigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Account Screen"
        component={AccountScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="About Screen"
        component={AboutUsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Support Screen"
        component={SupportScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Vendor Orders Details"
        component={VendorOrderDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Vendor Product Add"
        component={VendorProductAdd}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Vendor Product Update"
        component={VendorProductUpdate}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Vendor Product Details"
        component={VendorProductDetails}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default SecondStackNavigation;
