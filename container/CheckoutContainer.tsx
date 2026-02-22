import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CheckoutComponent from "../component/CheckoutComponent";
import orderingStore from "../store/orderingStore";
import useAuthStore from "../store/useAuthStore";

const CheckoutContainer = ({ navigation }) => {
  const {
    getCart,
    cartItems,
    loading,
    updateQty,
    deleteCartItem,
    getMerchant,
    merchantData,
    clearCart
  } = orderingStore();
  const {saveUserAddress,getProfile,profile} = useAuthStore()

  useEffect(() => {
    getCart();
    getMerchant()
    getProfile()
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
        clearCart={clearCart}
        saveUserAddress={saveUserAddress}
        profile={profile}
        getProfile={getProfile}
      />
    </SafeAreaView>
  );
};

export default CheckoutContainer;
