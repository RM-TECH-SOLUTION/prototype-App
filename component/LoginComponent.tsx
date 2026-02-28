import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import useSessionStore from "../store/useSessionStore";
import useCmsStore from "../store/useCmsStore";

const { width, height } = Dimensions.get("window");

const LoginComponent = ({
  onRegister,
  navigation,
  loginUser,
  loading,
}) => {
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [cmsConfig, setCmsConfig] = useState({});

  const { isLoggedIn } = useSessionStore();
  const { cmsData } = useCmsStore();

  useEffect(() => {
    if (isLoggedIn) {
      navigation.replace("Home");
    }
  }, [isLoggedIn]);

  // 🔥 Get CMS Login Config
  useEffect(() => {
    const loginConfig = cmsData?.find(
      (item) => item.modelSlug === "loginConfiguration"
    );

    if (!loginConfig?.cms) return;

    const formatted = Object.keys(loginConfig.cms).reduce(
      (acc, key) => {
        acc[key] = loginConfig.cms[key]?.fieldValue;
        return acc;
      },
      {}
    );

    setCmsConfig(formatted);
  }, [cmsData]);

  return (
    <View style={styles.container}>
      {/* Background */}
      <Image
        source={
          cmsConfig?.backgroundImage
            ? { uri: cmsConfig.backgroundImage }
            : require("../assets/bgHome1.png")
        }
        style={styles.background}
        resizeMode="cover"
      />

      <View style={styles.overlay} />

      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContainer}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor:
                cmsConfig?.cardBackgroundColor ||
                "rgba(0,0,0,0.75)",
            },
          ]}
        >
          {/* Logo */}
          <Image
            source={
              cmsConfig?.logoImage
                ? { uri: cmsConfig.logoImage }
                : require("../assets/AR-Fashion.png")
            }
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>
            {cmsConfig?.title || "Welcome Back"}
          </Text>

          <Text style={styles.subtitle}>
            {cmsConfig?.subtitle ||
              "Login to continue"}
          </Text>

          {/* Identity */}
          <View
            style={[
              styles.inputContainer,
              {
                borderColor:
                  cmsConfig?.inputBorderColor ||
                  "#E50914",
              },
            ]}
          >
            <AntDesign
              name="user"
              size={18}
              color="#E50914"
            />
            <TextInput
              style={styles.input}
              placeholder="Email or Phone"
              placeholderTextColor="#aaa"
              value={identity}
              onChangeText={setIdentity}
            />
          </View>

          {/* Password */}
          <View
            style={[
              styles.inputContainer,
              {
                borderColor:
                  cmsConfig?.inputBorderColor ||
                  "#E50914",
              },
            ]}
          >
            <AntDesign
              name="lock"
              size={18}
              color="#E50914"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  cmsConfig?.buttonColor ||
                  "#E50914",
              },
            ]}
            onPress={() =>
              loginUser(identity, password)
            }
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator
                color={
                  cmsConfig?.buttonTextColor ||
                  "#fff"
                }
              />
            ) : (
              <Text
                style={[
                  styles.buttonText,
                  {
                    color:
                      cmsConfig?.buttonTextColor ||
                      "#fff",
                  },
                ]}
              >
                Login
              </Text>
            )}
          </TouchableOpacity>

          {/* Register */}
          <View style={styles.footer}>
            <Text style={{ color: "#ccc" }}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={onRegister}>
              <Text style={styles.registerText}>
                {" "}
                Register
              </Text>
            </TouchableOpacity>
          </View>

          {/* Skip */}
          {cmsConfig?.skipEnabled && (
            <TouchableOpacity
              style={{ marginTop: 20 }}
              onPress={() =>
                navigation.replace("Home")
              }
            >
              <Text style={styles.skipText}>
                Skip
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default LoginComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    width,
    height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    padding: 25,
    borderRadius: 25,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 18,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: "#fff",
  },
  button: {
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registerText: {
    color: "#E50914",
    fontWeight: "bold",
  },
  skipText: {
    color: "#E50914",
    textAlign: "center",
  },
});