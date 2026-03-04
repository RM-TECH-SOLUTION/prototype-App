import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useSessionStore from "../store/useSessionStore";

const ProfileComponent = ({
  navigation,
  profileData = {},
  uiConfig = {}
}) => {

  const { user, loading, clearSession } = useSessionStore();
  const styles = createStyles(uiConfig);

  /* ================= SHARE REFERRAL ================= */
  console.log(profileData,"profileDataprofileData");
  

  const handleShareReferral = async () => {
    if (!profileData?.referral_code) {
      Alert.alert("Error", "Referral code not available");
      return;
    }

    try {
      await Share.share({
        message: `🎉 Join using my referral code: ${profileData.referral_code}\n\nDownload the app and earn rewards!`
      });
    } catch {
      Alert.alert("Error", "Unable to share referral code");
    }
  };

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

  /* ================= GUEST VIEW ================= */

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.avatarCircle}>
          <Ionicons
            name="person-outline"
            size={30}
            color="#fff"
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

  /* ================= USER VIEW ================= */

  return (
    <View style={styles.container}>

      {/* PROFILE HEADER */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </Text>
        </View>

        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* LOYALTY POINTS */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons
            name="star-outline"
            size={20}
            color={uiConfig?.primaryColor || "#E50914"}
          />
          <Text style={styles.cardText}>
            {profileData?.total_points || 0} Points
          </Text>
        </View>
      </View>

      {/* REFERRAL SECTION */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Your Referral Code</Text>

        <View style={styles.referralBox}>
          <Text style={styles.referralCode}>
            {profileData?.referral_code || "N/A"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShareReferral}
        >
          <Ionicons
            name="share-social-outline"
            size={18}
            color="#fff"
          />
          <Text style={styles.shareText}>
            Share Referral Code
          </Text>
        </TouchableOpacity>
      </View>

      {/* PHONE INFO */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons
            name="call-outline"
            size={18}
            color={uiConfig?.primaryColor || "#E50914"}
          />
          <Text style={styles.cardText}>
            {user.phone || "N/A"}
          </Text>
        </View>
      </View>

      {/* LOGOUT */}
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
      padding: 40,
      alignItems: "center"
    },

    profileHeader: {
      alignItems: "center",
      marginBottom: 20
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

    card: {
      width: "100%",
      backgroundColor: ui?.pageBgColor || "#111",
      padding: 15,
      borderRadius: 14,
      marginTop: 12
    },

    row: {
      flexDirection: "row",
      alignItems: "center"
    },

    cardText: {
      marginLeft: 10,
      fontSize: 15,
      color: ui?.cardTextColor || "#fff"
    },

    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: ui?.cardTextColor || "#fff",
      marginBottom: 10
    },

    referralBox: {
      backgroundColor: ui?.cardBorderColor || "#2A2A2A",
      padding: 12,
      borderRadius: 10,
      alignItems: "center",
      marginBottom: 10
    },

    referralCode: {
      fontSize: 18,
      fontWeight: "800",
      letterSpacing: 2,
      color: ui?.primaryColor || "#E50914"
    },

    shareButton: {
      flexDirection: "row",
      backgroundColor: ui?.primaryColor || "#E50914",
      padding: 12,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center"
    },

    shareText: {
      color: "#fff",
      marginLeft: 8,
      fontWeight: "700"
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