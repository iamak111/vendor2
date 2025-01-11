import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../Constents/Colors";
import { CommonStyle, LoginStyle } from "../Constents/Style";
import { StatusBar } from "expo-status-bar";
import { BASE_URL } from "../Util/Const";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

const OTPScreen = ({ navigation, route }) => {
  const VerifyOTP = async () => {
    const data = { phone: route.params.phone, otp: route.params.otp };
    // console.log(data);
    await axios({
      method: "PATCH",
      url: `${BASE_URL}user/verify-user`,
      data: data,
    })
      .then((res) => {
        if (res.data.status === "Success") {
          SecureStore.setItemAsync("jwt", res.data.jwt);
          navigation.navigate("Vendor Register");
        }
      })
      .catch((err) => {
        Alert.alert("Oops", err.response.data.message);
      });
  };

  return (
    <SafeAreaView style={[CommonStyle.container]}>
      <ScrollView>
        <View style={[LoginStyle.first_half]}>
          <Image
            style={[LoginStyle.img]}
            source={require("../../assets/app-assets/welcome.jpg")}
          ></Image>
          <Text style={[LoginStyle.title]}>Welcome to The Mobster</Text>
          <Text style={[LoginStyle.des, CommonStyle.mt_10]}>
            They have access to an entire world of products at the tip of their
            fingers when they use an eCommerce platform.
          </Text>
        </View>
        <View style={[LoginStyle.second_half]}>
          <Text style={[LoginStyle.logo, CommonStyle.mt_10]}>TM</Text>

          <View>
            <Text style={[LoginStyle.login_text, CommonStyle.mt_20]}>
              Enter you 6 digit otp pin
            </Text>
            <View
              style={[
                CommonStyle.mt_20,
                CommonStyle.w_50,
                CommonStyle.alignSelf,
              ]}
            >
              <TextInput
                inputMode="numeric"
                textAlign="center"
                style={[CommonStyle.text_input]}
                placeholder="123XXX"
              >
                {route.params.otp}
              </TextInput>
            </View>
            <TouchableOpacity
              onPress={() => {
                VerifyOTP();
              }}
            >
              <Text style={[CommonStyle.button_light, CommonStyle.mt_20]}>
                Verify
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <StatusBar style="dark" backgroundColor={Colors.WEIGHT_COLOR} />
    </SafeAreaView>
  );
};

export default OTPScreen;
