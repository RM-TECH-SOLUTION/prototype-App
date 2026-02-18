import React from "react";
import { View } from "react-native";
import LoginComponent from "../component/LoginComponent";
import useAuthStore from "../store/useAuthStore";

const LoginContainer = ({ navigation }) => {

  const loginUser = useAuthStore((state) => state.loginUser);
  const loading = useAuthStore((state) => state.loading);

  return (
    <View style={{ flex: 1 }}>
      <LoginComponent
        onRegister={() => navigation.replace("Register")}
        navigation={navigation}
        loginUser={loginUser}
        loading={loading}
      />
    </View>
  );
};

export default LoginContainer;




