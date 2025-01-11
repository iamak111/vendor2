import { Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { CommonStyle } from "../Constents/Style";
import Colors from "../Constents/Colors";
import { MaterialIcons } from "@expo/vector-icons";

const Floating = ({ navigation }) => {
  return (
    <View style={[CommonStyle.floating_button]}>
      <TouchableOpacity
        style={{
          padding: 3,
          borderRadius: 100,
          backgroundColor: Colors.MAIN_COLOR,
        }}
      >
        <MaterialIcons
          name="arrow-drop-up"
          size={40}
          color={Colors.WEIGHT_COLOR}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Floating;
