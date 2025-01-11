import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import Color from "../Constents/Colors";

import { HeaderStyle } from "../Constents/Style";
import VendorHome from "../Screens/VendorHome";
import VendorOrderList from "../Screens/VendorOrderList";
import VendorProductList from "../Screens/VendorProductList";
import AccountScreen from "../Screens/AccountScreen";

const Tab = createBottomTabNavigator();
const TabNavigation = ({ navigation, route }) => {
  return (
    <Tab.Navigator
      initialRouteName="Vendor Home"
      screenOptions={{
        tabBarActiveTintColor: Color.WEIGHT_COLOR,
        tabBarInactiveTintColor: Color.WEIGHT_COLOR,
        tabBarStyle: {
          height: 50,
          backgroundColor: Color.MAIN_COLOR,
        },
      }}
    >
      <Tab.Screen
        name="Vendor Home"
        component={VendorHome}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={size}
            />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Order List"
        component={VendorOrderList}
        options={{
          tabBarLabel: "Orders",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "ios-apps-sharp" : "ios-apps-outline"}
              color={color}
              size={size}
            />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Product List"
        component={VendorProductList}
        options={{
          tabBarLabel: "Product",
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome5 name={"boxes"} color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={AccountScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name={focused ? "account" : "account-outline"}
              color={color}
              size={size}
            />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
