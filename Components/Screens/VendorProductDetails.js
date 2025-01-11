import { StatusBar } from "expo-status-bar";
import {
  CommonStyle,
  HomeStyle,
  ShopScreenStyle,
  CartStyle,
} from "../Constents/Style";
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
import { useFocusEffect } from "@react-navigation/native";
import { Alert } from "react-native";
export default function VendorProductDetails({ navigation, route }) {
  const [activeIndicator, setActiveIndicator] = useState(true);

  const [productDetails, setProductDetails] = useState({});
  const [productDt, setProductDt] = useState({});
  const [imageGallery, setImageGallery] = useState([]);
  const [price, setPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [color, setColor] = useState([]);
  const [activeColor, setActiveColor] = useState(null);
  const [size, setSize] = useState([]);
  const [specification, setSpecification] = useState([]);
  const [features, setFeatures] = useState([]);
  const getProductDetails = async (data) => {
    const headers = {
      jwt: await SecureStore.getItemAsync("jwt"),
    };
    await axios({
      method: "get",
      url: `${BASE_URL}vendor/products/${route.params.id}`,
      headers: headers,
    })
      .then(async (res) => {
        if (res.data.status === "Success") {
          // console.log(JSON.stringify(res.data.docs));
          setProductDt(res.data.docs);
          setProductDetails(res.data.docs.productDetails[0]?.subDetails);
          setSpecification(res.data.docs.specification);
          setFeatures(res.data.docs.features);
          if (res.data.docs.productType === "single") {
            setImageGallery(res.data.docs.imageGallery);
            setPrice(res.data.docs.price);
            setDiscountedPrice(res.data.docs.discountPrice);
          } else {
            setImageGallery(res.data.docs.productDetails[0]?.imageGallery);
            setPrice(res.data.docs.productDetails[0]?.subDetails[0]?.price);
            setDiscountedPrice(
              res.data.docs.productDetails[0]?.subDetails[0]?.discountPrice
            );
            setColor(res.data.docs.productDetails);
            setSize(res.data.docs.productDetails[0]?.subDetails);
            setActiveColor(res.data.docs.productDetails[0]?.ecmpsId);
          }

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

  const deleteProduct = async (data) => {
    const headers = {
      jwt: await SecureStore.getItemAsync("jwt"),
    };
    await axios({
      method: "delete",
      url: `${BASE_URL}product/${route.params.id}`,
      headers: headers,
    })
      .then(async (res) => {
        if (res.data.status === "Success") {
          alert("Deleted Successfully.");
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

  useEffect(() => {
    getProductDetails();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      getProductDetails();
    }, [])
  );

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
        <Text style={[CommonStyle.title_text]}>Product Images</Text>
        <View>
          <View
            style={{
              flexDirection: "row",
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "wrap",
            }}
          >
            {imageGallery.map((list, index) => {
              return (
                <Image
                  key={index}
                  source={{
                    uri: list,
                  }}
                  resizeMode="contain"
                  style={[
                    {
                      width: Dimensions.get("window").width / 2 - 20,
                      height: Dimensions.get("window").width / 2 - 20,
                      borderWidth: 1,
                      borderRadius: 10,
                      borderColor: Colors.LIGHT_GRAY,
                      backgroundColor: Colors.WEIGHT_COLOR,
                      marginTop: 10,
                    },
                  ]}
                ></Image>
              );
            })}
          </View>
        </View>
        <Text style={[CommonStyle.title_text, { marginTop: 15 }]}>
          Product details
        </Text>
        <View style={{ marginTop: 5, padding: 10 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            Product Name :{" "}
            <Text style={{ fontWeight: "400" }}>{productDt.name}</Text>
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 10 }}>
            Description :{" "}
            <Text style={{ fontWeight: "400" }}>{productDt.description}</Text>
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 10 }}>
            Regular Price : <Text style={{ fontWeight: "400" }}>{price}</Text>
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 10 }}>
            Discounted Price :{" "}
            <Text style={{ fontWeight: "400" }}>{discountedPrice}</Text>
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 10 }}>
            Deal of the day :{" "}
            <Text style={{ fontWeight: "400", color: "red" }}>
              {productDt.dealOfTheDay ? "True" : "False"}
            </Text>
          </Text>
        </View>
        {productDt.productType !== "single" &&
        productDt.productType !== "sizeOnly" ? (
          <>
            <Text style={[CommonStyle.title_text, { marginTop: 15 }]}>
              Available Colors :
            </Text>
            <View
              style={{
                flexDirection: "row",
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {color.map((list, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setActiveColor(list.ecmpsId),
                        setImageGallery(list.imageGallery),
                        setSize(list.subDetails);
                      setPrice(list.subDetails[0].price);
                      setDiscountedPrice(list.subDetails[0].discountPrice);
                    }}
                    style={[
                      {
                        width: 30,
                        height: 30,
                        backgroundColor: list.color,
                        borderRadius: 15,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: list.ecmpsId === activeColor ? 3 : 0,
                        elevation: 5,
                        marginRight: 5,
                      },
                    ]}
                  ></TouchableOpacity>
                );
              })}
            </View>
          </>
        ) : null}
        {productDt.productType !== "single" &&
        productDt.productType !== "colorOnly" ? (
          <>
            <Text style={[CommonStyle.title_text, { marginTop: 15 }]}>
              Available Size :
            </Text>
            <View
              style={{
                flexDirection: "row",
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {size.map((list, index) => {
                return (
                  <Text key={index}>
                    {list.size}-{list.discountPrice},{" "}
                  </Text>
                );
              })}
            </View>
          </>
        ) : null}

        <Text style={[CommonStyle.title_text, { marginTop: 15 }]}>
          Specifications
        </Text>
        {specification.map((list, index) => {
          return (
            <Text
              key={index}
              style={{ fontWeight: "bold", fontSize: 16, marginTop: 10 }}
            >
              {list.title} :{" "}
              <Text style={{ fontWeight: "400" }}>{list.description}</Text>
            </Text>
          );
        })}
        <Text style={[CommonStyle.title_text, { marginTop: 15 }]}>
          Features
        </Text>

        {features.map((list, index) => {
          return (
            <Text
              key={index}
              style={{ fontWeight: "bold", fontSize: 16, marginTop: 10 }}
            >
              {list.title} :{" "}
              <Text style={{ fontWeight: "400" }}>{list.description}</Text>
            </Text>
          );
        })}
        <View
          style={{
            flexDirection: "row",
            display: "flex",
            flexWrap: "wrap",
            marginBottom: 50,
            justifyContent: "space-around",
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Vendor Product Update", {
                id: route.params.id,
              });
            }}
          >
            <Text
              style={{
                borderRadius: 50,
                backgroundColor: Colors.WEIGHT_COLOR,
                padding: 10,
                fontSize: 16,
                fontWeight: "bold",
                color: Colors.MAIN_COLOR,
                borderColor: Colors.MAIN_COLOR,
                borderWidth: 1,
                width: Dimensions.get("window").width / 2 - 50,
                textAlign: "center",
              }}
            >
              Update
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Alert.alert("Delete", "Are you sure to delete ?", [
                {
                  text: "Yes",
                  onPress: () => deleteProduct(),
                },
                {
                  text: "No",
                },
              ]);
            }}
          >
            <Text
              style={{
                borderRadius: 50,
                backgroundColor: Colors.MAIN_COLOR,
                padding: 10,
                fontSize: 16,
                fontWeight: "bold",
                color: Colors.WEIGHT_COLOR,
                borderColor: Colors.MAIN_COLOR,
                borderWidth: 1,
                width: Dimensions.get("window").width / 2 - 50,
                textAlign: "center",
              }}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <StatusBar style="light" backgroundColor={Colors.MAIN_COLOR} />
    </SafeAreaView>
  );
}
