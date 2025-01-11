import { StatusBar } from "expo-status-bar";
import { CommonStyle, CartStyle } from "../Constents/Style";
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
import { Card } from "react-native-elements";
import DropDownPicker from "react-native-dropdown-picker";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
export default function VendorOrderDetails({ navigation, route }) {
  const [activeIndicator, setActiveIndicator] = useState(true);
  //droupdown
  const [openRecommendedProducts, setOpenRecommendedProducts] = useState(false);
  const [valueRecommendedProducts, setValueRecommendedProducts] =
    useState(null);
  const [optionsRecommendedProducts, setOptionsRecommendedProducts] = useState([
    { label: "Relevance", value: "default" },
    { label: "Low To High", value: "1" },
    { label: "High To Low", value: "-1" },
  ]);

  useEffect(() => {
    GetOrders();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      GetOrders();
    }, [])
  );

  const [orderDetails, setOrderDetails] = useState({});
  const GetOrders = async () => {
    const headers = {
      jwt: await SecureStore.getItemAsync("jwt"),
    };
    await axios({
      method: "get",
      url: `${BASE_URL}vendor/orders/${route.params.id}`,
      headers: headers,
    })
      .then((res) => {
        if (res.data.status === "Success") {
          setOrderDetails(res.data.docs);
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
        <Text style={[CommonStyle.title_text]}>Order Details</Text>
        <View>
          <Card containerStyle={[CartStyle.cart_card]}>
            <View style={[CommonStyle.flex]}>
              <View style={[CommonStyle.me_5]}>
                <Card containerStyle={[CartStyle.card_img]}>
                  <Image
                    source={{
                      uri: orderDetails?.productDetails?.bannerImage,
                    }}
                    style={[CartStyle.img]}
                  ></Image>
                </Card>
              </View>
              <View
                style={{
                  height: 110,
                  justifyContent: "center",
                  paddingStart: 10,
                  width: Dimensions.get("window").width - 150,
                  justifyContent: "space-between",
                }}
              >
                <Text numberOfLines={1} style={[CartStyle.card_title]}>
                  {orderDetails.productDetails.name}
                </Text>
                {orderDetails.productDetails.productType === "single" ? (
                  <Text
                    numberOfLines={1}
                    style={[
                      {
                        color: Colors.MAIN_COLOR,
                        fontWeight: "500",
                        fontSize: 12,
                      },
                    ]}
                  >
                    Single Product
                  </Text>
                ) : (
                  <Text
                    numberOfLines={1}
                    style={[
                      {
                        color: Colors.MAIN_COLOR,
                        fontWeight: "500",
                        fontSize: 12,
                      },
                    ]}
                  >
                    {orderDetails.productDetails.color},{" "}
                    {orderDetails.productDetails.size}
                  </Text>
                )}

                <Text style={[CartStyle.price_dis, { marginTop: 0 }]}>
                  ${orderDetails.productDetails.discountPrice}
                  <Text style={[CartStyle.price]}>
                    (${orderDetails.productDetails.price})
                  </Text>
                </Text>
                <Text numberOfLines={1} style={[CartStyle.small_text]}>
                  Qnt: {orderDetails.productDetails.quantity}
                </Text>
              </View>
            </View>
          </Card>
        </View>
        <Text style={[CommonStyle.title_text, { marginTop: 15 }]}>
          Contact Details
        </Text>
        <View>
          <View
            style={[
              CommonStyle.shadow,
              CommonStyle.address_button,
              CommonStyle.position_relative,
            ]}
          >
            <View style={[CommonStyle.flex_spacebetween]}>
              <Text
                style={{
                  color: Colors.MAIN_COLOR,
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                {orderDetails.userAddress.name}
              </Text>
            </View>

            <View
              style={{
                borderTopColor: Colors.MAIN_COLOR,
                borderTopWidth: 1,
                margin: 5,
              }}
            ></View>
            <Text>
              {orderDetails.userAddress.streetAddress},
              {orderDetails.userAddress.town},{orderDetails.userAddress.state} -{" "}
              {orderDetails.userAddress.zip}
            </Text>
            <Text style={{ fontWeight: "bold" }}>
              Phone :
              <Text style={{ fontWeight: "normal" }}>
                {" "}
                {orderDetails.userAddress.phone}
              </Text>
            </Text>
            <Text style={{ fontWeight: "bold" }}>
              Land Mark :
              <Text style={{ fontWeight: "normal" }}>
                {" "}
                {orderDetails.userAddress.landmark}
              </Text>
            </Text>
          </View>
        </View>
        <Text style={[CommonStyle.title_text, { marginTop: 15 }]}>Payment</Text>
        <View style={{ marginTop: 5, padding: 10 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            Payment Mode :{" "}
            <Text style={{ fontWeight: "500" }}>
              {orderDetails.orderDetails.paymentMethod}
            </Text>
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            Payment Status :{" "}
            <Text style={{ fontWeight: "500" }}>
              {orderDetails.orderDetails.paymentStatus}
            </Text>
          </Text>
        </View>
        <Text style={[CommonStyle.title_text, { marginTop: 15 }]}>
          Manage Order
        </Text>
        <View style={{ marginTop: 5, padding: 10 }}>
          <View style={[CommonStyle.flex, { alignItems: "center" }]}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              Update Order Status:
            </Text>
            <TouchableOpacity
              style={[
                {
                  width: 150,
                  borderColor: "#31A6F1",
                  height: 35,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: Colors.LIGHT_GRAY,
                  backgroundColor: "#FFFFFF",
                  justifyContent: "center",
                  alignItems: "center",
                  marginStart: 10,
                },
              ]}
            >
              <DropDownPicker
                closeOnBackPressed={true}
                style={[
                  {
                    borderColor: "transparent",
                    backgroundColor: "transparent",
                    borderRadius: 10,
                    paddingLeft: 20,
                    fontWeight: "500",
                    fontSize: 14,
                    color: "black",
                  },
                ]}
                placeholder="Order Status"
                placeholderStyle={{
                  color: Colors.MAIN_COLOR,
                  fontWeight: "500",
                }}
                dropDownContainerStyle={{
                  borderColor: "#ABABAB",
                }}
                ArrowDownIconComponent={({ style }) => (
                  <AntDesign name="caretdown" size={18} color="#000" />
                )}
                ArrowUpIconComponent={({ style }) => (
                  <AntDesign name="caretup" size={18} color="#000" />
                )}
                labelStyle={{ fontWeight: "500" }}
                open={openRecommendedProducts}
                value={valueRecommendedProducts}
                items={optionsRecommendedProducts}
                setOpen={setOpenRecommendedProducts}
                setValue={setValueRecommendedProducts}
                setItems={setOptionsRecommendedProducts}
                onChangeValue={(value) => getAlllist()}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <StatusBar style="light" backgroundColor={Colors.MAIN_COLOR} />
    </SafeAreaView>
  );
}
