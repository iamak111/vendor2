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
import Header from "../Header/Header2";
import { BASE_URL } from "../Util/Const";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import Constants from "expo-constants";
export default function VendorReject({ navigation }) {
  const GetMe = async () => {
    const headers = {
      jwt: await SecureStore.getItemAsync("jwt"),
    };
    await axios({
      method: "get",
      url: `${BASE_URL}user/get-me`,
      headers: headers,
    })
      .then((res) => {
        if (res.data.status === "Success") {
          // console.log(res.data.docs);
          if (res.data.docs?.accountVerification === "accepted") {
            navigation.navigate("Second Navigation");
          }
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
  useEffect(() => {
    GetMe();
  }, []);
  return (
    <SafeAreaView
      style={[CommonStyle.container, { backgroundColor: Colors.WEIGHT_COLOR }]}
    >
      <Header navigation={navigation} />
      <View
        style={{
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
          height:
            Dimensions.get("window").height - 70 - Constants.statusBarHeight,
        }}
      >
        <Image
          style={{
            width: Dimensions.get("window").width - 20,
            height: Dimensions.get("window").height / 2,
          }}
          resizeMode="contain"
          source={require("../../assets/app-assets/rejected.jpg")}
        ></Image>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            marginTop: 20,
            textAlign: "center",
          }}
        >
          Oh No. Your Application Was Rejected.
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Second Navigation", {
              screen: "Support Screen",
            });
            // navigation.navigate("Support Screen");
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              marginTop: 20,
              textAlign: "center",
              textDecorationLine: "underline",
              color: "blue",
            }}
          >
            Please Contact Our Support Team.
          </Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="light" backgroundColor={Colors.MAIN_COLOR} />
    </SafeAreaView>
  );
}
