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
  Dimensions,
  ActivityIndicator,
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

export default function VendorProductAdd({ navigation }) {
  const [singleBanner, setSinglebanner] = useState("");
  const [singleMultipleImage, setSingleMultiImage] = useState([]);
  const [singleMultipleTemp, setSingleMultiTemp] = useState([]);
  // const [MultipleTemp, setMultiTemp] = useState([]);
  const [imageArray, setImageArray] = useState([]);
  const [checkImageArray, setCheckImageArray] = useState({});
  const [multipleImageArray, setMultiImageArray] = useState([]);

  const [imgIndicator2, setImgIndicator2] = useState(false);

  const DocumentPiker = async (key, type) => {
    setImgIndicator2(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: type !== "images" ? true : false,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: type === "images" ? true : false,
    });

    if (!result.canceled) {
      if (type === "images") {
        if (result.assets?.length < 2) {
          Alert.alert("Please select minimum 2 images");
        } else if (result.assets?.length > 5) {
          Alert.alert("Please select 4 images only");
        } else {
          let im = await Promise.all(
            result.assets?.map(async (el, index) => {
              const res = await fetch(el.uri);
              const blob = await res.blob();
              const fileName = el.uri.substring(el.uri.lastIndexOf("/") + 1);
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
              return url;
            })
          );
          if (key === "single") {
            setSingleMultiTemp(result.assets);
            setSingleMultiImage(im);
            setImgIndicator2(false);
          } else {
            const tempM = multipleImageArray.filter(
              (el, index) => el.id !== key
            );
            tempM.push({ id: key, imageGallery: im });
            setMultiImageArray(tempM);
          }
          setImgIndicator2(false);
        }
      } else {
        if (key === "single") {
          const res = await fetch(result.assets[0]?.uri);
          const blob = await res.blob();
          const fileName = result.assets[0]?.uri.substring(
            result.assets[0]?.uri.lastIndexOf("/") + 1
          );
          const storageRef = ref(storage, `cstempvendorimg/${fileName}`);

          await uploadBytes(storageRef, blob)
            .then((snapshot) => {
              getDownloadURL(storageRef).then((downloadURL) => {
                setSinglebanner(downloadURL);
              });
            })
            .catch((err) => {
              alert(err);
            });
        } else {
          const temp = imageArray.filter((el, index) => el.id !== key);
          const res = await fetch(result.assets[0]?.uri);
          const blob = await res.blob();
          const fileName = result.assets[0]?.uri.substring(
            result.assets[0]?.uri.lastIndexOf("/") + 1
          );
          const storageRef = ref(storage, `cstempvendorimg/${fileName}`);

          await Promise.all([
            uploadBytes(storageRef, blob)
              .then(async (snapshot) => {
                // console.log("url");
                await getDownloadURL(storageRef).then(async (downloadURL) => {
                  temp.push({ id: key, bannerImage: downloadURL });
                });
              })
              .catch((err) => {
                setImgIndicator2(false);
                alert(err);
              }),
          ]);
          // console.log(temp);
          setImageArray(temp);
        }
      }
    }
    setImgIndicator2(false);
  };

  const DocumentPiker1 = async (type) => {
    setImgIndicator2(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: type !== "images" ? true : false,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: type === "images" ? true : false,
    });

    if (!result.canceled) {
      if (type === "images") {
        if (result.assets?.length < 2) {
          Alert.alert("Please select minimum 2 images");
        } else if (result.assets?.length > 5) {
          Alert.alert("Please select 4 images only");
        } else {
          let im = await Promise.all(
            result.assets?.map(async (el, index) => {
              const res = await fetch(el.uri);
              const blob = await res.blob();
              const fileName = el.uri.substring(el.uri.lastIndexOf("/") + 1);
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
                    alert(err);
                  }),
              ]);
              setImgIndicator2(false);
              return url;
            })
          );
          console.log(im);
          setSizeImages(im);
          setImgIndicator2(false);
        }
      } else {
        const res = await fetch(result.assets[0]?.uri);
        const blob = await res.blob();
        const fileName = result.assets[0]?.uri.substring(
          result.assets[0]?.uri.lastIndexOf("/") + 1
        );
        const storageRef = ref(storage, `cstempvendorimg/${fileName}`);

        await Promise.all([
          uploadBytes(storageRef, blob)
            .then(async (snapshot) => {
              await getDownloadURL(storageRef).then((downloadURL) => {
                setSizeImage(downloadURL);
                setImgIndicator2(false);
              });
            })
            .catch((err) => {
              setImgIndicator2(false);
              alert(err);
            }),
        ]);
      }
    }
    setImgIndicator2(false);
  };

  const [productData, setProductData] = useState({});

  const GetCategories = async () => {
    const headers = {
      jwt: await SecureStore.getItemAsync("jwt"),
    };
    await axios({
      method: "get",
      url: `${BASE_URL}category?forWho=vendor`,
      headers: headers,
    })
      .then((res) => {
        if (res.data.status === "Success") {
          setOptionsCategorieType(
            res.data.docs?.map((el) => ({ label: el.name, value: el.ecmcId }))
          );
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
    if (type === "color") {
      const newInputBoxesForColor = [
        ...inputBoxesForColor,
        { key: Date.now() + Math.random() },
      ];
      setInputBoxesForColor(newInputBoxesForColor);
    }
    if (type === "size") {
      const newInputBoxesForSize = [
        ...inputBoxesForSize,
        { key: Date.now() + Math.random() },
      ];
      setInputBoxesForSize(newInputBoxesForSize);
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

  const handleInputForColor = (from, text, index, key) => {
    const newInputValuesForColor = [...inputValuesForColor];
    if (from === "color") {
      newInputValuesForColor[index] = {
        id: key,
        color: text,
        subDetails: [
          {
            price: newInputValuesForColor[index]?.subDetails[0]?.price,
            discountPrice:
              newInputValuesForColor[index]?.subDetails[0]?.discountPrice,
          },
        ],
      };
      setInputValuesForColor(newInputValuesForColor);
    }
    if (from === "rprice") {
      newInputValuesForColor[index] = {
        id: key,
        color: newInputValuesForColor[index]?.color,
        subDetails: [
          {
            price: text,
            discountPrice:
              newInputValuesForColor[index]?.subDetails[0]?.discountPrice,
          },
        ],
      };
      setInputValuesForColor(newInputValuesForColor);
    }
    if (from === "dprice") {
      newInputValuesForColor[index] = {
        id: key,
        color: newInputValuesForColor[index]?.color,
        subDetails: [
          {
            price: newInputValuesForColor[index]?.subDetails[0]?.price,
            discountPrice: text,
          },
        ],
      };
      setInputValuesForColor(newInputValuesForColor);
    }
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
    if (type === "color") {
      var m = inputBoxesForColor.filter((e) => e.key !== key);
      var x = inputValuesForColor.filter((e) => e.id !== key);
      setInputBoxesForColor(m);
      setInputValuesForColor(x);
    }
    if (type === "size") {
      var m = inputBoxesForSize.filter((e) => e.key !== key);
      var x = inputValuesForSize.filter((e) => e.id !== key);
      setInputBoxesForSize(m);
      setInputValuesForSize(x);
    }
  };

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };

  const uploadSpec = [];
  const uploadFeatures = [];
  const RegisterProduct = async () => {
    await inputValuesForSpecific.map((el, index) => {
      uploadSpec.push({ title: el.title, description: el.description });
    });
    await inputValuesForFeature.map((el, index) => {
      uploadFeatures.push({ title: el.title, description: el.description });
    });
    const headers = {
      jwt: await SecureStore.getItemAsync("jwt"),
    };
    const uploadData = {
      ...productData,
      imageGallery: singleMultipleImage,
      bannerImage: singleBanner,
      dealOfTheDay: isEnabled,
      features: uploadFeatures,
      specification: uploadSpec,
    };
    await axios({
      method: "post",
      url: `${BASE_URL}product`,
      headers: headers,
      data: uploadData,
    })
      .then((res) => {
        if (res.data.status === "Success") {
          alert("Product Successfully added.");
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

  const uploadColorProduct = [];

  const RegisterProductForColor = async () => {
    console.log(imageArray);
    console.log(checkImageArray);
    console.log(multipleImageArray);

    await inputValuesForSpecific.map((el, index) => {
      uploadSpec.push({ title: el.title, description: el.description });
    });
    await inputValuesForFeature.map((el, index) => {
      uploadFeatures.push({ title: el.title, description: el.description });
    });

    await inputValuesForColor.map((el, index) => {
      imageArray.map((el2, index2) => {
        if (el2.id === el.id) {
          multipleImageArray.map((el3, index3) => {
            if (el3.id === el2.id) {
              uploadColorProduct.push({
                color: el.color,
                subDetails: [
                  {
                    price: el.subDetails[0]?.price,
                    discountPrice: el.subDetails[0]?.discountPrice,
                  },
                ],
                imageGallery: el3.imageGallery,
                bannerImage: el2.bannerImage,
              });
            }
          });
        }
      });
    });

    const headers = {
      jwt: await SecureStore.getItemAsync("jwt"),
    };
    const uploadData = {
      ...productData,
      productDetails: uploadColorProduct,
      dealOfTheDay: isEnabled,
      features: uploadFeatures,
      specification: uploadSpec,
    };
    // console.log(uploadData);
    await axios({
      method: "post",
      url: `${BASE_URL}product`,
      headers: headers,
      data: uploadData,
    })
      .then((res) => {
        if (res.data.status === "Success") {
          alert("Product Successfully added.");
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

  const RegisterProductForSize = async (type) => {
    const headers = {
      jwt: await SecureStore.getItemAsync("jwt"),
    };
    const onlySizeProduct = [
      {
        bannerImage: sizeImage,
        imageGallery: sizeImages,
        subDetails: onlySize,
      },
    ];
    const uploadData = {
      ...productData,
      productDetails: type === "sizeOnly" ? onlySizeProduct : colorWithSize,
      dealOfTheDay: isEnabled,
      features: features,
      specification: specification,
    };
    // console.log(uploadData);
    await axios({
      method: "post",
      url: `${BASE_URL}product`,
      headers: headers,
      data: uploadData,
    })
      .then((res) => {
        if (res.data.status === "Success") {
          alert("Product Successfully added.");
          setColorWithSize([]);
          setOnlySize([]);
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

  const [onlySize, setOnlySize] = useState([]);
  const [sizeImage, setSizeImage] = useState("");
  const [sizeImages, setSizeImages] = useState([]);
  const [features, setFeatures] = useState([]);
  const [specification, setSpecification] = useState([]);
  const [colorIndex, setColorIndex] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(0);
  const [colorWithSize, setColorWithSize] = useState([]);
  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [price, setPrice] = useState(null);
  const [disPrice, setDisPrice] = useState(null);

  useEffect(() => {
    GetCategories();
  }, []);

  return (
    <SafeAreaView
      style={[CommonStyle.container, { backgroundColor: Colors.WEIGHT_COLOR }]}
    >
      <Header navigation={navigation} />
      {imgIndicator2 ? (
        <View
          style={{
            position: "absolute",
            // top: Dimensions.get("window").height / 2 + 50,
            // right: Dimensions.get("window").width / 2,
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
            onChangeValue={(val) => {
              setProductData({ ...productData, categorie: val });
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
              padding: 5,
              marginTop: 10,
            },
          ]}
        >
          <TextInput
            style={{ paddingStart: 20 }}
            placeholder="Product Name"
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
              padding: 5,
              marginTop: 10,
            },
          ]}
        >
          <TextInput
            style={{ paddingStart: 20 }}
            placeholder="Description"
            onChangeText={(val) =>
              setProductData({ ...productData, description: val })
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
              padding: 5,
              marginTop: 10,
            },
          ]}
        >
          <TextInput
            style={{ paddingStart: 20 }}
            placeholder="Regulars Price"
            onChangeText={(val) =>
              setProductData({ ...productData, price: val })
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
              padding: 5,
              marginTop: 10,
            },
          ]}
        >
          <TextInput
            style={{ paddingStart: 20 }}
            placeholder="Discounted Price"
            onChangeText={(val) =>
              setProductData({ ...productData, discountPrice: val })
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

        {valueProductType === "single" ? (
          <View>
            <Text style={[CommonStyle.title_text, { marginTop: 10 }]}>
              Banner Image
            </Text>
            <TouchableOpacity
              onPress={() => DocumentPiker("single")}
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
                  borderWidth: singleBanner !== "" ? 5 : 1,
                  borderColor:
                    singleBanner !== ""
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
              {singleMultipleTemp.map((el, index) => {
                // console.log(el);
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
                      source={{ uri: el.uri }}
                      resizeMode="contain"
                    ></Image>
                  </View>
                );
              })}
            </View>
            <TouchableOpacity
              onPress={() => DocumentPiker("single", "images")}
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
          </View>
        ) : valueProductType === "colorOnly" ? (
          <View>
            {inputBoxesForColor.map((item, index) => (
              <View key={item.key}>
                <View style={[CommonStyle.flex_spacebetween]}>
                  <Text>{index + 1}</Text>
                  <TouchableOpacity
                    onPress={() => DeleteBoxes(item.key, "color")}
                  >
                    <Text style={{ color: "red" }}>Del.</Text>
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
                      padding: 5,
                      marginTop: 10,
                    },
                  ]}
                >
                  <TextInput
                    style={{ paddingStart: 20 }}
                    placeholder="Color"
                    onChangeText={(text) =>
                      handleInputForColor("color", text, index, item.key)
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
                      padding: 5,
                      marginTop: 10,
                    },
                  ]}
                >
                  <TextInput
                    style={{ paddingStart: 20 }}
                    placeholder="Regulars Price"
                    onChangeText={(text) =>
                      handleInputForColor("rprice", text, index, item.key)
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
                      padding: 5,
                      marginTop: 10,
                    },
                  ]}
                >
                  <TextInput
                    style={{ paddingStart: 20 }}
                    placeholder="Discounted Price"
                    onChangeText={(text) =>
                      handleInputForColor("dprice", text, index, item.key)
                    }
                  ></TextInput>
                </View>
                <Text style={[CommonStyle.title_text, { marginTop: 10 }]}>
                  Banner Image
                </Text>
                <TouchableOpacity
                  onPress={() => DocumentPiker(item.key, "banner")}
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
                      borderWidth: !!imageArray.find(
                        (elx, indexx) => elx.id === item.key
                      )
                        ? 5
                        : 1,
                      borderColor: !!imageArray.find(
                        (elx, indexx) => elx.id === item.key
                      )
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
                  {multipleImageArray.map((ela, indexa) => {
                    if (ela.id === item.key) {
                      return ela.imageGallery?.map((ela2, indexa2) => {
                        return (
                          <View
                            key={indexa2}
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
                              source={{ uri: ela2 }}
                              resizeMode="contain"
                            ></Image>
                          </View>
                        );
                      });
                    }
                  })}
                </View>
                <TouchableOpacity
                  onPress={() => DocumentPiker(item.key, "images")}
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
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.LIGHT_GRAY,
                    padding: 10,
                  }}
                ></View>
              </View>
            ))}
            <TouchableOpacity
              onPress={() => addTextInput("color")}
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
              <Entypo name="plus" size={24} color="black" />
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: 16,
                  paddingStart: 10,
                }}
                numberOfLines={1}
              >
                Add Color
              </Text>
            </TouchableOpacity>
          </View>
        ) : valueProductType === "sizeOnly" ? (
          <View>
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
                  borderWidth: sizeImage !== "" ? 5 : 1,
                  borderColor:
                    sizeImage !== "" ? Colors.GREEN_COLOR : Colors.LIGHT_GRAY,
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
              {sizeImages.map((el, index) => {
                // console.log(el);
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
              style={{
                borderBottomWidth: 1,
                borderBottomColor: Colors.LIGHT_GRAY,
                padding: 10,
              }}
            ></View>
            {inputBoxesForSize.map((item, index) => (
              <View key={item.key}>
                <View style={[CommonStyle.flex_spacebetween]}>
                  <Text>{index + 1}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      DeleteBoxes(item.key, "size"), onlySize.splice(index + 1);
                      // console.log(onlySize);
                    }}
                  >
                    <Text style={{ color: "red" }}>Del.</Text>
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
                      padding: 5,
                      marginTop: 10,
                    },
                  ]}
                >
                  <TextInput
                    style={{ paddingStart: 20 }}
                    placeholder="Size"
                    onChangeText={(text) => {
                      onlySize[index] = { ...onlySize[index], size: text };
                    }}
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
                      padding: 5,
                      marginTop: 10,
                    },
                  ]}
                >
                  <TextInput
                    style={{ paddingStart: 20 }}
                    placeholder="Regulars Price"
                    onChangeText={(text) => {
                      onlySize[index] = { ...onlySize[index], price: text };
                    }}
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
                      padding: 5,
                      marginTop: 10,
                    },
                  ]}
                >
                  <TextInput
                    style={{ paddingStart: 20 }}
                    placeholder="Discounted Price"
                    onChangeText={(text) => {
                      onlySize[index] = {
                        ...onlySize[index],
                        discountPrice: text,
                      };
                      // console.log(onlySize);
                    }}
                  ></TextInput>
                </View>

                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.LIGHT_GRAY,
                    padding: 10,
                  }}
                ></View>
              </View>
            ))}
            <TouchableOpacity
              onPress={() => addTextInput("size")}
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
              <Entypo name="plus" size={24} color="black" />
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
          </View>
        ) : valueProductType === "colorWithSize" ? (
          <View>
            {colorWithSize.length ? (
              colorWithSize.map((colorT, index1) => {
                return (
                  <View
                    key={index1}
                    style={{
                      width: "100%",
                      borderWidth: 1,
                      borderRadius: 20,
                      borderColor: Colors.LIGHT_GRAY,
                      backgroundColor: Colors.WEIGHT_COLOR,
                      padding: 10,
                      alignItems: "center",
                      elevation: 2,
                    }}
                  >
                    <Text>{colorT.color}</Text>
                    <Text>S</Text>
                  </View>
                );
              })
            ) : (
              <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                No colors added here
              </Text>
            )}
            <View
              style={[
                {
                  borderColor: Colors.MAIN_COLOR,
                  borderWidth: 1,
                  height: 40,
                  width: "100%",
                  borderRadius: 20,
                  padding: 5,
                  marginTop: 10,
                },
              ]}
            >
              <TextInput
                value={color}
                style={{ paddingStart: 20 }}
                placeholder="Color"
                onChangeText={(text) => {
                  setColor(text);
                }}
              ></TextInput>
            </View>
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
                  borderWidth: sizeImage !== "" ? 5 : 1,
                  borderColor:
                    sizeImage !== "" ? Colors.GREEN_COLOR : Colors.LIGHT_GRAY,
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
              {sizeImages.map((el, index) => {
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
            <Text style={{ textAlign: "center", margin: 10 }}>
              Add multiple size for single color
            </Text>
            {onlySize.length ? (
              onlySize.map((list, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      width: "100%",
                      borderWidth: 1,
                      borderRadius: 20,
                      borderColor: Colors.LIGHT_GRAY,
                      backgroundColor: Colors.WEIGHT_COLOR,
                      padding: 10,
                      alignItems: "center",
                      elevation: 2,
                    }}
                  >
                    <Text>{list.size}</Text>
                    <View style={[CommonStyle.flex]}>
                      <Text style={{ textDecorationLine: "line-through" }}>
                        Rs.{list.price}
                      </Text>
                      <Text style={{ color: Colors.GREEN_COLOR }}>
                        {" "}
                        Rs.{list.discountPrice}
                      </Text>
                    </View>
                  </View>
                );
              })
            ) : (
              <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                No colors added here
              </Text>
            )}
            <View
              style={[
                {
                  borderColor: Colors.MAIN_COLOR,
                  borderWidth: 1,
                  height: 40,
                  width: "100%",
                  borderRadius: 20,
                  padding: 5,
                  marginTop: 10,
                },
              ]}
            >
              <TextInput
                value={size}
                style={{ paddingStart: 20 }}
                placeholder="Size"
                onChangeText={(text) => {
                  setSize(text);
                }}
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
                  padding: 5,
                  marginTop: 10,
                },
              ]}
            >
              <TextInput
                value={price}
                style={{ paddingStart: 20 }}
                placeholder="Regulars Price"
                onChangeText={(text) => {
                  setPrice(text);
                }}
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
                  padding: 5,
                  marginTop: 10,
                },
              ]}
            >
              <TextInput
                value={disPrice}
                style={{ paddingStart: 20 }}
                placeholder="Discounted Price"
                onChangeText={(text) => {
                  setDisPrice(text);
                }}
              ></TextInput>
            </View>
            <TouchableOpacity
              onPress={() => {
                onlySize[sizeIndex] = {
                  price: price,
                  size: size,
                  discountPrice: disPrice,
                };
                setSize(null);
                setPrice(null);
                setDisPrice(null);
                setSizeIndex(sizeIndex + 1);
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
            <TouchableOpacity
              onPress={() => {
                colorWithSize[colorIndex] = {
                  color: color,
                  bannerImage: sizeImage,
                  imageGallery: sizeImages,
                  subDetails: onlySize,
                };
                setSizeImage("");
                setColor(null);
                sizeImages.length = 0;
                onlySize.length = 0;
                setColorIndex(colorIndex + 1);
                setSizeIndex(0);
              }}
              style={[
                CommonStyle.flex,
                {
                  width: "50%",
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
          </View>
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
                  DeleteBoxes(item.key, "spec"),
                    specification.splice(index + 1);
                }}
              >
                <Text style={{ color: "red" }}>Del.</Text>
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
                  padding: 5,
                  marginTop: 10,
                },
              ]}
            >
              <TextInput
                style={{ paddingStart: 20 }}
                placeholder="Title"
                onChangeText={(text) => {
                  handleInputChange("title", text, index, item.key),
                    (specification[index] = {
                      ...specification[index],
                      title: text,
                    });
                }}
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
                  padding: 5,
                  marginTop: 10,
                },
              ]}
            >
              <TextInput
                style={{ paddingStart: 20 }}
                placeholder="Value"
                onChangeText={(text) => {
                  handleInputChange("description", text, index, item.key),
                    (specification[index] = {
                      ...specification[index],
                      description: text,
                    });
                }}
              ></TextInput>
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
                  DeleteBoxes(item.key, "feature"), features.splice(index + 1);
                }}
              >
                <Text style={{ color: "red" }}>Del.</Text>
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
                  padding: 5,
                  marginTop: 10,
                },
              ]}
            >
              <TextInput
                style={{ paddingStart: 20 }}
                placeholder="Title"
                onChangeText={(text) => {
                  handleInputChangeFeature("title", text, index, item.key),
                    (features[index] = {
                      ...features[index],
                      title: text,
                    });
                }}
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
                  padding: 5,
                  marginTop: 10,
                },
              ]}
            >
              <TextInput
                style={{ paddingStart: 20 }}
                placeholder="Value"
                onChangeText={(text) => {
                  handleInputChangeFeature(
                    "description",
                    text,
                    index,
                    item.key
                  ),
                    (features[index] = {
                      ...features[index],
                      description: text,
                    });
                }}
              ></TextInput>
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
            if (valueProductType === "single") {
              RegisterProduct();
            } else if (valueProductType === "colorOnly") {
              RegisterProductForColor();
            } else if (valueProductType === "sizeOnly") {
              RegisterProductForSize("sizeOnly");
            } else if (valueProductType === "colorWithSize") {
              RegisterProductForSize("colorWithSize");
            }
            // RegisterProduct();
            // console.log(multipleImageArray);
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
