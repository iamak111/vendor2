import { StatusBar } from "expo-status-bar";
import { CommonStyle } from "../Constents/Style";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../Constents/Colors";
import Header2 from "../Header/Header2";
import { BASE_URL } from "../Util/Const";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { Fontisto } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
export default function VendorProductList({ navigation }) {
  const [activeIndicator, setActiveIndicator] = useState(true);
  useEffect(() => {
    GetProducts(1);
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      GetProducts(1);
    }, [])
  );

  const [vdata, setVdata] = useState([]);
  const [count, setCount] = useState(0);
  const GetProducts = async (max) => {
    const headers = {
      jwt: await SecureStore.getItemAsync("jwt"),
    };
    await axios({
      method: "get",
      url: `${BASE_URL}vendor/products?page=${max}`,
      headers: headers,
    })
      .then((res) => {
        if (res.data.status === "Success") {
          setCount(res.data.count);
          setMax(Math.round(res.data.count));
          setVdata(res.data.docs);
          setActiveIndicator(false);
        }
      })
      .catch((err) => {
        setActiveIndicator(false);
        if (err.response.data.message) {
          Alert.alert("Oops", err.response.data.message);
        } else {
          Alert.alert("Oops", "Something want wrong");
        }
      });
  };

  const [activePage, setActivePage] = useState(1);
  const [max, setMax] = useState(1);

  return activeIndicator ? (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size={"large"} color={"#1C2127"} />
    </View>
  ) : (
    <SafeAreaView
      style={[CommonStyle.container, { backgroundColor: Colors.WEIGHT_COLOR }]}
    >
      <Header2 navigation={navigation} />
      <ScrollView
        style={{
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <View
          style={[
            {
              width: "100%",
              borderWidth: 1,
              borderRadius: 20,
              borderColor: Colors.LIGHT_GRAY,
              backgroundColor: Colors.WEIGHT_COLOR,
              padding: 10,
              alignItems: "center",
              elevation: 2,
              marginTop: 10,
            },
            CommonStyle.flex_spacebetween,
          ]}
        >
          <View style={[CommonStyle.flex, { alignItems: "center" }]}>
            <Image
              style={{ width: 25, height: 25 }}
              source={require("../../assets/app-assets/thee.png")}
              resizeMode="contain"
            ></Image>
            <Text style={{ fontWeight: "bold", fontSize: 30 }}>{count}</Text>
          </View>
          <Text
            style={{
              fontWeight: "500",
              fontSize: 22,
              textAlign: "center",
            }}
          >
            Total Products
          </Text>
        </View>
        <TouchableOpacity
          // onPress={() => navigation.navigate("Vendor Product Details")}
          onPress={() => navigation.navigate("Vendor Product Add")}
          style={[
            CommonStyle.flex,
            {
              width: "100%",
              height: 40,
              borderRadius: 10,
              backgroundColor: Colors.WEIGHT_COLOR,
              marginTop: 20,
              alignItems: "center",
              justifyContent: "center",
              elevation: 5,
              borderWidth: 1,
              borderColor: Colors.LIGHT_GRAY,
              marginBottom: 10,
            },
          ]}
        >
          <Entypo
            style={{ left: 10, position: "absolute" }}
            name="plus"
            size={24}
            color="black"
          />
          <Text
            style={{
              fontWeight: "500",
              fontSize: 16,
              paddingStart: 50,
            }}
            numberOfLines={1}
          >
            Add More Products
          </Text>
        </TouchableOpacity>
        {count ? (
          vdata.map((el, index) => {
            return (
              <View
                key={index}
                style={[
                  CommonStyle.flex_spacebetween,
                  {
                    width: Dimensions.get("window").width - 40,
                    borderWidth: 1,
                    borderRadius: 15,
                    borderColor: Colors.LIGHT_GRAY,
                    backgroundColor: Colors.WEIGHT_COLOR,
                    padding: 10,
                    elevation: 2,
                    marginTop: 10,
                    marginBottom: 10,
                    alignItems: "center",
                  },
                ]}
              >
                <View style={[CommonStyle.flex, { alignItems: "center" }]}>
                  <Image
                    style={{ width: 36, height: 36, borderRadius: 18 }}
                    source={{ uri: el.bannerImage }}
                    resizeMode="contain"
                  ></Image>
                  <View>
                    <Text
                      style={{
                        fontWeight: "500",
                        fontSize: 16,
                        paddingStart: 10,
                        maxWidth: Dimensions.get("window").width / 2 - 40,
                      }}
                      numberOfLines={1}
                    >
                      {el.name}
                    </Text>
                    <Text
                      style={{
                        fontWeight: "500",
                        fontSize: 16,
                        paddingStart: 10,
                        color: Colors.GRAY_COLOR,
                      }}
                    >
                      {new Date(el.createdAt).toLocaleString()}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Vendor Product Details", {
                      id: el.ecmpeId,
                    })
                  }
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      textDecorationLine: "underline",
                      color: Colors.LINK_COLOR,
                    }}
                  >
                    Manage
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          <Text
            style={{
              color: Colors.GRAY_COLOR,
              textAlign: "center",
              marginTop: 20,
            }}
          >
            Please Add Product First
          </Text>
        )}

        {count >= 25 ? (
          <View
            style={{
              flexDirection: "row",
              display: "flex",
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                activePage <= 1
                  ? setActivePage(1)
                  : setActivePage(activePage - 1);
                activePage <= 1 ? GetProducts(1) : GetProducts(activePage - 1);
              }}
              style={{
                padding: 3,
                borderColor: "gray",
                backgroundColor: "#fff",
                borderWidth: 1,
                borderRadius: 3,
              }}
            >
              <Fontisto name="angle-dobule-left" size={18} color="gray" />
            </TouchableOpacity>
            {[1, 2, 3, 4, 5].map((list, index) => {
              return !(max < list) ? (
                <TouchableOpacity
                  onPress={() => {
                    setActivePage(list), GetProducts(list);
                  }}
                  key={index}
                  style={{
                    padding: 3,
                    borderColor: "black",
                    backgroundColor: activePage === list ? "black" : "#FFF",
                    borderWidth: 1,
                    borderRadius: 3,
                    paddingLeft: 10,
                    paddingRight: 10,
                  }}
                >
                  <Text
                    style={{ color: activePage === list ? "#FFF" : "black" }}
                  >
                    {list}
                  </Text>
                </TouchableOpacity>
              ) : null;
            })}
            <TouchableOpacity
              onPress={() => {
                activePage >= max
                  ? setActivePage(max)
                  : setActivePage(activePage + 1);
                activePage >= max
                  ? GetProducts(max)
                  : GetProducts(activePage + 1);
              }}
              style={{
                padding: 3,
                borderColor: "gray",
                backgroundColor: "#fff",
                borderWidth: 1,
                borderRadius: 3,
              }}
            >
              <Fontisto name="angle-dobule-right" size={18} color="gray" />
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
      <StatusBar style="light" backgroundColor={Colors.MAIN_COLOR} />
    </SafeAreaView>
  );
}
