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

/* ORDER FLOW */

const steps = ["pending", "accepted", "shipped", "delivered"];

const OrderHistoryScreen = ({ orderHistoryResponse = [] }) => {

  const navigation = useNavigation();

  /* ================= PROGRESS BAR ================= */

const steps = ["pending", "accepted", "shipped", "delivered"];

const stepLabels = {
  pending: "Order",
  accepted: "Accepted",
  shipped: "Shipped",
  delivered: "Delivered"
};

const renderProgress = (status) => {

  const currentStep = steps.indexOf(status?.toLowerCase());

  return (
    <View style={styles.progressContainer}>

      {steps.map((step, index) => {

        const active = index <= currentStep;

        return (
          <View key={index} style={styles.step}>

            <View
              style={[
                styles.circle,
                { backgroundColor: active ? "#4CAF50" : "#444" }
              ]}
            />

            {index !== steps.length - 1 && (
              <View
                style={[
                  styles.line,
                  {
                    backgroundColor:
                      index < currentStep ? "#4CAF50" : "#444"
                  }
                ]}
              />
            )}

            <Text
              style={[
                styles.stepLabel,
                { color: active ? "#4CAF50" : "#777" }
              ]}
            >
              {stepLabels[step]}
            </Text>

          </View>
        );
      })}

    </View>
  );
};

  /* ================= CARD ================= */

  const renderItem = ({ item }) => {

    const product = item?.items?.[0];

    const image =
      product?.images?.[0] ||
      "https://via.placeholder.com/100";

    const name = product?.item_name || "Product";

    const date = new Date(item.created_at).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric"
      }
    );

    return (

      <View style={styles.card}>

        <View style={{flexDirection:"row"}}>
          <View style={{marginRight:15}}>
        <Image source={{ uri: image }} style={styles.image} />
        </View>
        <View >
          <Text style={styles.name}>
            {name}
          </Text>

          <Text style={styles.orderId}>
            Order ID: {item.order_id}
          </Text>

          <Text style={styles.date}>
            Ordered on {date}
          </Text>

          <Text style={styles.price}>
            ₹{item.amount}
          </Text>
          </View>
        </View>

        <View style={styles.info}>

          {renderProgress(item.order_status)}

        </View>

      </View>

    );
  };

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>

      <StatusBar backgroundColor="#111" barStyle="light-content" />

      {/* HEADER */}

      <View style={styles.header}>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>
          Order History
        </Text>

        <View style={{ width: 26 }} />

      </View>

      {/* LIST */}

      <FlatList
        data={orderHistoryResponse}
        keyExtractor={(item) => item.order_id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      />

    </SafeAreaView>
  );
};

export default OrderHistoryScreen;


/* ================= STYLES ================= */

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
    flexDirection: "column",
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

nameBox: {
  backgroundColor: "#2A2A2A",
  padding: 6,
  borderRadius: 8,
  marginBottom: 6
},

name: {
  fontSize: 14,
  fontWeight: "700",
  color: "#fff",
  lineHeight: 18,
  width:"70%"
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

  /* ================= PROGRESS BAR ================= */

  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12
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
    fontSize: 10,
    marginTop: 6,
    textTransform: "capitalize"
  }

});