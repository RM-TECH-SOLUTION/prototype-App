import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Dimensions,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import useCmsStore from "../store/useCmsStore";

const { width, height } = Dimensions.get("window");

export default function RegistrationScreen({
  onLogin,
  registerUser,
}) {
  const { cmsData } = useCmsStore();

  const [cmsConfig, setCmsConfig] = useState({});
  // console.log("Registration CMS Config:", cmsConfig);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("Select Gender");
  const [showGenderModal, setShowGenderModal] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  /* ================= GET CMS ================= */

  useEffect(() => {
    const registerConfig = cmsData?.find(
      (item) => item.modelSlug === "registerConfiguration"
    );

    if (!registerConfig?.cms) return;

    const formatted = Object.keys(
      registerConfig.cms
    ).reduce((acc, key) => {
      acc[key] =
        registerConfig.cms[key]?.fieldValue;
      return acc;
    }, {});

    setCmsConfig(formatted);
  }, [cmsData]);

  /* ================= VALIDATION ================= */

  function validate() {
    const e = {};

    if (!name.trim()) e.name = "Name required";
    if (!phone.trim())
      e.phone = "Phone required";
    if (!email.trim())
      e.email = "Email required";
    if (!password.trim())
      e.password = "Password required";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* ================= SUBMIT ================= */

  async function handleSubmit() {
    if (!validate()) return;

    setLoading(true);
    try {
      await registerUser(
        name.trim(),
        email.trim(),
        phone.trim(),
        password
      );

      Alert.alert(
        "Success",
        "Account created successfully"
      );
      onLogin && onLogin();
    } catch (error) {
      Alert.alert("Error", "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Background */}
      <Image
        source={
          cmsConfig?.backgroundImage
            ? { uri: cmsConfig.backgroundImage }
            : require("../assets/bgHome1.png")
        }
        style={styles.background}
      />

      <View style={styles.overlay} />

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor:
                cmsConfig?.cardBackgroundColor ||
                "rgba(0,0,0,0.8)",
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
          />

          <Text style={styles.title}>
            {cmsConfig?.title ||
              "Create Account"}
          </Text>

          <Text style={styles.subtitle}>
            {cmsConfig?.subtitle ||
              "Join us today"}
          </Text>

          {/* Inputs */}
          {[
            {
              label: "Full Name",
              value: name,
              setter: setName,
              key: "name",
            },
            {
              label: "Phone",
              value: phone,
              setter: setPhone,
              key: "phone",
            },
            {
              label: "Email",
              value: email,
              setter: setEmail,
              key: "email",
            },
            {
              label: "Password",
              value: password,
              setter: setPassword,
              key: "password",
              secure: true,
            },
          ].map((field) => (
            <View
              key={field.key}
              style={styles.field}
            >
              <TextInput
                placeholder={field.label}
                placeholderTextColor="#aaa"
                secureTextEntry={
                  field.secure
                }
                value={field.value}
                onChangeText={
                  field.setter
                }
                style={[
                  styles.input,
                  {
                    borderColor:
                      cmsConfig?.inputBorderColor ||
                      "#E50914",
                  },
                  errors[field.key] &&
                    styles.inputError,
                ]}
              />
              {errors[field.key] && (
                <Text style={styles.errText}>
                  {errors[field.key]}
                </Text>
              )}
            </View>
          ))}

          {/* Gender */}
          {cmsConfig?.genderEnabled && (
            <>
              <TouchableOpacity
                style={[
                  styles.input,
                  {
                    borderColor:
                      cmsConfig?.inputBorderColor ||
                      "#E50914",
                  },
                ]}
                onPress={() =>
                  setShowGenderModal(true)
                }
              >
                <Text style={{ color: "#fff" }}>
                  {gender}
                </Text>
              </TouchableOpacity>

              <Modal
                visible={showGenderModal}
                transparent
                animationType="fade"
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalBox}>
                    {[
                      "Male",
                      "Female",
                      "Other",
                    ].map((g) => (
                      <TouchableOpacity
                        key={g}
                        style={
                          styles.modalOption
                        }
                        onPress={() => {
                          setGender(g);
                          setShowGenderModal(
                            false
                          );
                        }}
                      >
                        <Text>{g}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </Modal>
            </>
          )}

          {/* Button */}
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  cmsConfig?.buttonColor ||
                  "#E50914",
              },
            ]}
            onPress={handleSubmit}
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
                style={{
                  color:
                    cmsConfig?.buttonTextColor ||
                    "#fff",
                  fontWeight: "bold",
                }}
              >
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={{ color: "#ccc" }}>
              Already have account?
            </Text>
            <TouchableOpacity onPress={onLogin}>
              <Text style={styles.loginText}>
                {" "}
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    width,
    height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.65)",
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
    width: 110,
    height: 110,
    alignSelf: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: "#ccc",
    textAlign: "center",
    marginBottom: 20,
  },
  field: {
    width: "100%",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    color: "#fff",
    marginBottom: 10,
  },
  inputError: {
    borderColor: "#ff4d4d",
  },
  errText: {
    color: "#ff4d4d",
    fontSize: 12,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#E50914",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:
      "rgba(0,0,0,0.6)",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
  },
  modalOption: {
    paddingVertical: 15,
    alignItems: "center",
  },
});