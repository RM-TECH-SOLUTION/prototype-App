import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  StatusBar,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const orders = [
  {
    id: "ORD-98231",
    item_name: "Men Oversized T-Shirt",
    image: "https://i.imgur.com/JqKDdxj.jpg",
    amount: 499,
    date: "12 Mar 2026",
    status: "Delivered"
  },
  {
    id: "ORD-98232",
    item_name: "Wireless Earbuds",
    image: "https://i.imgur.com/8Km9tLL.jpg",
    amount: 1299,
    date: "10 Mar 2026",
    status: "Shipped"
  },
  {
    id: "ORD-98233",
    item_name: "Women Casual Kurti",
    image: "https://i.imgur.com/0y8Ftya.jpg",
    amount: 799,
    date: "8 Mar 2026",
    status: "Processing"
  }
];

const steps = ["Processing", "Shipped", "Delivered"];

const OrderHistoryScreen = () => {

  const navigation = useNavigation();

  const renderProgress = (status) => {

    const currentStep = steps.indexOf(status);

    return (
      <View style={styles.progressContainer}>
        {steps.map((step, index) => {

          const active = index <= currentStep;

          return (
            <View key={index} style={styles.step}>

              <View
                style={[
                  styles.circle,
                  { backgroundColor: active ? "#4CAF50" : "#ccc" }
                ]}
              />

              {index !== steps.length - 1 && (
                <View
                  style={[
                    styles.line,
                    { backgroundColor: index < currentStep ? "#4CAF50" : "#ccc" }
                  ]}
                />
              )}

              <Text
                style={[
                  styles.stepLabel,
                  { color: active ? "#4CAF50" : "#999" }
                ]}
              >
                {step}
              </Text>

            </View>
          );
        })}
      </View>
    );
  };

  const renderItem = ({ item }) => {

    return (
      <View style={styles.card}>

        <Image source={{ uri: item.image }} style={styles.image} />

        <View style={styles.info}>

          <Text style={styles.name}>{item.item_name}</Text>

          <Text style={styles.orderId}>
            Order ID: {item.id}
          </Text>

          <Text style={styles.date}>
            Ordered on {item.date}
          </Text>

          <Text style={styles.price}>
            ₹{item.amount}
          </Text>

          {renderProgress(item.status)}

        </View>

      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>

      {/* STATUS BAR */}
      <StatusBar backgroundColor="#111" barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Order History</Text>

        <View style={{ width: 26 }} />

      </View>

      {/* ORDER LIST */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      />

    </SafeAreaView>
  );
};

export default OrderHistoryScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#0F0F0F"
  },

  header: {
    backgroundColor: "#111",
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800"
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#1C1C1C",
    padding: 16,
    borderRadius: 20,
    marginBottom: 14
  },

  image: {
    width: 85,
    height: 85,
    borderRadius: 12
  },

  info: {
    flex: 1,
    marginLeft: 12
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff"
  },

  orderId: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 2
  },

  date: {
    fontSize: 12,
    color: "#888"
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
    color: "#fff"
  },

  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10
  },

  step: {
    flex: 1,
    alignItems: "center"
  },

  circle: {
    width: 14,
    height: 14,
    borderRadius: 7
  },

  line: {
    position: "absolute",
    top: 6,
    left: "50%",
    width: "100%",
    height: 3
  },

  stepLabel: {
    fontSize: 11,
    marginTop: 5
  }

});