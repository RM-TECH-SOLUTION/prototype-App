import React from "react";
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

const { width, height } = Dimensions.get("window");

const LoginComponent = ({
  identity,
  password,
  setIdentity,
  setPassword,
  onLogin,
  onRegister,
  onSkip,
  loading,
  cmsConfig,
}) => {
  return (
    <View style={styles.container}>
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
            {cmsConfig?.subtitle || "Login to continue"}
          </Text>

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
            <AntDesign name="user" size={18} color="#E50914" />
            <TextInput
              style={styles.input}
              placeholder="Email or Phone"
              placeholderTextColor="#aaa"
              value={identity}
              onChangeText={setIdentity}
            />
          </View>

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
            <AntDesign name="lock" size={18} color="#E50914" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  cmsConfig?.buttonColor ||
                  "#E50914",
              },
            ]}
            onPress={onLogin}
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

          <View style={styles.footer}>
            <Text style={{ color: "#ccc" }}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={onRegister}>
              <Text style={styles.registerText}>
                {" "}Register
              </Text>
            </TouchableOpacity>
          </View>

          {cmsConfig?.skipEnabled && (
            <TouchableOpacity
              style={{ marginTop: 20 }}
              onPress={onSkip}
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