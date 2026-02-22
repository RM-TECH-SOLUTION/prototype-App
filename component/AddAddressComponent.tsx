import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AddAddressComponent = ({ onSave }) => {

  const [showModal, setShowModal] = useState(false);
  // ✅ Serviceable pincodes
const SERVICEABLE_PINCODES = [
  "502032",
  "500002",
  "500003",
  "500004"
];

  const [address, setAddress] = useState({
    building: "",
    doorNo: "",
    street: "",
    landmark: "",
    city: "",
    pincode: ""
  });

const handleSave = () => {
  if (
    !address.building ||
    !address.doorNo ||
    !address.street ||
    !address.city ||
    !address.pincode
  ) {
    alert("Please fill all required fields");
    return;
  }

  // ✅ PINCODE CHECK
  if (!SERVICEABLE_PINCODES.includes(address.pincode)) {
    alert("Service not available in this area");
    return;
  }

  onSave(address);
  setShowModal(false);
};

  return (
    <View>

      {/* OPEN BUTTON */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.addText}>+ Add Delivery Address</Text>
      </TouchableOpacity>

      {/* POPUP MODAL */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent
      >
        <View style={styles.overlay}>

          <KeyboardAvoidingView
           
          >

            <View style={styles.modalContainer}>

              <ScrollView
                contentContainerStyle={{ paddingBottom: 30 }}
               
              >

                {/* HEADER */}
                <View style={styles.header}>
                  <Text style={styles.heading}>Delivery Address</Text>

                  <TouchableOpacity onPress={() => setShowModal(false)}>
                    <Ionicons name="close" size={22} color="#333" />
                  </TouchableOpacity>
                </View>

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

                <TextInput
                  placeholder="Pincode"
                  style={styles.input}
                  keyboardType="numeric"
                  value={address.pincode}
                  onChangeText={(text) =>
                    setAddress({ ...address, pincode: text })
                  }
                />

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
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