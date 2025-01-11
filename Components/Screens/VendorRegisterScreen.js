import { StatusBar } from "expo-status-bar";
import {
  CommonStyle,
  HomeStyle,
  ShopScreenStyle,
  OnBordScreen,
} from "../Constents/Style";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Button,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../Constents/Colors";
import Header from "../Header/Header2";
import { BASE_URL } from "../Util/Const";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

import { FirebaseApp } from "../Util/FirebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage(FirebaseApp);

export default function VendorRegister({ navigation }) {
  const [imgIndicator, setImgIndicator] = useState(false);
  const [imgIndicator2, setImgIndicator2] = useState(false);
  const [ImageDocs, setImageDocs] = useState({});
  const [tempAr, setTempAr] = useState([]);
  const [Img, setImg] = useState(false);
  const [multiImURI, setmultiImURI] = useState([]);

  const multiImagePick = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: true,
    });
    if (!result.canceled) {
      if (result.assets?.length < 2) {
        Alert.alert("Please select minimum 2 images");
      } else if (2 <= result.assets?.length && result.assets?.length <= 4) {
        setImg(false);
        setImgIndicator2(true);
        uploadMultiFile(result.assets);
        setTempAr(result.assets);
      } else {
        Alert.alert("Please select 4 images only");
      }
    }
  };

  const uploadMultiFile = async (files) => {
    multiImURI.length = 0;
    await Promise.all(
      files.map(async (el, index) => {
        const res = await fetch(el.uri);
        const blob = await res.blob();
        let date = new Date(); // object of the date class
        timestamp = date.getTime(); // To get the timestamp
        const fileName = Math.floor(Math.random() * timestamp * (22 / 7));
        const storageRef = ref(storage, `cstempvendorimg/${fileName}`);

        uploadBytes(storageRef, blob)
          .then(async (snapshot) => {
            await getDownloadURL(storageRef).then((downloadURL) => {
              multiImURI.push(downloadURL);
              if (files.length === index + 1) {
                setImg(true);
              }
              setImgIndicator2(false);
            });
          })
          .catch((err) => {
            setImgIndicator2(false);
            alert(err);
          });
      })
    );
  };

  const DocumentPiker = async (idType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type:
        idType !== "profile"
          ? ["application/pdf", "application/msword"]
          : ["image/jpeg", "image/png"],
    });
    if (result.type === "success") {
      setImgIndicator(true);
      uploadFile(result.uri, idType);
      // console.log(result);
    }
  };

  const uploadFile = async (file, idType) => {
    const res = await fetch(file);
    const blob = await res.blob();
    const fileName = file.substring(file.lastIndexOf("/") + 1);

    // Create a reference to the Firebase Storage location where you want to upload the file
    const storageRef = ref(storage, `cstempvendorimg/${fileName}`);

    uploadBytes(storageRef, blob)
      .then((snapshot) => {
        // console.log("url");
        getDownloadURL(storageRef).then((downloadURL) => {
          if (idType === "profile") {
            setImageDocs({ ...ImageDocs, profile: downloadURL });
          }
          if (idType === "id") {
            setImageDocs({ ...ImageDocs, id: downloadURL });
          }
          if (idType === "license") {
            setImageDocs({ ...ImageDocs, license: downloadURL });
          }
          setImgIndicator(false);
        });
      })
      .catch((err) => {
        setImgIndicator(false);
        alert(err);
      });
  };

  const [user, setUser] = useState({});
  const [shopData, setShopData] = useState({});

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
        // console.log(res.data);
        if (res.data.status === "Success") {
          if (res.data.docs?.accountVerification === "accepted") {
            navigation.navigate("Second Navigation");
          } else if (res.data.docs?.accountVerification === "requested") {
            navigation.navigate("Vendor Waiting");
          } else if (res.data.docs?.accountVerification === "rejected") {
            navigation.navigate("Vendor Reject");
          }
          setUser(res.data.docs);
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

  const RegisterVendor = async () => {
    const headers = {
      jwt: await SecureStore.getItemAsync("jwt"),
    };
    await axios({
      method: "patch",
      url: `${BASE_URL}user/update-me`,
      headers: headers,
      data: {
        ...shopData,
        shopImage: multiImURI,
        verifyDocuments: [ImageDocs.id, ImageDocs.license],
        profile: ImageDocs.profile,
        name: name === "" ? user.name : name,
        email: email === "" ? user.email : email,
        phone: user.phone,
      },
    })
      .then((res) => {
        if (res.data.status === "Success") {
          navigation.navigate("Vendor Waiting");
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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    GetMe();
  }, []);

  const [activeIndicator, setActiveIndicator] = useState(true);

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
      <ScrollView style={{ padding: 10 }}>
        <View
          style={[
            {
              borderColor: Colors.MAIN_COLOR,
              borderWidth: 1,
              height: 40,
              width: "100%",
              borderRadius: 20,
            },
          ]}
        >
          <TextInput
            style={{ paddingStart: 20 }}
            placeholder="Full Name"
            onChangeText={(val) => setName(val)}
          >
            {user.name}
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
            placeholder="E-mail"
            onChangeText={(val) => setEmail(val)}
          >
            {user.email}
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
            placeholder="Phone Number"
            editable={false}
          >
            {user.phone}
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
            placeholder="Shop Name"
            onChangeText={(val) => setShopData({ ...shopData, shopName: val })}
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
            placeholder="Shop Phone Number"
            onChangeText={(val) => setShopData({ ...shopData, shopPhone: val })}
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
            placeholder="Shop E-mail"
            onChangeText={(val) => setShopData({ ...shopData, shopEmail: val })}
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
            placeholder="Shop Address"
            onChangeText={(val) =>
              setShopData({ ...shopData, shopAddress: val })
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
            placeholder="City"
            onChangeText={(val) => setShopData({ ...shopData, city: val })}
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
            placeholder="State"
            onChangeText={(val) => setShopData({ ...shopData, state: val })}
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
            placeholder="Country"
            onChangeText={(val) => setShopData({ ...shopData, country: val })}
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
            placeholder="Zip Code"
            keyboardType="numeric"
            maxLength={6}
            onChangeText={(val) => setShopData({ ...shopData, zipcode: val })}
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
            placeholder="GST Number"
            onChangeText={(val) => setShopData({ ...shopData, GSTNumber: val })}
          ></TextInput>
        </View>
        {imgIndicator ? (
          <View style={{ margin: 10 }}>
            <ActivityIndicator
              size={"small"}
              color={Colors.MAIN_COLOR}
            ></ActivityIndicator>
          </View>
        ) : null}
        <View style={[CommonStyle.flex_spacearound, { marginTop: 10 }]}>
          <TouchableOpacity
            onPress={() => DocumentPiker("profile")}
            style={{
              width: Dimensions.get("window").width / 4,
              height: Dimensions.get("window").width / 4,
              borderRadius: 10,
              borderColor: ImageDocs.profile
                ? Colors.GREEN_COLOR
                : Colors.MAIN_COLOR,
              borderWidth: ImageDocs.profile ? 5 : 1,
              alignItems: "center",
              justifyContent: "center",
              // backgroundColor: ImageDocs.profile
              //   ? Colors.GREEN_COLOR
              //   : Colors.LIGHT_GRAY,
            }}
          >
            <Image
              style={{ width: "70%", height: "60%" }}
              source={require("../../assets/app-assets/vregister.png")}
              resizeMode="contain"
            ></Image>
            <Text style={{ fontWeight: "bold", fontSize: 12, marginTop: 5 }}>
              Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => DocumentPiker("id")}
            style={{
              width: Dimensions.get("window").width / 4,
              height: Dimensions.get("window").width / 4,
              borderRadius: 10,
              borderColor: ImageDocs.id
                ? Colors.GREEN_COLOR
                : Colors.MAIN_COLOR,
              borderWidth: ImageDocs.id ? 5 : 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{ width: "70%", height: "60%" }}
              source={require("../../assets/app-assets/vregister.png")}
              resizeMode="contain"
            ></Image>
            <Text style={{ fontWeight: "bold", fontSize: 12, marginTop: 5 }}>
              Id Proof
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => DocumentPiker("license")}
            style={{
              width: Dimensions.get("window").width / 4,
              height: Dimensions.get("window").width / 4,
              borderRadius: 10,
              borderColor: ImageDocs.license
                ? Colors.GREEN_COLOR
                : Colors.MAIN_COLOR,
              borderWidth: ImageDocs.license ? 5 : 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{ width: "70%", height: "60%" }}
              source={require("../../assets/app-assets/vregister.png")}
              resizeMode="contain"
            ></Image>
            <Text style={{ fontWeight: "bold", fontSize: 12, marginTop: 5 }}>
              Shop License
            </Text>
          </TouchableOpacity>
        </View>
        {imgIndicator2 ? (
          <View style={{ margin: 10 }}>
            <ActivityIndicator
              size={"small"}
              color={Colors.MAIN_COLOR}
            ></ActivityIndicator>
          </View>
        ) : null}
        <View
          style={[
            CommonStyle.flex_spacearound,
            { flexWrap: "wrap", marginTop: 10 },
          ]}
        >
          {Img &&
            tempAr.map((el, index) => {
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

        <View style={{ marginTop: 10 }}>
          <Button
            title="Upload Shop images"
            color={Colors.GRAY_COLOR}
            onPress={() => multiImagePick()}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            if (
              ImageDocs.hasOwnProperty("id") &&
              ImageDocs.hasOwnProperty("license") &&
              multiImURI.length !== 0
            ) {
              RegisterVendor();
            } else {
              alert("Please Upload Documents.");
            }
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
