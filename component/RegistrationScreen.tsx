import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert,
  Image,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import logoImage from "../assets/AR-Fashion.png";

export default function RegistrationScreen({ onLogin, registerUser }) {

  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("Select Your Gender");
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  /* ================= VALIDATION ================= */

  function validate() {
    const e = {};

    if (!name.trim()) e.name = "Name is required";
    if (!phone.trim()) e.phone = "Phone is required";
    else if (!/^\d{7,15}$/.test(phone.trim()))
      e.phone = "Enter valid phone (7–15 digits)";

    if (!email.trim()) e.email = "Email is required";
    else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email.trim()))
      e.email = "Enter valid email";

    if (!password.trim()) e.password = "Password is required";

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

      Alert.alert("Success", "Registered successfully");

      setPassword("");
      setName("");
      setPhone("");
      setEmail("");
      setGender("Select Your Gender");
      setErrors({});

      onLogin && onLogin();
    } catch (error) {
      Alert.alert("Error", "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  /* ================= UI ================= */

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
          <Image source={logoImage} style={styles.logo} />

          <Text style={styles.title}>Register New User</Text>

          {/* Name */}
          <View style={styles.field}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={name}
              onChangeText={setName}
              placeholder="Enter Your Name"
            />
            {errors.name && <Text style={styles.errText}>{errors.name}</Text>}
          </View>

          {/* Phone */}
          <View style={styles.field}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              value={phone}
              keyboardType="phone-pad"
              onChangeText={(t) => setPhone(t.replace(/\s+/g, ""))}
              placeholder="Enter Your Phone"
            />
            {errors.phone && <Text style={styles.errText}>{errors.phone}</Text>}
          </View>

          {/* Email */}
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="Enter Your Email"
            />
            {errors.email && <Text style={styles.errText}>{errors.email}</Text>}
          </View>

          {/* Password */}
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Create Password"
            />
            {errors.password && (
              <Text style={styles.errText}>{errors.password}</Text>
            )}
          </View>

          {/* Gender */}
          <View style={styles.field}>
            <Text style={styles.label}>Gender</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowGenderModal(true)}
            >
              <Text>{gender}</Text>
            </TouchableOpacity>
          </View>

          {/* Gender Modal */}
          <Modal visible={showGenderModal} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                {["Male", "Female", "Other"].map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={styles.modalOption}
                    onPress={() => {
                      setGender(g);
                      setShowGenderModal(false);
                    }}
                  >
                    <Text>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Modal>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text>Already Registered?</Text>
            <TouchableOpacity onPress={onLogin}>
              <Text style={styles.loginText}> Login Now</Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    elevation: 8,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FF8C00",
    marginBottom: 15,
  },
  field: {
    width: "100%",
    marginBottom: 14,
  },
  label: {
    marginBottom: 5,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  inputError: {
    borderColor: "#e53935",
  },
  errText: {
    color: "#e53935",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#FF8C00",
    width: "100%",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    marginTop: 20,
  },
  loginText: {
    color: "#007bff",
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },
  modalOption: {
    paddingVertical: 12,
    alignItems: "center",
  },
});
