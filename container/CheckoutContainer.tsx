import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CheckoutComponent from "../component/CheckoutComponent";
import orderingStore from "../store/orderingStore";

const CheckoutContainer = ({ navigation }) => {
  const {
    getCart,
    cartItems,
    loading,
    updateQty,
    deleteCartItem,
    getMerchant,
    merchantData
  } = orderingStore();

  useEffect(() => {
    getCart();
    getMerchant()
  }, []);
  console.log(merchantData,"merchantData");
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:"#F57C00" }}>
      <CheckoutComponent
        navigation={navigation}
        cartItems={cartItems}
        loading={loading}
        updateQty={updateQty}
        deleteCartItem={deleteCartItem}
        getCart={getCart}
        merchantData={merchantData}
      />
    </SafeAreaView>
  );
};

export default CheckoutContainer;
