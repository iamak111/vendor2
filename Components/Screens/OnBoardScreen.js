import { Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../Constents/Colors";
import { CommonStyle, OnBordScreen } from "../Constents/Style";
import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";

const OnBoardScreen = ({ navigation }) => {
  const [data, setData] = useState([
    {
      title: "Welcome to Mobster",
      des: "Welcome back, let's seize the day and create something extraordinary!",
      image: require("../../assets/app-assets/welcome.jpg"),
    },
    {
      title: "Perfect Shop",
      des: "Life is hard enough already. Let us make it a little easier.",
      image: require("../../assets/app-assets/shop.jpg"),
    },
    {
      title: "Quality Products",
      des: "Now a days individuals know the cost of everything and the benefit of nothing",
      image: require("../../assets/app-assets/qulity.jpg"),
    },
  ]);

  const [index, setIndex] = useState(0);

  const OnBordingEnd = async () => {
    await SecureStore.setItemAsync("Onbording", "true");
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView
      style={[CommonStyle.container, { backgroundColor: Colors.MAIN_COLOR }]}
    >
      <View style={[OnBordScreen.background_box]}></View>
      <View style={[OnBordScreen.first_half]}>
        <Image style={[OnBordScreen.img]} source={data[index].image}></Image>
        <View style={[CommonStyle.flex_center]}>
          <View
            style={[
              index === 0
                ? OnBordScreen.circle_dark
                : OnBordScreen.circle_light,
              CommonStyle.me_5,
            ]}
          ></View>
          <View
            style={[
              index === 1
                ? OnBordScreen.circle_dark
                : OnBordScreen.circle_light,
              ,
              CommonStyle.me_5,
            ]}
          ></View>
          <View
            style={[
              index === 2
                ? OnBordScreen.circle_dark
                : OnBordScreen.circle_light,
            ]}
          ></View>
        </View>
      </View>
      <View style={[OnBordScreen.second_half]}>
        <Text style={[OnBordScreen.title, CommonStyle.mt_40]}>
          {data[index].title}
        </Text>
        <Text style={[OnBordScreen.des, CommonStyle.mt_20]}>
          {data[index].des}
        </Text>
        {index < 2 ? (
          <TouchableOpacity
            onPress={() => {
              setIndex(index + 1);
            }}
          >
            <Text style={[OnBordScreen.button, CommonStyle.mt_40]}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => OnBordingEnd()}>
            <Text style={[OnBordScreen.button, CommonStyle.mt_40]}>
              Get Start
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <StatusBar style="dark" backgroundColor={Colors.WEIGHT_COLOR} />
    </SafeAreaView>
  );
};

export default OnBoardScreen;
