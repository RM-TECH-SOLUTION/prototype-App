import React from "react";
import { View } from "react-native";
import MerchantInfoComponent from "../component/MerchantInfoComponent";
import useAuthStore from "../store/useAuthStore";

const MerchantInfoContainer = ({ navigation }) => {

  const registerUser = useAuthStore((state) => state.registerUser);

  return (
    <View style={{ flex: 1 }}>
      <MerchantInfoComponent
       merchant={{
    name: "RM Fashion Store",
    phone: "+91 9876543210",
    location: "Hyderabad, Telangana",
    terms: "These are the merchant terms and conditions These are the merchant terms and conditions These are the merchant terms and conditions These are the merchant terms and conditions...",
    policy: "This is the privacy policy for the merchant..."
  }}
      />
    </View>
  );
};

export default MerchantInfoContainer;
