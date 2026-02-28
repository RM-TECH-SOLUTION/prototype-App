import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useSessionStore from "../store/useSessionStore";

const ProfileComponent = ({ navigation, uiConfig = {} }) => {
  const { user, loading, clearSession } = useSessionStore();

  const styles = createStyles(uiConfig);

  /* ================= LOADER ================= */

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          size="large"
          color={uiConfig?.primaryColor || "#E50914"}
        />
      </View>
    );
  }

  /* ================= GUEST ================= */

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.avatarCircle}>
          <Ionicons
            name="person-outline"
            size={30}
            color={uiConfig?.primaryColor || "#E50914"}
          />
        </View>

        <Text style={styles.guestTitle}>Hey Guest 👋</Text>
        <Text style={styles.guestSub}>
          Login to manage your account
        </Text>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Auth")}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* ================= USER ================= */

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </Text>
        </View>

        <Text style={styles.name}>
          {user.name || "User"}
        </Text>

        <Text style={styles.email}>
          {user.email}
        </Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons
            name="call-outline"
            size={18}
            color={uiConfig?.primaryColor || "#E50914"}
          />
          <Text style={styles.infoText}>
            {user.phone || "N/A"}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => clearSession()}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileComponent;

/* =========================================================
   DYNAMIC STYLES
========================================================= */

const createStyles = (ui) =>
  StyleSheet.create({

    container: {
      backgroundColor: ui?.cardBgColor || "#1C1C1C",
      alignItems: "center",
      padding: 20,
      marginHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: ui?.cardBorderColor || "#2A2A2A",
      marginBottom: 20
    },

    loaderContainer: {
      padding: 30,
      alignItems: "center"
    },

    profileHeader: {
      alignItems: "center",
      marginBottom: 15
    },

    avatarCircle: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: ui?.primaryColor || "#E50914",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10
    },

    avatarText: {
      fontSize: 26,
      fontWeight: "800",
      color: "#fff"
    },

    name: {
      fontSize: 20,
      fontWeight: "800",
      color: ui?.cardTextColor || "#fff"
    },

    email: {
      fontSize: 14,
      color: ui?.cardTextColor || "#ccc",
      marginTop: 4
    },

    infoCard: {
      width: "100%",
      backgroundColor: ui?.pageBgColor || "#111",
      padding: 14,
      borderRadius: 14,
      marginTop: 10
    },

    infoRow: {
      flexDirection: "row",
      alignItems: "center"
    },

    infoText: {
      fontSize: 15,
      marginLeft: 10,
      color: ui?.cardTextColor || "#fff"
    },

    logoutButton: {
      backgroundColor: ui?.primaryColor || "#E50914",
      paddingVertical: 12,
      paddingHorizontal: 40,
      borderRadius: 14,
      marginTop: 20
    },

    logoutText: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "700"
    },

    guestTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: ui?.cardTextColor || "#fff",
      marginTop: 10
    },

    guestSub: {
      fontSize: 14,
      color: ui?.cardTextColor || "#aaa",
      marginBottom: 15
    },

    loginButton: {
      backgroundColor: ui?.primaryColor || "#E50914",
      paddingVertical: 10,
      paddingHorizontal: 30,
      borderRadius: 14
    },

    loginText: {
      color: "#fff",
      fontWeight: "700"
    }

  });