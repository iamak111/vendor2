import { StatusBar } from "expo-status-bar";
import {
  CommonStyle,
  HomeStyle,
  ShopScreenStyle,
  OnBordScreen,
} from "../Constents/Style";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../Constents/Colors";
import Header2 from "../Header/Header2";
import { BASE_URL } from "../Util/Const";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

export default function SupportScreen({ navigation }) {
  const [title, setTitle] = useState(null);
  const [des, setDes] = useState(null);
  const SendReport = async () => {
    const headers = {
      jwt: await SecureStore.getItemAsync("jwt"),
    };
    await axios({
      method: "POST",
      url: `${BASE_URL}user/report`,
      headers: headers,
      data: { title: title, description: des },
    })
      .then((res) => {
        if (res.data.status === "Success") {
          alert("success");
          setTitle(null);
          setDes(null);
          navigation.goBack();
        }
      })
      .catch((err) => {
        if (err.response.data.message) {
          Alert.alert("Oops", err.response.data.message);
        } else {
          Alert.alert("Oops", "Something want wrong");
        }
      });
  };
  return (
    <SafeAreaView
      style={[CommonStyle.container, { backgroundColor: Colors.WEIGHT_COLOR }]}
    >
      <Header2 navigation={navigation} />
      <ScrollView>
        <Image
          style={[OnBordScreen.img, { width: 250, height: 250, marginTop: 30 }]}
          source={require("../../assets/app-assets/support.png")}
          resizeMode="contain"
        ></Image>

        <Text
          style={[
            CommonStyle.title_text,
            CommonStyle.text_center,
            CommonStyle.mt_20,
          ]}
        >
          Send Your Report
        </Text>

        <View
          style={[CommonStyle.mt_20, CommonStyle.w_75, CommonStyle.alignSelf]}
        >
          <TextInput
            inputMode="text"
            textAlign="left"
            value={title}
            style={[CommonStyle.text_input]}
            placeholder="Title"
            onChangeText={(val) => setTitle(val)}
          ></TextInput>
          <TextInput
            inputMode="text"
            textAlign="left"
            value={des}
            style={[CommonStyle.text_input, CommonStyle.mt_10]}
            placeholder="Details"
            onChangeText={(val) => setDes(val)}
          ></TextInput>
        </View>
        <TouchableOpacity onPress={() => SendReport()}>
          <Text style={[CommonStyle.button_dark, CommonStyle.mt_20]}>
            Submit
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <StatusBar style="light" backgroundColor={Colors.MAIN_COLOR} />
    </SafeAreaView>
  );
}
