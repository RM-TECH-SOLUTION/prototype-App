import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function CustomHeader({ uiConfig }) {
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            uiConfig?.headerBgColor || "#000",
        },
      ]}
    >
      <Image
        source={
          uiConfig?.headerLogo
            ? { uri: uiConfig.headerLogo }
            : require("../assets/AR-Fashion.png")
        }
        style={styles.logo}
      />

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Checkout")
        }
      >
        <Ionicons
          name="cart-outline"
          size={26}
          color={
            uiConfig?.headerIconColor ||
            "#E50914"
          }
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
});