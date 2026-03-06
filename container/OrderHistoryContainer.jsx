import React from "react";
import { View } from "react-native";
import OrderHistoryScreen from "../component/OrderHistoryScreen";
import useAuthStore from "../store/useAuthStore";

const OrderHistoryContainer = ({ navigation }) => {

  const registerUser = useAuthStore((state) => state.registerUser);

  return (
    <View style={{ flex: 1 }}>
      <OrderHistoryScreen
      />
    </View>
  );
};

export default OrderHistoryContainer;
