import React, { useEffect } from "react";
import { View } from "react-native";
import OrderHistoryScreen from "../component/OrderHistoryScreen";
import useAuthStore from "../store/useAuthStore";
import orderingStore from "../store/orderingStore";

const OrderHistoryContainer = ({ navigation }) => {

  const registerUser = useAuthStore((state) => state.registerUser);
   const {
    orderHistory,
    orderHistoryResponse
    } = orderingStore();

    useEffect(() => {    
        orderHistory()
    }, []);

  return (
    <View style={{ flex: 1 }}>
      <OrderHistoryScreen
      orderHistoryResponse={orderHistoryResponse}
      />
    </View>
  );
};

export default OrderHistoryContainer;
