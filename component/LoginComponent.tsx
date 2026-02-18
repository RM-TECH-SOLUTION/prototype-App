import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import logoImage from "../assets/AR-Fashion.png";
import useSessionStore from "../store/useSessionStore";

const { width, height } = Dimensions.get("window");

const LoginComponent = ({
  onRegister,
  navigation,
  loginUser,
  loading
}) => {

  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");

  const { isLoggedIn } = useSessionStore();


  useEffect(() => {
    if (isLoggedIn) {
      navigation.replace("Home");
    }
  }, [isLoggedIn]);

  return (
    <LinearGradient
      colors={["#E65100", "#FFB74D"]}
      style={styles.gradientContainer}
    >
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={120}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.innerContainer}>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image source={logoImage} style={styles.logo} />
          </View>

          <Text style={styles.title}>Welcome Back 👋</Text>
          <Text style={styles.subtitle}>Login to continue</Text>

          {/* Email / Phone */}
          <View style={styles.inputContainer}>
            <AntDesign name="mail" size={20} color="#007bff" />
            <TextInput
              style={styles.input}
              placeholder="Email or Phone"
              autoCapitalize="none"
              value={identity}
              onChangeText={setIdentity}
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <AntDesign name="lock" size={20} color="#007bff" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => loginUser(identity, password)}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          {/* Register */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={onRegister}>
              <Text style={styles.registerText}> Register</Text>
            </TouchableOpacity>
          </View>

          {/* Skip */}
          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={() => navigation.replace("Home")}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

export default LoginComponent;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  gradientContainer: {
    width,
    height,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "85%",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    elevation: 8,
  },
  logoContainer: {
    marginBottom: 15,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF8C00",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#f5f6fa",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 18,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#FF8C00",
    width: "100%",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    marginTop: 20,
  },
  footerText: {
    color: "#555",
  },
  registerText: {
    color: "#007bff",
    fontWeight: "600",
  },
  skipText: {
    color: "red",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
});
