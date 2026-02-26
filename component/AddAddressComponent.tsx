import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

const AddAddressComponent = ({ onSave, getProfile }) => {

  const [showModal, setShowModal] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const SERVICEABLE_PINCODES = [
    "502032",
    "500002",
    "500003",
    "500004"
  ];

  /* ✅ Added state field */
  const [address, setAddress] = useState({
    building: "",
    doorNo: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: ""
  });

  /* ---------------- LIVE LOCATION ---------------- */

  const getLiveLocation = async () => {
    try {
      setLoadingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Location permission denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      if (addressResponse.length > 0) {
        const loc = addressResponse[0];

        setAddress({
          building: loc.name || "",
          doorNo: "",
          street: loc.street || "",
          landmark: "",
          city: loc.city || loc.subregion || "",
          state: loc.region || "",   // ✅ auto fill state
          pincode: loc.postalCode || ""
        });
      }
    } catch (error) {
      alert("Unable to fetch location");
    } finally {
      setLoadingLocation(false);
    }
  };

  /* ---------------- SAVE ---------------- */

  const handleSave = () => {
    if (
      !address.building ||
      !address.doorNo ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (!SERVICEABLE_PINCODES.includes(address.pincode)) {
      alert("Service not available in this area");
      return;
    }

    onSave(address);
    setShowModal(false);

    // reset form
    setAddress({
      building: "",
      doorNo: "",
      street: "",
      landmark: "",
      city: "",
      state: "",
      pincode: ""
    });
  };

  return (
    <View>

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.addText}>+ Add Delivery Address</Text>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View style={styles.modalContainer}>
              <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>

                {/* HEADER */}
                <View style={styles.header}>
                  <Text style={styles.heading}>Delivery Address</Text>

                  <TouchableOpacity
                    onPress={() => {
                      setShowModal(false);
                      getProfile && getProfile();
                    }}
                  >
                    <Ionicons name="close" size={22} color="#333" />
                  </TouchableOpacity>
                </View>

                {/* LIVE LOCATION */}
                <TouchableOpacity
                  style={styles.locationBtn}
                  onPress={getLiveLocation}
                >
                  {loadingLocation ? (
                    <ActivityIndicator color="#FF8C00" />
                  ) : (
                    <>
                      <Ionicons
                        name="location-outline"
                        size={18}
                        color="#FF8C00"
                      />
                      <Text style={styles.locationText}>
                        Use Live Location
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* INPUTS */}

                <TextInput
                  placeholder="Building / Apartment Name"
                  style={styles.input}
                  value={address.building}
                  onChangeText={(text) =>
                    setAddress({ ...address, building: text })
                  }
                />

                <TextInput
                  placeholder="Door No"
                  style={styles.input}
                  value={address.doorNo}
                  onChangeText={(text) =>
                    setAddress({ ...address, doorNo: text })
                  }
                />

                <TextInput
                  placeholder="Street"
                  style={styles.input}
                  value={address.street}
                  onChangeText={(text) =>
                    setAddress({ ...address, street: text })
                  }
                />

                <TextInput
                  placeholder="Landmark (Optional)"
                  style={styles.input}
                  value={address.landmark}
                  onChangeText={(text) =>
                    setAddress({ ...address, landmark: text })
                  }
                />

                <TextInput
                  placeholder="City"
                  style={styles.input}
                  value={address.city}
                  onChangeText={(text) =>
                    setAddress({ ...address, city: text })
                  }
                />

                {/* ✅ NEW STATE FIELD */}
                <TextInput
                  placeholder="State"
                  style={styles.input}
                  value={address.state}
                  onChangeText={(text) =>
                    setAddress({ ...address, state: text })
                  }
                />

                <TextInput
                  placeholder="Pincode"
                  style={styles.input}
                  keyboardType="numeric"
                  value={address.pincode}
                  onChangeText={(text) =>
                    setAddress({ ...address, pincode: text })
                  }
                />

                {/* SAVE BUTTON */}
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSave}
                >
                  <Text style={styles.saveText}>Save Address</Text>
                </TouchableOpacity>

              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

    </View>
  );
};

export default AddAddressComponent;

/* ================= STYLES ================= */

const styles = StyleSheet.create({

  addBtn: {
    margin: 12,
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FF8C00",
    alignItems: "center"
  },

  addText: {
    color: "#FF8C00",
    fontSize: 15,
    fontWeight: "700"
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center"
  },

  modalContainer: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 12,
    padding: 15,
    maxHeight: "85%"
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },

  heading: {
    fontSize: 16,
    fontWeight: "700"
  },

  locationBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FF8C00",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12
  },

  locationText: {
    color: "#FF8C00",
    fontWeight: "700",
    marginLeft: 6
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10
  },

  saveBtn: {
    backgroundColor: "#FF8C00",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10
  },

  saveText: {
    color: "#fff",
    fontWeight: "700"
  }

});