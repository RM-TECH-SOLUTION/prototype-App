import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Linking
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import useCmsStore from "../store/useCmsStore";

const MerchantInfoComponent = ({ merchant }) => {

  const navigation = useNavigation();
  const { cmsData } = useCmsStore();

  const [activeTab, setActiveTab] = useState("terms");
  const [uiConfig, setUiConfig] = useState({});

  /* ================= CMS ================= */

  useEffect(() => {
    if (!Array.isArray(cmsData)) return;

    const config = cmsData.find(
      (item) => item.modelSlug === "merchantInfoPageConfiguration"
    );

    if (!config?.cms) return;

    const formatted = Object.values(config.cms).reduce((acc, field) => {
      acc[field.fieldKey] = field.fieldValue;
      return acc;
    }, {});

    setUiConfig(formatted);

  }, [cmsData]);

  const styles = createStyles(uiConfig);

  /* ================= ACTIONS ================= */

  const openPhone = () => {
    Linking.openURL(`tel:${merchant?.phone}`);
  };

  const openMap = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${merchant?.location}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>

      <StatusBar
        backgroundColor={uiConfig?.headerBgColor || "#111"}
        barStyle="light-content"
      />

      {/* HEADER */}

      <View style={styles.header}>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={26}
            color={uiConfig?.headerTextColor || "#fff"}
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          Merchant Info
        </Text>

        <View style={{ width: 26 }} />

      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>

        {/* MERCHANT CARD */}

        <View style={styles.card}>

          <Text style={styles.merchantName}>
            {merchant?.name}
          </Text>

          <TouchableOpacity style={styles.row} onPress={openPhone}>
            <Ionicons
              name="call"
              size={18}
              color={uiConfig?.primaryColor || "#E50914"}
            />
            <Text style={styles.text}>{merchant?.phone}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={openMap}>
            <Ionicons
              name="location"
              size={18}
              color={uiConfig?.primaryColor || "#E50914"}
            />
            <Text style={styles.text}>{merchant?.location}</Text>
          </TouchableOpacity>

        </View>

        {/* TABS */}

        <View style={styles.tabs}>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "terms" && styles.activeTab
            ]}
            onPress={() => setActiveTab("terms")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "terms" && styles.activeTabText
              ]}
            >
              Terms & Conditions
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "policy" && styles.activeTab
            ]}
            onPress={() => setActiveTab("policy")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "policy" && styles.activeTabText
              ]}
            >
              Privacy Policy
            </Text>
          </TouchableOpacity>

        </View>

        {/* TAB CONTENT */}

        <View style={styles.contentCard}>

          {activeTab === "terms" && (
            <Text style={styles.description}>
              {merchant?.terms || "No terms available"}
            </Text>
          )}

          {activeTab === "policy" && (
            <Text style={styles.description}>
              {merchant?.policy || "No policy available"}
            </Text>
          )}

        </View>

      </ScrollView>

    </SafeAreaView>
  );
};

export default MerchantInfoComponent;


/* =========================================================
   STYLES
========================================================= */

const createStyles = (ui) =>
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: ui?.pageBgColor || "#0F0F0F"
    },

    header: {
      backgroundColor: ui?.headerBgColor || "#111",
      paddingHorizontal: 18,
      paddingVertical: 18,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },

    title: {
      color: ui?.headerTextColor || "#fff",
      fontSize: 18,
      fontWeight: "800"
    },

    card: {
      backgroundColor: ui?.cardBgColor || "#1C1C1C",
      padding: 20,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: ui?.cardBorderColor || "#2A2A2A",
      marginBottom: 20
    },

    merchantName: {
      fontSize: 18,
      fontWeight: "800",
      marginBottom: 12,
      color: ui?.cardTextColor || "#fff"
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8
    },

    text: {
      marginLeft: 8,
      fontSize: 14,
      color: ui?.cardTextColor || "#ccc"
    },

    tabs: {
      flexDirection: "row",
      marginBottom: 12
    },

    tab: {
      flex: 1,
      paddingVertical: 12,
      borderBottomWidth: 2,
      borderBottomColor: "transparent",
      alignItems: "center"
    },

    activeTab: {
      borderBottomColor: ui?.primaryColor || "#E50914"
    },

    tabText: {
      color: "#888",
      fontSize: 14
    },

    activeTabText: {
      color: ui?.primaryColor || "#E50914",
      fontWeight: "700"
    },

    contentCard: {
      backgroundColor: ui?.cardBgColor || "#1C1C1C",
      padding: 18,
      borderRadius: 16
    },

    description: {
      fontSize: 14,
      lineHeight: 22,
      color: ui?.cardTextColor || "#ccc"
    }

  });