import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AddAddressComponent from "./AddAddressComponent";
import useAuthStore from "../store/useAuthStore";

const SavedAddressComponent = () => {
  const navigation = useNavigation();
  const { profile,getProfile,saveUserAddress } = useAuthStore();
  const profileAddress = profile?.address;

  const [address, setAddress] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);

  /* ---------------- PREFILL ---------------- */

  useEffect(() => {
    if (profileAddress) {
      setAddress({
        ...profileAddress,
        id: "profile-address",
      });
    }
  }, [profileAddress]);

  /* ---------------- SAVE ---------------- */

  const handleSaveAddress = (newAddress) => {
    setAddress({
      ...newAddress,
      id: "profile-address",
    });
    saveUserAddress(newAddress)
    setEditingAddress(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar backgroundColor="#FF8C00" barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Delivery Address</Text>

        <View style={{ width: 26 }} />
      </View>

      {/* ADDRESS CARD */}
      <View style={styles.content}>
        {address ? (
          <View style={styles.card}>
            <View style={styles.row}>
              <Ionicons name="location" size={20} color="#FF8C00" />
              <Text style={styles.cardTitle}>Saved Address</Text>
            </View>

            <Text style={styles.name}>{address.building}</Text>

            <Text style={styles.details}>
              {address.doorNo}, {address.street}
            </Text>

            {address.landmark ? (
              <Text style={styles.details}>{address.landmark}</Text>
            ) : null}

            <Text style={styles.details}>
              {address.city} - {address.pincode} - {address.state}
            </Text>

          </View>
        ) : (
          <Text style={styles.emptyText}>No address added yet</Text>
        )}
      </View>

      {/* ADD / EDIT BUTTON */}
      <View style={{ marginBottom: 40 }}>
        <AddAddressComponent
          onSave={handleSaveAddress}
          initialData={editingAddress}
          buttonText={address ? "Edit Delivery Address" : "Add Delivery Address"}
          getProfile={getProfile}
        />
      </View>
    </SafeAreaView>
  );
};

export default SavedAddressComponent;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  header: {
    backgroundColor: "#FF8C00",
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  content: {
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
    color: "#FF8C00",
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
  },

  details: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },

  editBtn: {
    marginTop: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF8C00",
    alignItems: "center",
  },

  editText: {
    color: "#FF8C00",
    fontWeight: "700",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#999",
    fontSize: 15,
  },
});