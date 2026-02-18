import React from "react";
import { SafeAreaView, Image } from "react-native";
import nutPng from "../assets/AR-Fashion.png";

const CustomHeader = () => {
  return (
    <SafeAreaView
      style={{
        backgroundColor: "#F57C00",
        paddingVertical: 12,
        alignItems: "center",
      }}
    >
      <Image
        source={nutPng}
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
        }}
      />
    </SafeAreaView>
  );
};

export default CustomHeader;
