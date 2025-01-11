import { StatusBar } from "expo-status-bar";
import { CommonStyle, OnBordScreen, LoginStyle } from "../Constents/Style";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../Constents/Colors";
import Header2 from "../Header/Header2";
import { ScrollView } from "react-native-gesture-handler";
import {
  MaterialIcons,
  FontAwesome5,
  Entypo,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";

import { BASE_URL } from "../Util/Const";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import { FirebaseApp } from "../Util/FirebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
const storage = getStorage(FirebaseApp);
export default function AccountScreen({ navigation }) {
  const [activeIndicator, setActiveIndicator] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imgIndicator, setImgIndicator] = useState(false);

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

  const Update = async () => {
    const headers = {
      jwt: await SecureStore.getItemAsync("jwt"),
    };
    await axios({
      method: "PATCH",
      url: `${BASE_URL}user/update-me`,
      headers: headers,
      data: {
        name: name ? name : userData.name,
        email: email ? email : userData.email,
        profile: pickedDocument !== null ? pickedDocument : userData.profile,
      },
    })
      .then((res) => {
        if (res.data.status === "Success") {
          alert("Updated Successfully");
          setModalVisible(!modalVisible);
          GetMe();
          setName(null);
          setEmail(null);
          setPickedDocument(null);
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

  const [pickedDocument, setPickedDocument] = useState(null);

  // Function to pick a document
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/jpeg", "image/png"],
      });

      if (result.type === "success") {
        setImgIndicator(true);
        uploadFile(result.uri);
      } else {
        // Handle the cancel or any errors here
        alert("Document picking canceled or failed.");
      }
    } catch (err) {
      console.error("Error while picking a document:", err);
    }
  };

  const uploadFile = async (file) => {
    const res = await fetch(file);
    const blob = await res.blob();
    let date = new Date(); // object of the date class
    timestamp = date.getTime(); // To get the timestamp
    const fileName = Math.floor(Math.random() * timestamp * (22 / 7));
    // Create a reference to the Firebase Storage location where you want to upload the file
    const storageRef = ref(storage, `cstempvendorimg/${fileName}`);
    uploadBytes(storageRef, blob)
      .then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          setPickedDocument(downloadURL);
          setImgIndicator(false);
        });
      })
      .catch((err) => {
        setImgIndicator(false);
        alert(err);
      });
  };

  useEffect(() => {
    GetMe();
  }, []);

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
      style={[CommonStyle.container, { backgroundColor: Colors.MAIN_COLOR }]}
    >
      <Header2 navigation={navigation} />

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View style={CommonStyle.modalView}>
            <TouchableOpacity
              onPress={() => setModalVisible(!modalVisible)}
              style={{ alignSelf: "flex-end" }}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={[CommonStyle.title_text]}>Update Profile</Text>
            <View
              style={[
                CommonStyle.mt_20,
                CommonStyle.w_75,
                CommonStyle.alignSelf,
              ]}
            >
              <TextInput
                inputMode="text"
                textAlign="left"
                style={[CommonStyle.text_input]}
                placeholder="Name"
                onChangeText={(val) => setName(val)}
              >
                {userData.name}
              </TextInput>
              <TextInput
                inputMode="email"
                textAlign="left"
                style={[CommonStyle.text_input, CommonStyle.mt_10]}
                placeholder="example@gmail.com"
                onChangeText={(val) => setEmail(val)}
              >
                {userData.email}
              </TextInput>
              {pickedDocument !== null && !imgIndicator ? (
                <View style={{ marginTop: 10 }}>
                  <Image
                    style={{ width: 100, height: 100, alignSelf: "center" }}
                    resizeMode="contain"
                    source={{ uri: pickedDocument }}
                  ></Image>
                </View>
              ) : imgIndicator ? (
                <View style={{ marginTop: 10 }}>
                  <ActivityIndicator
                    size={"small"}
                    color={Colors.MAIN_COLOR}
                  ></ActivityIndicator>
                </View>
              ) : null}

              <View style={{ marginTop: 10 }}>
                <Button
                  title="Upload Profile"
                  color={Colors.GRAY_COLOR}
                  onPress={() => pickDocument()}
                />
              </View>
            </View>
            <TouchableOpacity
              style={{ width: "100%" }}
              onPress={() => Update()}
            >
              <Text
                style={[
                  CommonStyle.button_dark,
                  CommonStyle.mt_20,
                  { width: "50%" },
                ]}
              >
                Update
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ScrollView>
        <View style={[OnBordScreen.background_box]}></View>
        <View
          style={[
            OnBordScreen.first_half,
            CommonStyle.position_relative,
            { height: 270, paddingTop: 40 },
          ]}
        >
          {userData?.profile === null ? (
            <Image
              style={[
                OnBordScreen.img,
                { width: 120, height: 120, borderRadius: 60 },
              ]}
              source={require("../../assets/app-assets/user.png")}
            ></Image>
          ) : (
            <Image
              style={[
                OnBordScreen.img,
                { width: 120, height: 120, borderRadius: 60 },
              ]}
              source={{ uri: userData.profile }}
            ></Image>
          )}

          <Text style={[OnBordScreen.title, { color: "black" }]}>
            {userData.name}
          </Text>
          <Text style={[{ textAlign: "center", fontSize: 18 }]}>
            {userData.phone}
          </Text>
          <Text style={[OnBordScreen.des, { color: "black" }]}>
            {userData?.email ? `(${userData?.email})` : null}
          </Text>

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={[OnBordScreen.edit_button]}
          >
            <Entypo name="edit" size={20} color={Colors.WEIGHT_COLOR} />
          </TouchableOpacity>
        </View>
        <View style={[OnBordScreen.second_half, { paddingStart: 30 }]}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Order List")}
            style={[CommonStyle.flex, { marginTop: 40 }]}
          >
            <FontAwesome5
              style={{ marginEnd: 13 }}
              name="box-open"
              size={24}
              color={Colors.WEIGHT_COLOR}
            />
            <Text
              style={{
                fontSize: 18,
                color: Colors.WEIGHT_COLOR,
              }}
            >
              Management Order
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Product List")}
            style={[CommonStyle.flex, { marginTop: 20 }]}
          >
            <Entypo
              style={{ marginEnd: 15 }}
              name="location"
              size={24}
              color={Colors.WEIGHT_COLOR}
            />
            <Text
              style={{
                fontSize: 18,
                color: Colors.WEIGHT_COLOR,
              }}
            >
              Management Products
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("About Screen")}
            style={[CommonStyle.flex, { marginTop: 20 }]}
          >
            <FontAwesome5
              style={{ marginEnd: 15 }}
              name="exclamation-circle"
              size={24}
              color={Colors.WEIGHT_COLOR}
            />
            <Text
              style={{
                fontSize: 18,
                color: Colors.WEIGHT_COLOR,
              }}
            >
              About Us
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("About Screen")}
            style={[CommonStyle.flex, { marginTop: 20 }]}
          >
            <MaterialIcons
              style={{ marginEnd: 15 }}
              name="privacy-tip"
              size={24}
              color={Colors.WEIGHT_COLOR}
            />
            <Text
              style={{
                fontSize: 18,
                color: Colors.WEIGHT_COLOR,
              }}
            >
              Privacy policy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Support Screen")}
            style={[CommonStyle.flex, { marginTop: 20 }]}
          >
            <MaterialIcons
              style={{ marginEnd: 15 }}
              name="support-agent"
              size={24}
              color={Colors.WEIGHT_COLOR}
            />
            <Text
              style={{
                fontSize: 18,
                color: Colors.WEIGHT_COLOR,
              }}
            >
              Support
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              await SecureStore.deleteItemAsync("jwt");
              navigation.replace("Login");
            }}
            style={[CommonStyle.flex, { marginTop: 20 }]}
          >
            <FontAwesome5
              style={{ marginEnd: 15 }}
              name="power-off"
              size={24}
              color={Colors.WEIGHT_COLOR}
            />
            <Text
              style={{
                fontSize: 18,
                color: Colors.WEIGHT_COLOR,
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <StatusBar style="light" backgroundColor={Colors.MAIN_COLOR} />
    </SafeAreaView>
  );
}
