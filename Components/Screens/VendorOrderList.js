import { StatusBar } from "expo-status-bar";
import { CommonStyle } from "../Constents/Style";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
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
import { Fontisto } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
export default function VendorOrderList({ navigation }) {
  const [activeIndicator, setActiveIndicator] = useState(true);
  useEffect(() => {
    GetOrders(1);
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      GetOrders(1);
    }, [])
  );
  const [vdata, setVdata] = useState({});
  const [BtnType, setBtnType] = useState("active");
  const GetOrders = async (max) => {
    const headers = {
      jwt: await SecureStore.getItemAsync("jwt"),
    };
    await axios({
      method: "get",
      url: `${BASE_URL}vendor/orders?page=${max}`,
      headers: headers,
    })
      .then((res) => {
        if (res.data.status === "Success") {
          // console.log(res.data);
          setVdata(res.data);
          setActiveCount(res.data.activecount);
          setHistoryCount(res.data.historycount);
          setActiveMax(Math.round(res.data.activecount));
          setHistoryMax(Math.round(res.data.historycount));
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

  const [historyCount, setHistoryCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [historyMax, setHistoryMax] = useState(1);
  const [activeMax, setActiveMax] = useState(1);
  const [activePage, setActivePage] = useState(1);

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
          padding: 20,
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
            <Text style={{ fontWeight: "bold", fontSize: 30 }}>
              {historyCount + activeCount}
            </Text>
          </View>
          <Text
            style={{
              fontWeight: "500",
              fontSize: 22,
              textAlign: "center",
            }}
          >
            Total Orders
          </Text>
        </View>
        <View
          style={[
            CommonStyle.flex,
            {
              width: "70%",
              height: 40,
              borderRadius: 20,
              backgroundColor: Colors.LIGHT_GRAY,
              marginTop: 20,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              setBtnType("active");
              setActivePage(1);
            }}
            style={[
              {
                width: "48%",
                height: 30,
                borderRadius: 15,
                backgroundColor:
                  BtnType === "active" ? Colors.MAIN_COLOR : null,
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
              },
            ]}
          >
            <Text
              style={{
                fontWeight: "500",
                fontSize: 10,
                color:
                  BtnType === "active"
                    ? Colors.WEIGHT_COLOR
                    : Colors.MAIN_COLOR,
              }}
            >
              Active Orders
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setBtnType("history");
              setActivePage(1);
            }}
            style={[
              {
                width: "48%",
                height: 30,
                borderRadius: 15,
                backgroundColor:
                  BtnType === "history" ? Colors.MAIN_COLOR : null,
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
              },
            ]}
          >
            <Text
              style={{
                fontWeight: "500",
                fontSize: 10,
                color:
                  BtnType === "history"
                    ? Colors.WEIGHT_COLOR
                    : Colors.MAIN_COLOR,
              }}
            >
              Previous Orders
            </Text>
          </TouchableOpacity>
        </View>
        {BtnType === "active" ? (
          vdata.order.active.length ? (
            vdata.order?.active.map((val, index) => {
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
                      marginTop: 20,
                      alignItems: "center",
                    },
                  ]}
                >
                  <View style={[CommonStyle.flex, { alignItems: "center" }]}>
                    <Image
                      style={{ width: 36, height: 36, borderRadius: 18 }}
                      source={{ uri: val.productDetails.bannerImage }}
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
                        {val.productDetails.name}
                      </Text>
                      <Text
                        style={{
                          fontWeight: "500",
                          fontSize: 16,
                          paddingStart: 10,
                          color: Colors.GRAY_COLOR,
                        }}
                      >
                        {new Date(val.createdAt).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Vendor Orders Details", {
                        id: val.ecmorId,
                      })
                    }
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 18,
                        textDecorationLine: "underline",
                        color: Colors.LINK_COLOR,
                      }}
                    >
                      View Details
                    </Text>
                  </TouchableOpacity>
                </View>
              );
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
                Orders not found
              </Text>
            </View>
          )
        ) : vdata.order.history.length ? (
          vdata.order?.history.map((val, index) => {
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
                    marginTop: 20,
                    alignItems: "center",
                  },
                ]}
              >
                <View style={[CommonStyle.flex, { alignItems: "center" }]}>
                  <Image
                    style={{ width: 36, height: 36, borderRadius: 18 }}
                    source={{ uri: val.productDetails.bannerImage }}
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
                      {val.productDetails.name}
                    </Text>
                    <Text
                      style={{
                        fontWeight: "500",
                        fontSize: 16,
                        paddingStart: 10,
                        color: Colors.GRAY_COLOR,
                      }}
                    >
                      {new Date(val.createdAt).toLocaleString()}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Vendor Orders Details", {
                      id: val.ecmorId,
                    })
                  }
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 18,
                      textDecorationLine: "underline",
                      color: Colors.LINK_COLOR,
                    }}
                  >
                    View Details
                  </Text>
                </TouchableOpacity>
              </View>
            );
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
              Orders not found
            </Text>
          </View>
        )}

        {BtnType === "active" ? (
          activeCount > 25 ? (
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
                  activePage <= 1 ? GetOrders(1) : GetOrders(activePage - 1);
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
                return !(activeMax < list) ? (
                  <TouchableOpacity
                    onPress={() => {
                      setActivePage(list), GetOrders(list);
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
                  activePage >= activeMax
                    ? setActivePage(activeMax)
                    : setActivePage(activePage + 1);
                  activePage >= activeMax
                    ? GetOrders(activeMax)
                    : GetOrders(activePage + 1);
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
          ) : null
        ) : historyCount > 25 ? (
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
                activePage <= 1 ? GetOrders(1) : GetOrders(activePage - 1);
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
              return !(historyMax < list) ? (
                <TouchableOpacity
                  onPress={() => {
                    setActivePage(list), GetOrders(list);
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
                activePage >= historyMax
                  ? setActivePage(historyMax)
                  : setActivePage(activePage + 1);
                activePage >= historyMax
                  ? GetOrders(historyMax)
                  : GetOrders(activePage + 1);
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
