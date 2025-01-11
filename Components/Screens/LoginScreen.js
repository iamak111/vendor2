import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../Constents/Colors";
import { CommonStyle, LoginStyle } from "../Constents/Style";
import { StatusBar } from "expo-status-bar";
import CountryCodeDropdownPicker from "react-native-dropdown-country-picker";
import { BASE_URL } from "../Util/Const";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const LoginScreen = ({ navigation }) => {
  const [selected, setSelected] = useState("+91");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");

  const GenerateOTP = async () => {
    // console.log(selected + phone);
    await axios({
      method: "POST",
      url: `${BASE_URL}user/user-otp?role:vendor`,
      data: { phone: selected + phone, role: "vendor" },
    })
      .then((res) => {
        navigation.replace("OTP", {
          phone: selected + phone,
          otp: res.data.otp,
        });
      })
      .catch((err) => {
        Alert.alert("Oops", err.response.data.message);
      });
  };

  async function checkuser() {
    // await SecureStore.deleteItemAsync("jwt");
    const data = await SecureStore.getItemAsync("jwt");
    if (data) {
      GetMe();
    }
  }

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
          // console.log(res.data);
          if (res.data.docs?.role === "user") {
            navigation.navigate("Login");
          } else {
            if (res.data.docs?.accountVerification === "accepted") {
              navigation.navigate("Second Navigation");
            } else if (res.data.docs?.accountVerification === "requested") {
              navigation.navigate("Vendor Waiting");
            } else if (res.data.docs?.accountVerification === "rejected") {
              navigation.navigate("Vendor Reject");
            } else {
              navigation.navigate("Vendor Register");
            }
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
    checkuser();
    // async () => await SecureStore.deleteItemAsync("jwt");
  }, []);

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
          <Text style={[LoginStyle.login_text, CommonStyle.mt_20]}>
            Login with your phone number
          </Text>
          <View
            style={[CommonStyle.mt_20, CommonStyle.w_80, CommonStyle.alignSelf]}
          >
            <CountryCodeDropdownPicker
              selected={selected}
              setSelected={setSelected}
              setCountryDetails={setCountry}
              phone={phone}
              setPhone={setPhone}
              countryCodeTextStyles={{ fontSize: 13 }}
              phoneStyles={{ backgroundColor: Colors.WEIGHT_COLOR }}
            />
          </View>
          <TouchableOpacity
            disabled={phone.length >= 10 ? false : true}
            onPress={() => {
              // console.log(phone);
              if (phone.length === 10) GenerateOTP();
              else alert("Please Enter 10 Numbers Only.");
            }}
          >
            <Text
              style={[
                CommonStyle.button_light,
                CommonStyle.mt_20,
                { backgroundColor: phone.length >= 10 ? "#FFF" : "lightgray" },
              ]}
            >
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <StatusBar style="dark" backgroundColor={Colors.WEIGHT_COLOR} />
    </SafeAreaView>
  );
};

export default LoginScreen;
