import { View, Text, ScrollView } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Header2 from "../Header/Header2";
import { CommonStyle } from "../Constents/Style";
import Colors from "../Constents/Colors";

export default function AboutUsScreen({ navigation }) {
  return (
    <SafeAreaView
      style={[CommonStyle.container, { backgroundColor: Colors.MAIN_COLOR }]}
    >
      <Header2 navigation={navigation} />
      <ScrollView style={{ padding: 10 }}>
        <Text style={[CommonStyle.title_text]}>About Us</Text>
        <View></View>
      </ScrollView>
      <StatusBar style="light" backgroundColor={Colors.MAIN_COLOR} />
    </SafeAreaView>
  );
}
