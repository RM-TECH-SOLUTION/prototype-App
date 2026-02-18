import React from "react";
import { View } from "react-native";
import RegistrationScreen from "../component/RegistrationScreen";
import useAuthStore from "../store/useAuthStore";

const RegisterContainer = ({ navigation }) => {

  const registerUser = useAuthStore((state) => state.registerUser);

  return (
    <View style={{ flex: 1 }}>
      <RegistrationScreen
        onLogin={() => navigation.replace("Auth")}
        navigation={navigation}
        registerUser={registerUser}
      />
    </View>
  );
};

export default RegisterContainer;
