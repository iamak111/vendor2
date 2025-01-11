import { Text, View, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { HeaderStyle, CommonStyle } from "../Constents/Style";
import Colors from "../Constents/Colors";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { SearchBar, colors } from "react-native-elements";

import { BASE_URL } from "../Util/Const";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { color } from "react-native-reanimated";

const Header2 = ({ navigation }) => {
  const [userData, setUserData] = useState({});

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
          setUserData(res.data.docs);
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
    <View>
      <View
        style={[
          CommonStyle.backgroundColor_main,
          CommonStyle.flex_spacebetween,
          {
            padding: 10,
            alignItems: "center",
            borderBottomRightRadius: 35,
          },
        ]}
      >
        <Text style={{ fontWeight: "bold", color: "#ffffff" }}>
          Welcome to {userData.name}
        </Text>
        <Image
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
          }}
          resizeMode="contain"
          source={{ uri: userData.profile }}
        ></Image>
      </View>
    </View>
  );
};

export default Header2;
