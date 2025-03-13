import { StatusBar } from "expo-status-bar";
import { CommonStyle } from "../Constents/Style";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  Switch,
  ActivityIndicator,
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
import DropDownPicker from "react-native-dropdown-picker";
import { AntDesign, Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { FirebaseApp } from "../Util/FirebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
const storage = getStorage(FirebaseApp);

export default function VendorProductUpdate({ navigation, route }) {
  const [activeIndicator, setActiveIndicator] = useState(true);
  const [imgIndicator2, setImgIndicator2] = useState(false);

  // -----------------------------------------------
  const [productData, setProductData] = useState({});
  const [altValue, setAltValue] = useState({});
  // -----------------------------------------------

  const DocumentPiker1 = async (forw, whr) => {
    setImgIndicator2(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: forw !== "images" ? true : false,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: forw === "images" ? true : false,
    });

    if (!result.canceled) {
      if (forw === "images") {
        if (result.assets?.length < 2) {
          Alert.alert("Please select minimum 2 images");
        } else if (result.assets?.length > 5) {
          Alert.alert("Please select 4 images only");
        } else {
          let im = await Promise.all(
            result.assets?.map(async (el, index) => {
              const res = await fetch(el.uri);
              const blob = await res.blob();
              let date = new Date(); // object of the date class
              timestamp = date.getTime(); // To get the timestamp
              const fileName = Math.floor(Math.random() * timestamp * (22 / 7));
              const storageRef = ref(storage, `cstempvendorimg/${fileName}`);
              let url = "";
              await Promise.all([
                uploadBytes(storageRef, blob)
                  .then(async (snapshot) => {
                    await getDownloadURL(storageRef).then((downloadURL) => {
                      url = downloadURL;
                    });
                  })
                  .catch((err) => {
                    setImgIndicator2(false);
                    alert(err);
                  }),
              ]);
              setImgIndicator2(false);
              return url;
            })
          );
          if (valueProductType === "single") {
            setProductData({ ...productData, imageGallery: im });
          } else {
            setAltValue({
              ...altValue,
              [whr]: { ...altValue[whr], imageGallery: im },
            });
          }
          setImgIndicator2(false);
        }
      } else {
        if (valueProductType === "single") {
          const res = await fetch(result.assets[0]?.uri);
          const blob = await res.blob();
          let date = new Date(); // object of the date class
          timestamp = date.getTime(); // To get the timestamp
          const fileName = Math.floor(Math.random() * timestamp * (22 / 7));
          const storageRef = ref(storage, `cstempvendorimg/${fileName}`);

          await Promise.all([
            uploadBytes(storageRef, blob)
              .then(async (snapshot) => {
                await getDownloadURL(storageRef).then((downloadURL) => {
                  setProductData({
                    ...productData,
                    bannerImage: downloadURL,
                  });
                  setImgIndicator2(false);
                });
              })
              .catch((err) => {
                setImgIndicator2(false);
                alert(err);
              }),
          ]);
          setImgIndicator2(false);
        } else {
          const res = await fetch(result.assets[0]?.uri);
          const blob = await res.blob();
          let date = new Date(); // object of the date class
          timestamp = date.getTime(); // To get the timestamp
          const fileName = Math.floor(Math.random() * timestamp * (22 / 7));
          const storageRef = ref(storage, `cstempvendorimg/${fileName}`);

          await Promise.all([
            uploadBytes(storageRef, blob)
              .then(async (snapshot) => {
                await getDownloadURL(storageRef).then((downloadURL) => {
                  setAltValue({
                    ...altValue,
                    [whr]: {
                      ...altValue[whr],
                      bannerImage: downloadURL,
                    },
                  });
                  setImgIndicator2(false);
                  return true;
                });
              })
              .catch((err) => {
                setImgIndicator2(false);
                alert(err);
              }),
          ]);
          setImgIndicator2(false);
        }
      }
    }
    setImgIndicator2(false);
  };

  const GetCategories = async () => {
    const headers = {
      jwt: await SecureStore.getItemAsync("jwt"),
    };
    await axios({
      method: "get",
      url: `${BASE_URL?forWho=vendor`,
      headers: headers,
    })
      .then(async (res) => {
        if (res.data.status === "Success") {
          const data = await Promise.all(
            res.data.docs?.map((el) => ({
              label: el.name,
              value: { cat: el.ecmcId, sub: el.subCategories },
            }))
          );
          getProductDetails(data);
          setOptionsCategorieType(data);
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
          setProductData(res.data.docs);
          setValueProductType(res.data.docs.productType);
          const expire =
            new Date(res.data.docs.dealOfTheDayExpires).valueOf() > Date.now();
          setIsEnabled(res.data.docs.dealOfTheDay && expire);

          const [categorieId] = await Promise.all([
            data.find((el) => el.label === res.data.docs.categorie),
          ]);

          setValueCategorieType(categorieId.value.cat);
          const datas = await Promise.all(
            categorieId.value.sub?.map((el) => ({
              label: el,
              value: el,
            }))
          );

          setOptionsSubCategorieType(datas);
          setValueSubCategorieType(res.data.docs.subCategory);

          setSpecification(res.data.docs.specification);
          setFeatures(res.data.docs.features);
          setInputBoxesForFeature(
            res.data.docs.features.map((el) => [
              { ...inputBoxesForFeature, key: el._id },
            ])
          );
          setInputBoxesForSpecific(
            res.data.docs.specification.map((el) => [
              { ...inputBoxesForFeature, key: el._id },
            ])
          );

          switch (res.data.docs.productType) {
            case "colorWithSize":
              const obj = {};
              await Promise.all(
                res.data.docs.productDetails.map(async (el) => {
                  const id = Math.round(
                    Date.now() * Math.random() * Math.random()
                  );
                  const subObj = {};
                  await Promise.all(
                    el.subDetails.map((els) => {
                      const sid = Math.round(
                        Date.now() * Math.random() * Math.random()
                      );
                      subObj[sid] = {
                        size: els.size,
                        price: els.price,
                        discountPrice: els.discountPrice,
                        id: els.ecmpssId,
                      };
                    })
                  );
                  obj[id] = {
                    bannerImage: el.bannerImage,
                    imageGallery: el.imageGallery,
                    color: el.color,
                    subDetails: subObj,
                    id: el.ecmpsIds,
                  };
                })
              );
              setAltValue(obj);
              break;
            case "colorOnly":
              const colObj = {};
              await Promise.all(
                res.data.docs.productDetails.map(async (el) => {
                  const id = Math.round(
                    Date.now() * Math.random() * Math.random()
                  );
                  const subObj = {};
                  await Promise.all(
                    el.subDetails.map((els) => {
                      const sid = Math.round(
                        Date.now() * Math.random() * Math.random()
                      );
                      subObj[sid] = {
                        price: els.price,
                        discountPrice: els.discountPrice,
                        id: els.ecmpssId,
                      };
                    })
                  );
                  colObj[id] = {
                    bannerImage: el.bannerImage,
                    imageGallery: el.imageGallery,
                    color: el.color,
                    subDetails: subObj,
                    id: el.ecmpsIds,
                  };
                })
              );
              setAltValue(colObj);
              break;

            case "sizeOnly":
              const sizObj = {};
              await Promise.all(
                res.data.docs.productDetails[0].subDetails.map(async (el) => {
                  const id = Math.round(
                    Date.now() * Math.random() * Math.random()
                  );

                  sizObj[id] = {
                    size: el.size,
                    price: el.price,
                    discountPrice: el.discountPrice,
                    id: el.ecmpssId,
                  };
                })
              );
              const abcObj = {
                bannerImage: res.data.docs.productDetails[0].bannerImage,
                imageGallery: res.data.docs.productDetails[0].imageGallery,
                id: res.data.docs.productDetails[0].ecmpsIds,
                subDetails: sizObj,
              };
              const id2 = Math.round(
                Date.now() * Math.random() * Math.random()
              );
              setAltValue({ [id2]: abcObj });
              break;
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

  //droupdown for product
  const [openProductType, setOpenProductType] = useState(false);
  const [valueProductType, setValueProductType] = useState(null);
  const [optionsProductType, setOptionsProductType] = useState([
    { label: "Single Product", value: "single" },
    { label: "Color Only", value: "colorOnly" },
    { label: "Size Only", value: "sizeOnly" },
    { label: "Color With Size", value: "colorWithSize" },
  ]);

  //droupdown for category
  const [openCategorieType, setOpenCategorieType] = useState(false);
  const [valueCategorieType, setValueCategorieType] = useState(null);
  const [optionsCategorieType, setOptionsCategorieType] = useState([]);

  const [openSubCategorieType, setOpenSubCategorieType] = useState(false);
  const [valueSubCategorieType, setValueSubCategorieType] = useState(null);
  const [optionsSubCategorieType, setOptionsSubCategorieType] = useState([]);

  const [inputBoxesForSpecific, setInputBoxesForSpecific] = useState([]);
  const [inputBoxesForFeature, setInputBoxesForFeature] = useState([]);
  const [inputBoxesForColor, setInputBoxesForColor] = useState([]);
  const [inputBoxesForSize, setInputBoxesForSize] = useState([]);

  const [inputValuesForSpecific, setInputValuesForSpecific] = useState([]);
  const [inputValuesForFeature, setInputValuesForFeature] = useState([]);
  const [inputValuesForColor, setInputValuesForColor] = useState([]);
  const [inputValuesForSize, setInputValuesForSize] = useState([]);

  const addTextInput = (type) => {
    if (type === "spec") {
      const newInputBoxesForSpecific = [
        ...inputBoxesForSpecific,
        { key: Date.now() + Math.random() },
      ];
      setInputBoxesForSpecific(newInputBoxesForSpecific);
    }
    if (type === "feature") {
      const newInputBoxesForFeature = [
        ...inputBoxesForFeature,
        { key: Date.now() + Math.random() },
      ];
      setInputBoxesForFeature(newInputBoxesForFeature);
    }
  };

  const handleInputChange = (from, text, index, key) => {
    const newInputValues = [...inputValuesForSpecific];
    if (from === "title") {
      newInputValues[index] = {
        id: key,
        title: text,
        description: newInputValues[index]?.description,
      };
    } else if (from === "description") {
      newInputValues[index] = {
        id: key,
        title: newInputValues[index]?.title,
        description: text,
      };
    }
    setInputValuesForSpecific(newInputValues);
  };

  const handleInputChangeFeature = (from, text, index, key) => {
    const newInputValuesForFeature = [...inputValuesForFeature];
    if (from === "title") {
      newInputValuesForFeature[index] = {
        id: key,
        title: text,
        description: newInputValuesForFeature[index]?.description,
      };
    } else if (from === "description") {
      newInputValuesForFeature[index] = {
        id: key,
        title: newInputValuesForFeature[index]?.title,
        description: text,
      };
    }
    setInputValuesForFeature(newInputValuesForFeature);
  };

  const DeleteBoxes = async (key, type) => {
    if (type === "spec") {
      var m = inputBoxesForSpecific.filter((e) => e.key !== key);
      var x = inputValuesForSpecific.filter((e) => e.id !== key);
      setInputBoxesForSpecific(m);
      setInputValuesForSpecific(x);
    }
    if (type === "feature") {
      var m = inputBoxesForFeature.filter((e) => e.key !== key);
      var x = inputValuesForFeature.filter((e) => e.id !== key);
      setInputBoxesForFeature(m);
      setInputValuesForFeature(x);
    }
  };

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };

  useEffect(() => {
    GetCategories();
  }, []);

  const [features, setFeatures] = useState([]);
  const [specification, setSpecification] = useState([]);

  const submitProduct = async () => {
    const {
      bannerImage,
      categorie,
      description,
      discountPrice,
      imageGallery,
      name,
      price,
    } = productData;
    if (!specification.length)
      return alert("Please enter atleast one Specification.");
    if (!features.length) return alert("Please enter atleast one Feature.");
    const product = {
      bannerImage,
      categorie: valueCategorieType,
      dealOfTheDay: !!isEnabled,
      description,
      discountPrice,
      imageGallery,
      name,
      price,
      specification: specification,
      features: features,
      productType: productData.productType,
      subCategory,
    };
    // console.log(JSON.stringify(product));
    if (valueProductType !== "single") {
      const data = Object.values(altValue);
      const productDetails = await Promise.all(
        data.map((el) => {
          return { ...el, subDetails: Object.values(el.subDetails) };
        })
      );
      product.productDetails = productDetails;
    }
    const headers = {
      jwt: await SecureStore.getItemAsync("jwt"),
    };
    // console.log(JSON.stringify(product));
    await axios({
      method: "PATCH",
      url: `${BASE_URL}product/${productData.ecmpeId}`,
      headers: headers,
      data: product,
    })
      .then((res) => {
        if (res.data.status === "Success") {
          alert("Product Updated Successfully.");
          // getProductDetails(optionsCategorieType);
          navigation.goBack(null);
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
      <Header navigation={navigation} />
      {imgIndicator2 ? (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <ActivityIndicator
            size={"large"}
            color={Colors.MAIN_COLOR}
          ></ActivityIndicator>
        </View>
      ) : null}
      <ScrollView style={{ padding: 10 }}>
        <Text style={[CommonStyle.title_text]}>Product Details</Text>
        <TouchableOpacity
          style={[
            {
              borderColor: Colors.MAIN_COLOR,
              borderWidth: 1,
              height: 40,
              width: "100%",
              borderRadius: 20,
              padding: 5,
              marginTop: 10,
              zIndex: 3,
              justifyContent: "center",
              alignItems: "center",
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
            placeholder="Product Type"
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
            open={openProductType}
            value={valueProductType}
            items={optionsProductType}
            setOpen={setOpenProductType}
            setValue={setValueProductType}
            setItems={setOptionsProductType}
            onChangeValue={(val) => {
              setProductData({ ...productData, productType: val });
              const id = Math.round(Date.now() * Math.random() * Math.random());
              const id2 = Math.round(
                Date.now() * Math.random() * Math.random() * Math.random()
              );
              switch (val) {
                case "single":
                  setAltValue({});
                  break;
                case "colorOnly":
                  setAltValue({ [id]: { subDetails: { [id2]: {} } } });
                  break;
                case "sizeOnly":
                case "colorWithSize":
                  setAltValue({ [id]: { subDetails: {} } });
              }
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            {
              borderColor: Colors.MAIN_COLOR,
              borderWidth: 1,
              height: 40,
              width: "100%",
              borderRadius: 20,
              padding: 5,
              marginTop: 10,
              zIndex: 2,
              justifyContent: "center",
              alignItems: "center",
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
            placeholder="Categorie Type"
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
            open={openCategorieType}
            value={valueCategorieType}
            items={optionsCategorieType}
            setOpen={setOpenCategorieType}
            setValue={setValueCategorieType}
            setItems={setOptionsCategorieType}
            onChangeValue={async (val) => {
              // console.log(val);
              const data = await Promise.all(
                val.sub?.map((el) => ({
                  label: el,
                  value: el,
                }))
              );
              const abc = val.cat;
              setOptionsSubCategorieType(data);
              setProductData({
                ...productData,
                categorie: abc,
                subCategory: false,
              });
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            {
              borderColor: Colors.MAIN_COLOR,
              borderWidth: 1,
              height: 40,
              width: "100%",
              borderRadius: 20,
              padding: 5,
              marginTop: 10,
              zIndex: 1,
              justifyContent: "center",
              alignItems: "center",
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
            placeholder="Sub Categorie"
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
            open={openSubCategorieType}
            value={valueSubCategorieType}
            items={optionsSubCategorieType}
            setOpen={setOpenSubCategorieType}
            setValue={setValueSubCategorieType}
            setItems={setOptionsSubCategorieType}
            onChangeValue={(val) => {
              setProductData({ ...productData, subCategory: val });
            }}
          />
        </TouchableOpacity>

        <Text style={[CommonStyle.title_text, { marginTop: 10 }]}>
          General Details
        </Text>
        <View
          style={[
            {
              borderColor: Colors.MAIN_COLOR,
              borderWidth: 1,
              height: 40,
              width: "100%",
              borderRadius: 20,
              marginTop: 10,
            },
          ]}
        >
          <TextInput
            style={{ paddingStart: 20 }}
            placeholder="Product Name"
            defaultValue={productData.name}
            onChangeText={(val) =>
              setProductData({ ...productData, name: val })
            }
          ></TextInput>
        </View>
        <View
          style={[
            {
              borderColor: Colors.MAIN_COLOR,
              borderWidth: 1,
              height: 40,
              width: "100%",
              borderRadius: 20,

              marginTop: 10,
            },
          ]}
        >
          <TextInput
            style={{ paddingStart: 20 }}
            placeholder="Description"
            defaultValue={productData.description}
            onChangeText={(val) =>
              setProductData({ ...productData, description: val })
            }
          ></TextInput>
        </View>

        <View
          style={[
            CommonStyle.flex_spacebetween,
            { alignItems: "center", marginTop: 10 },
          ]}
        >
          <Text style={{ fontWeight: "bold" }}>Deal of the day</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? Colors.MAIN_COLOR : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>

        {!!valueProductType ? (
          valueProductType !== "single" ? (
            <View>
              {Object.entries(altValue).map(([key, val], index) => {
                return (
                  <View key={index}>
                    {valueProductType === "colorOnly" ||
                    valueProductType === "colorWithSize" ? (
                      <>
                        <View
                          style={{
                            borderBottomWidth: 1,
                            borderBottomColor: Colors.LIGHT_GRAY,
                            margin: 10,
                          }}
                        ></View>
                        <TouchableOpacity
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignSelf: "flex-end",
                            padding: 8,
                            borderRadius: 5,
                            backgroundColor: "red",
                          }}
                          onPress={() => {
                            let val = { ...altValue };
                            delete val[key];
                            setAltValue(val);
                          }}
                        >
                          <Text style={{ color: "white" }}>Delete Color</Text>
                        </TouchableOpacity>
                        <View
                          style={[
                            {
                              borderColor: Colors.MAIN_COLOR,
                              borderWidth: 1,
                              height: 40,
                              width: "100%",
                              borderRadius: 20,

                              marginTop: 10,
                            },
                          ]}
                        >
                          <TextInput
                            defaultValue={val.color}
                            style={{ paddingStart: 20 }}
                            placeholder="Color"
                            onChangeText={(val) => {
                              setAltValue({
                                ...altValue,
                                [key]: { ...altValue[key], color: val },
                              });
                            }}
                          ></TextInput>
                        </View>
                      </>
                    ) : null}
                    <Text style={[CommonStyle.title_text, { marginTop: 10 }]}>
                      Banner Image
                    </Text>
                    <TouchableOpacity
                      onPress={() => DocumentPiker1("banner", key)}
                      style={[
                        CommonStyle.flex,
                        {
                          width: "50%",
                          height: 40,
                          borderRadius: 10,
                          backgroundColor: Colors.WEIGHT_COLOR,
                          marginTop: 20,
                          alignItems: "center",
                          justifyContent: "center",
                          alignSelf: "center",
                          elevation: 5,
                          borderWidth: altValue[key]?.bannerImage ? 5 : 1,
                          borderColor: altValue[key]?.bannerImage
                            ? Colors.GREEN_COLOR
                            : Colors.LIGHT_GRAY,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          fontWeight: "500",
                          fontSize: 16,
                          paddingStart: 10,
                        }}
                        numberOfLines={1}
                      >
                        Upload Image
                      </Text>
                    </TouchableOpacity>
                    <Text style={[CommonStyle.title_text, { marginTop: 10 }]}>
                      Image Gallery
                    </Text>
                    <View
                      style={[
                        CommonStyle.flex_spacearound,
                        { flexWrap: "wrap", marginTop: 10 },
                      ]}
                    >
                      {altValue[key]?.imageGallery?.map((el, index) => {
                        return (
                          <View
                            key={index}
                            style={[
                              {
                                width: Dimensions.get("window").width / 4,
                                height: Dimensions.get("window").width / 4,
                                borderRadius: 10,
                                borderColor: Colors.LIGHT_GRAY,
                                borderWidth: 1,
                                margin: 5,
                                padding: 5,
                              },
                            ]}
                          >
                            <Image
                              style={{ width: "100%", height: "100%" }}
                              source={{ uri: el }}
                              resizeMode="contain"
                            ></Image>
                          </View>
                        );
                      })}
                    </View>
                    <TouchableOpacity
                      onPress={() => DocumentPiker1("images", key)}
                      style={[
                        CommonStyle.flex,
                        {
                          width: "50%",
                          height: 40,
                          borderRadius: 10,
                          backgroundColor: Colors.WEIGHT_COLOR,
                          marginTop: 20,
                          alignItems: "center",
                          justifyContent: "center",
                          alignSelf: "center",
                          elevation: 5,
                          borderWidth: 1,
                          borderColor: Colors.LIGHT_GRAY,
                        },
                      ]}
                    >
                      <Entypo name="plus" size={24} color="black" />
                      <Text
                        style={{
                          fontWeight: "500",
                          fontSize: 16,
                          paddingStart: 10,
                        }}
                        numberOfLines={1}
                      >
                        Add Images
                      </Text>
                    </TouchableOpacity>
                    <Text style={{ textAlign: "center", margin: 10 }}>
                      Add multiple size for single color
                    </Text>
                    {Object.entries(val.subDetails).map(
                      ([keys, vals], index) => {
                        return (
                          <View key={index}>
                            {valueProductType === "sizeOnly" ||
                            valueProductType === "colorWithSize" ? (
                              <>
                                <View
                                  style={{
                                    borderBottomWidth: 1,
                                    borderBottomColor: Colors.LIGHT_GRAY,
                                    margin: 10,
                                  }}
                                ></View>
                                <TouchableOpacity
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignSelf: "flex-end",
                                    padding: 8,
                                    borderRadius: 5,
                                    backgroundColor: "red",
                                  }}
                                  onPress={() => {
                                    let val = { ...altValue };
                                    delete val[key].subDetails[keys];
                                    setAltValue(val);
                                  }}
                                >
                                  <Text style={{ color: "white" }}>
                                    Delete Size
                                  </Text>
                                </TouchableOpacity>
                                <View
                                  style={[
                                    {
                                      borderColor: Colors.MAIN_COLOR,
                                      borderWidth: 1,
                                      height: 40,
                                      width: "100%",
                                      borderRadius: 20,
                                      marginTop: 10,
                                    },
                                  ]}
                                >
                                  <TextInput
                                    defaultValue={vals.size}
                                    style={{ paddingStart: 20 }}
                                    placeholder="Size"
                                    onChangeText={(val) => {
                                      setAltValue({
                                        ...altValue,
                                        [key]: {
                                          ...altValue[key],
                                          subDetails: {
                                            ...altValue[key].subDetails,
                                            [keys]: {
                                              ...altValue[key].subDetails[keys],
                                              size: val,
                                            },
                                          },
                                        },
                                      });
                                    }}
                                  ></TextInput>
                                </View>
                              </>
                            ) : null}
                            <View
                              style={[
                                {
                                  borderColor: Colors.MAIN_COLOR,
                                  borderWidth: 1,
                                  height: 40,
                                  width: "100%",
                                  borderRadius: 20,
                                  marginTop: 10,
                                },
                              ]}
                            >
                              <TextInput
                                style={{ paddingStart: 20 }}
                                placeholder="Regulars Price"
                                onChangeText={(val) => {
                                  setAltValue({
                                    ...altValue,
                                    [key]: {
                                      ...altValue[key],
                                      subDetails: {
                                        ...altValue[key].subDetails,
                                        [keys]: {
                                          ...altValue[key].subDetails[keys],
                                          price: val,
                                        },
                                      },
                                    },
                                  });
                                }}
                              >
                                {vals.price}
                              </TextInput>
                            </View>
                            <View
                              style={[
                                {
                                  borderColor: Colors.MAIN_COLOR,
                                  borderWidth: 1,
                                  height: 40,
                                  width: "100%",
                                  borderRadius: 20,
                                  marginTop: 10,
                                },
                              ]}
                            >
                              <TextInput
                                style={{ paddingStart: 20 }}
                                placeholder="Discounted Price"
                                onChangeText={(val) => {
                                  setAltValue({
                                    ...altValue,
                                    [key]: {
                                      ...altValue[key],
                                      subDetails: {
                                        ...altValue[key].subDetails,
                                        [keys]: {
                                          ...altValue[key].subDetails[keys],
                                          discountPrice: val,
                                        },
                                      },
                                    },
                                  });
                                }}
                              >
                                {vals.discountPrice}
                              </TextInput>
                            </View>
                          </View>
                        );
                      }
                    )}
                    {valueProductType === "sizeOnly" ||
                    valueProductType === "colorWithSize" ? (
                      <TouchableOpacity
                        onPress={() => {
                          const id = Math.round(
                            Date.now() * Math.random() * Math.random()
                          );
                          setAltValue({
                            ...altValue,
                            [key]: {
                              ...altValue[key],
                              subDetails: {
                                ...altValue[key].subDetails,
                                [id]: {},
                              },
                            },
                          });
                        }}
                        style={[
                          CommonStyle.flex,
                          {
                            width: "50%",
                            height: 40,
                            borderRadius: 10,
                            backgroundColor: Colors.WEIGHT_COLOR,
                            marginTop: 10,
                            alignItems: "center",
                            justifyContent: "center",
                            alignSelf: "center",
                            elevation: 5,
                            borderWidth: 1,
                            borderColor: Colors.LIGHT_GRAY,
                          },
                        ]}
                      >
                        <Text
                          style={{
                            fontWeight: "500",
                            fontSize: 16,
                            paddingStart: 10,
                          }}
                          numberOfLines={1}
                        >
                          Add Size
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                );
              })}
              {valueProductType === "colorOnly" ||
              valueProductType === "colorWithSize" ? (
                <TouchableOpacity
                  onPress={() => {
                    const id = Math.round(
                      Date.now() * Math.random() * Math.random()
                    );
                    const id2 = Math.round(
                      Date.now() * Math.random() * Math.random()
                    );
                    setAltValue({
                      ...altValue,
                      [id]: { subDetails: { [id2]: {} } },
                    });
                  }}
                  style={[
                    CommonStyle.flex,
                    {
                      width: "75%",
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: Colors.MAIN_COLOR,
                      marginTop: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      alignSelf: "center",
                      elevation: 5,
                      borderWidth: 1,
                      borderColor: Colors.LIGHT_GRAY,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontWeight: "500",
                      fontSize: 16,
                      paddingStart: 10,
                      color: Colors.WEIGHT_COLOR,
                    }}
                    numberOfLines={1}
                  >
                    Add Color
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : (
            <>
              <Text style={[CommonStyle.title_text, { marginTop: 10 }]}>
                Banner Image
              </Text>
              <TouchableOpacity
                onPress={() => DocumentPiker1("banner")}
                style={[
                  CommonStyle.flex,
                  {
                    width: "50%",
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: Colors.WEIGHT_COLOR,
                    marginTop: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    elevation: 5,
                    borderWidth: productData.hasOwnProperty("bannerImage")
                      ? 5
                      : 1,
                    borderColor: productData.hasOwnProperty("bannerImage")
                      ? Colors.GREEN_COLOR
                      : Colors.LIGHT_GRAY,
                  },
                ]}
              >
                <Text
                  style={{
                    fontWeight: "500",
                    fontSize: 16,
                    paddingStart: 10,
                  }}
                  numberOfLines={1}
                >
                  Upload Image
                </Text>
              </TouchableOpacity>
              <Text style={[CommonStyle.title_text, { marginTop: 10 }]}>
                Image Gallery
              </Text>
              <View
                style={[
                  CommonStyle.flex_spacearound,
                  { flexWrap: "wrap", marginTop: 10 },
                ]}
              >
                {productData.imageGallery?.map((el, index) => {
                  return (
                    <View
                      key={index}
                      style={[
                        {
                          width: Dimensions.get("window").width / 4,
                          height: Dimensions.get("window").width / 4,
                          borderRadius: 10,
                          borderColor: Colors.LIGHT_GRAY,
                          borderWidth: 1,
                          margin: 5,
                          padding: 5,
                        },
                      ]}
                    >
                      <Image
                        style={{ width: "100%", height: "100%" }}
                        source={{ uri: el }}
                        resizeMode="contain"
                      ></Image>
                    </View>
                  );
                })}
              </View>
              <TouchableOpacity
                onPress={() => DocumentPiker1("images")}
                style={[
                  CommonStyle.flex,
                  {
                    width: "50%",
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: Colors.WEIGHT_COLOR,
                    marginTop: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    elevation: 5,
                    borderWidth: 1,
                    borderColor: Colors.LIGHT_GRAY,
                  },
                ]}
              >
                <Entypo name="plus" size={24} color="black" />
                <Text
                  style={{
                    fontWeight: "500",
                    fontSize: 16,
                    paddingStart: 10,
                  }}
                  numberOfLines={1}
                >
                  Add Images
                </Text>
              </TouchableOpacity>
              <View
                style={[
                  {
                    borderColor: Colors.MAIN_COLOR,
                    borderWidth: 1,
                    height: 40,
                    width: "100%",
                    borderRadius: 20,
                    marginTop: 10,
                  },
                ]}
              >
                <TextInput
                  style={{ paddingStart: 20 }}
                  placeholder="Regulars Price"
                  onChangeText={(val) => {
                    setProductData({ ...productData, price: val });
                  }}
                >
                  {productData.price}
                </TextInput>
              </View>
              <View
                style={[
                  {
                    borderColor: Colors.MAIN_COLOR,
                    borderWidth: 1,
                    height: 40,
                    width: "100%",
                    borderRadius: 20,
                    marginTop: 10,
                  },
                ]}
              >
                <TextInput
                  style={{ paddingStart: 20 }}
                  placeholder="Discounted Price"
                  onChangeText={(val) => {
                    setProductData({ ...productData, discountPrice: val });
                  }}
                >
                  {productData.discountPrice}
                </TextInput>
              </View>
            </>
          )
        ) : null}

        <Text style={[CommonStyle.title_text, { marginTop: 10 }]}>
          Specification
        </Text>

        {inputBoxesForSpecific.map((item, index) => (
          <View key={item.key}>
            <View style={[CommonStyle.flex_spacebetween]}>
              <Text>{index + 1}</Text>
              <TouchableOpacity
                onPress={() => {
                  DeleteBoxes(item.key, "spec");
                  specification.splice(index + 1);
                }}
              >
                <Text>Del</Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                {
                  borderColor: Colors.MAIN_COLOR,
                  borderWidth: 1,
                  height: 40,
                  width: "100%",
                  borderRadius: 20,
                  marginTop: 10,
                },
              ]}
            >
              <TextInput
                style={{ paddingStart: 20 }}
                placeholder="Title"
                onChangeText={(text) => {
                  handleInputChange("title", text, index, item.key);
                  specification[index] = {
                    ...specification[index],
                    title: text,
                  };
                }}
              >
                {specification[index]?.title}
              </TextInput>
            </View>
            <View
              style={[
                {
                  borderColor: Colors.MAIN_COLOR,
                  borderWidth: 1,
                  height: 40,
                  width: "100%",
                  borderRadius: 20,
                  marginTop: 10,
                },
              ]}
            >
              <TextInput
                style={{ paddingStart: 20 }}
                placeholder="Value"
                onChangeText={(text) => {
                  handleInputChange("description", text, index, item.key);
                  specification[index] = {
                    ...specification[index],
                    description: text,
                  };
                }}
              >
                {specification[index]?.description}
              </TextInput>
            </View>
          </View>
        ))}

        <TouchableOpacity
          onPress={() => addTextInput("spec")}
          style={[
            CommonStyle.flex,
            {
              width: "50%",
              height: 40,
              borderRadius: 10,
              backgroundColor: Colors.WEIGHT_COLOR,
              marginTop: 20,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              elevation: 5,
              borderWidth: 1,
              borderColor: Colors.LIGHT_GRAY,
            },
          ]}
        >
          <Entypo name="plus" size={24} color="black" />
          <Text
            style={{
              fontWeight: "500",
              fontSize: 16,
              paddingStart: 10,
            }}
            numberOfLines={1}
          >
            Add Specification
          </Text>
        </TouchableOpacity>

        <Text style={[CommonStyle.title_text, { marginTop: 10 }]}>Feature</Text>

        {inputBoxesForFeature.map((item, index) => (
          <View key={item.key}>
            <View style={[CommonStyle.flex_spacebetween]}>
              <Text>{index + 1}</Text>
              <TouchableOpacity
                onPress={() => {
                  // DeleteBoxes(item.key, "feature");
                  features.splice(index + 1);
                }}
              >
                <Text>Del</Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                {
                  borderColor: Colors.MAIN_COLOR,
                  borderWidth: 1,
                  height: 40,
                  width: "100%",
                  borderRadius: 20,
                  marginTop: 10,
                },
              ]}
            >
              <TextInput
                style={{ paddingStart: 20 }}
                placeholder="Title"
                onChangeText={(text) => {
                  // handleInputChangeFeature("title", text, index, item.key);
                  features[index] = {
                    ...features[index],
                    title: text,
                  };
                }}
              >
                {features[index]?.title}
              </TextInput>
            </View>
            <View
              style={[
                {
                  borderColor: Colors.MAIN_COLOR,
                  borderWidth: 1,
                  height: 40,
                  width: "100%",
                  borderRadius: 20,
                  marginTop: 10,
                },
              ]}
            >
              <TextInput
                style={{ paddingStart: 20 }}
                placeholder="Value"
                onChangeText={(text) => {
                  // handleInputChangeFeature(
                  //   "description",
                  //   text,
                  //   index,
                  //   item.key
                  // );
                  features[index] = {
                    ...features[index],
                    description: text,
                  };
                }}
              >
                {features[index]?.description}
              </TextInput>
            </View>
          </View>
        ))}

        <TouchableOpacity
          onPress={() => addTextInput("feature")}
          style={[
            CommonStyle.flex,
            {
              width: "50%",
              height: 40,
              borderRadius: 10,
              backgroundColor: Colors.WEIGHT_COLOR,
              marginTop: 20,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              elevation: 5,
              borderWidth: 1,
              borderColor: Colors.LIGHT_GRAY,
            },
          ]}
        >
          <Entypo name="plus" size={24} color="black" />
          <Text
            style={{
              fontWeight: "500",
              fontSize: 16,
              paddingStart: 10,
            }}
            numberOfLines={1}
          >
            Add Features
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            submitProduct();
          }}
        >
          <Text
            style={[
              CommonStyle.button_light,
              CommonStyle.mt_20,
              {
                backgroundColor: Colors.MAIN_COLOR,
                color: Colors.WEIGHT_COLOR,
                marginBottom: 20,
                width: "70%",
              },
            ]}
          >
            Submit
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <StatusBar style="light" backgroundColor={Colors.MAIN_COLOR} />
    </SafeAreaView>
  );
}
