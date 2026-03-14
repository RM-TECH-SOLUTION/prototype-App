import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import orderingStore from "../store/orderingStore";

export default function CustomHeader({ uiConfig }) {
  const navigation = useNavigation();
  const { cartItems } = orderingStore();

  const cartLength = cartItems.length;

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: uiConfig?.headerBgColor || "#000",
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
        style={styles.cartContainer}
        onPress={() => navigation.navigate("Checkout")}
      >
        <Ionicons
          name="cart-outline"
          size={26}
          color={uiConfig?.headerIconColor || "#E50914"}
        />

        {cartLength > 0 && (
          <View style={[styles.badge,{backgroundColor:"#000",borderWidth:1,borderColor:uiConfig?.headerIconColor}]}>
            <Text style={{color:uiConfig?.headerIconColor}}>{cartLength}</Text>
          </View>
        )}
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

  cartContainer: {
    position: "relative",
  },

  badge: {
    position: "absolute",
    top: -6,
    right: -8,
    backgroundColor: "#ff3b30",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },

  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
});