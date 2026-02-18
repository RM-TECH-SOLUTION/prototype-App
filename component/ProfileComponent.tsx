import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useSessionStore from "../store/useSessionStore";

const ProfileComponent = ({navigation}) => {
  const { user, loading,clearSession } = useSessionStore();

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={{fontWeight:"700"}}>Hey Guest</Text>
        <Text style={styles.infoText}>No user logged in.</Text>
        <View style={{flexDirection:"row",padding:10}}>
            <Text style={{fontSize:18}}>Click here to </Text>
            <TouchableOpacity style={{}}
            onPress={()=>{navigation.navigate("Auth")}}
            >
            <Text style={{textDecorationLine:"underline",fontSize:18}}>login</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <View style={styles.profileHeader}>
        <View style={{backgroundColor:"#DBDBDB",padding:10,borderRadius:"100%"}}>
            <Text style={{fontSize:25}}>&#128100;</Text>
        </View>
        <Text style={styles.name}>{user.name || "User"}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* User Info */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={20} color="#007bff" />
          <Text style={styles.infoText}>{user.phone || "N/A"}</Text>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={()=>{clearSession()}}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    padding: 15,
    width:"95%",
    margin:10,
    borderRadius:10
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#007bff",
    // marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  infoCard: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#444",
  },
  logoutButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 15,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
