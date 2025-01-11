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
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../Constents/Colors";
import Header2 from "../Header/Header2";
import { BASE_URL } from "../Util/Const";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
export default function VendorHome({ navigation }) {
  const [activeIndicator, setActiveIndicator] = useState(true);
  useEffect(() => {
    GetVendor();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      GetVendor();
    }, [])
  );
  const [vdata, setVdata] = useState({});
  const GetVendor = async () => {
    const headers = {
      jwt: await SecureStore.getItemAsync("jwt"),
    };
    await axios({
      method: "get",
      url: `${BASE_URL}vendor`,
      headers: headers,
    })
      .then((res) => {
        if (res.data.status === "Success") {
          // console.log(res.data);
          setData(res.data?.orderStates ?? []);
          setVdata(res.data);
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
  const CustomBarChart = ({ data, label }) => {
    const chartHeight = 200;
    const maxValue = Math.max(
      ...label.map((item) => (data[item.id] ? data[item.id] : 0.01))
    );

    return (
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        style={{ flexDirection: "row", display: "flex" }}
      >
        {label.map((list, index) => {
          const barHeight =
            (data[list.id] ? data[list.id] : 0.01 / maxValue) * chartHeight;
          return (
            <View key={index}>
              <View
                style={{
                  width: 30,
                  height: barHeight,
                  backgroundColor: Colors.MAIN_COLOR,
                  marginEnd: 5,
                  marginTop: chartHeight - barHeight,
                }}
              ></View>
              <Text style={{ textAlign: "center" }}>{list.label}</Text>
            </View>
          );
        })}
      </ScrollView>
    );
  };
  const [label, setLabel] = useState([
    { label: "Jan", id: "1" },
    { label: "Feb", id: "2" },
    { label: "Mar", id: "3" },
    { label: "Ap", id: "4" },
    { label: "May", id: "5" },
    { label: "Jun", id: "6" },
    { label: "Jul", id: "7" },
    { label: "Aug", id: "8" },
    { label: "Sep", id: "9" },
    { label: "Oct", id: "10" },
    { label: "Nov", id: "11" },
    { label: "Des", id: "12" },
  ]);

  const [data, setData] = useState([{ 2: 30 }]);

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
          padding: 10,
        }}
      >
        <View style={[CommonStyle.flex_spacebetween]}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Product List");
            }}
            style={{
              width: Dimensions.get("window").width / 2.5,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: Colors.LIGHT_GRAY,
              backgroundColor: Colors.WEIGHT_COLOR,
              padding: 10,
              justifyContent: "center",
              elevation: 2,
            }}
          >
            <View
              style={[CommonStyle.flex_spacebetween, { alignItems: "center" }]}
            >
              <Image
                style={{ width: 25, height: 25 }}
                source={require("../../assets/app-assets/thee.png")}
                resizeMode="contain"
              ></Image>
              <Text style={{ fontWeight: "bold", fontSize: 30 }}>
                {vdata.productsCount}
              </Text>
            </View>
            <Text
              style={{
                fontWeight: "500",
                fontSize: 22,
                textAlign: "center",
                marginTop: 5,
              }}
            >
              Total Product
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Order List");
            }}
            style={{
              width: Dimensions.get("window").width / 2.5,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: Colors.LIGHT_GRAY,
              backgroundColor: Colors.WEIGHT_COLOR,
              padding: 10,
              justifyContent: "center",
              elevation: 2,
            }}
          >
            <View
              style={[CommonStyle.flex_spacebetween, { alignItems: "center" }]}
            >
              <Image
                style={{ width: 25, height: 25 }}
                source={require("../../assets/app-assets/thee.png")}
                resizeMode="contain"
              ></Image>
              <Text style={{ fontWeight: "bold", fontSize: 30 }}>
                {vdata.ordersCount}
              </Text>
            </View>
            <Text
              style={{
                fontWeight: "500",
                fontSize: 22,
                textAlign: "center",
                marginTop: 5,
              }}
            >
              Total Orders
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            {
              width: Dimensions.get("window").width - 20,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: Colors.LIGHT_GRAY,
              backgroundColor: Colors.WEIGHT_COLOR,
              padding: 10,
              elevation: 2,
              marginTop: 20,
            },
          ]}
        >
          <Text style={{ fontWeight: "bold" }}>Orders</Text>
          <CustomBarChart data={data} label={label} />
          <Text style={{ marginTop: 10, textAlign: "center" }}>Month</Text>
        </View>
        <View
          style={[
            {
              width: Dimensions.get("window").width - 20,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: Colors.LIGHT_GRAY,
              backgroundColor: Colors.WEIGHT_COLOR,
              padding: 10,
              elevation: 2,
              marginTop: 20,
            },
          ]}
        >
          <View style={[CommonStyle.flex_spacebetween]}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
                paddingStart: 10,
              }}
            >
              New Orders
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Order List");
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  textDecorationLine: "underline",
                  color: Colors.LINK_COLOR,
                  paddingEnd: 10,
                }}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            {vdata.ordersCount ? (
              vdata.orders?.map((val, index) => {
                return index <= 5 ? (
                  <View
                    key={index}
                    style={[CommonStyle.flex_spacebetween, { marginTop: 10 }]}
                  >
                    <View style={[CommonStyle.flex, { alignItems: "center" }]}>
                      <Image
                        style={{ width: 36, height: 36, borderRadius: 18 }}
                        source={{ uri: val.productDetails.bannerImage }}
                        resizeMode="contain"
                      ></Image>
                      <Text
                        style={{
                          fontWeight: "500",
                          fontSize: 16,
                          paddingStart: 10,
                          maxWidth: Dimensions.get("window").width / 2 - 40,
                        }}
                        numberOfLines={2}
                      >
                        {val.productDetails.name}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontWeight: "500",
                        fontSize: 16,
                        paddingStart: 10,
                        color: Colors.GRAY_COLOR,
                      }}
                    >
                      12-12-2023
                    </Text>
                  </View>
                ) : null;
              })
            ) : (
              <View>
                <Text
                  style={{
                    padding: 10,
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "bold",
                    marginTop: 30,
                    marginBottom: 30,
                    color: Colors.GRAY_COLOR,
                  }}
                >
                  Product not found
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
        <View
          style={[
            {
              width: Dimensions.get("window").width - 20,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: Colors.LIGHT_GRAY,
              backgroundColor: Colors.WEIGHT_COLOR,
              padding: 10,
              elevation: 2,
              marginTop: 20,
              marginBottom: 20,
            },
          ]}
        >
          <View style={[CommonStyle.flex_spacebetween]}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
                paddingStart: 10,
              }}
            >
              Your Products
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Product List");
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  textDecorationLine: "underline",
                  color: Colors.LINK_COLOR,
                  paddingEnd: 10,
                }}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            {vdata.productsCount ? (
              vdata.products?.map((val, index) => {
                return index <= 5 ? (
                  <View
                    key={index}
                    style={[CommonStyle.flex_spacebetween, { marginTop: 10 }]}
                  >
                    <View style={[CommonStyle.flex, { alignItems: "center" }]}>
                      <Image
                        style={{ width: 36, height: 36, borderRadius: 18 }}
                        source={{ uri: val.bannerImage }}
                        resizeMode="contain"
                      ></Image>
                      <Text
                        style={{
                          fontWeight: "500",
                          fontSize: 16,
                          paddingStart: 10,
                          maxWidth: Dimensions.get("window").width / 2 - 40,
                        }}
                        numberOfLines={2}
                      >
                        {val.name}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontWeight: "500",
                        fontSize: 16,
                        paddingStart: 10,
                        color: Colors.GRAY_COLOR,
                      }}
                    >
                      12-12-2023
                    </Text>
                  </View>
                ) : null;
              })
            ) : (
              <View>
                <Text
                  style={{
                    padding: 10,
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "bold",
                    marginTop: 30,
                    marginBottom: 30,
                    color: Colors.GRAY_COLOR,
                  }}
                >
                  Product not found
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </ScrollView>
      <StatusBar style="light" backgroundColor={Colors.MAIN_COLOR} />
    </SafeAreaView>
  );
}
