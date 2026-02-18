import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Alert
} from "react-native";

import RazorpayCheckout from "react-native-razorpay";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import useSessionStore from "../store/useSessionStore";

const CheckoutComponent = ({
  cartItems = [],
  getCart,
  merchantData
}) => {

  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const { user} = useSessionStore();
  const keyId = merchantData?.keyId
  const keySecret = merchantData?.keySecret


  console.log(keyId,keySecret,"useruser",merchantData?.merchantId);
  

  /* ================= TOTAL ================= */

  const total = useMemo(() => {
    let sum = 0;
    cartItems.forEach(i => {
      sum += Number(i.total || 0);
    });
    return sum.toFixed(2);
  }, [cartItems]);

  /* ================= PAYMENT ================= */

  const payNow = async () => {
    try {
      setLoading(true);
      console.log("➡ Creating order...");

     const res = await fetch(
  "https://api.rmtechsolution.com/create_order.php",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: Number(1),                 // use total later
      merchant_id: merchantData?.merchantId,

      // 🔑 Razorpay Keys
      keyId: merchantData?.keyId,
      keySecret: merchantData?.keySecret,

      // 👤 User
      user_id: user?.id,
      phone: user?.phone?.startsWith("+91")
        ? user.phone
        : `+91${user?.phone}`,

      // 🛒 Order
      items: cartItems,
      orderType: "online",
      discount: 0,

      // ✅ Prefill (also send to backend if needed later)
      prefill: {
        contact: user?.phone?.startsWith("+91")
          ? user.phone
          : `+91${user?.phone}`,
        name: user?.name || "Customer",
        email: user?.email || "customer@test.com"
      }
    })
  }
);


      const raw = await res.text();
      console.log("🟡 RAW:", raw);

      const order = JSON.parse(raw);

      if (!order.success) {
        Alert.alert("Order Error", order.message);
        return;
      }

     const options = {
  key: order.key,
  order_id: order.id,
  amount: order.amount,
  currency: order.currency,
  keyId: merchantData?.keyId,
  keySecret: merchantData?.keySecret,
  merchant_id: merchantData?.merchantId,

  name: merchantData?.name || "RM Tech Solution",
  description: "Order Payment",

  // ✅ ALWAYS PREFILL
  prefill: {
    contact: user?.phone?.startsWith("+91")
      ? user.phone
      : `+91${user?.phone}`,
    name: user?.name || "Customer",
    email: user?.email || "customer@test.com"
  },

  remember_customer: true,   // 👈 important

  theme: { color: "#FF8C00" }
};


      RazorpayCheckout.open(options)
        .then(() => {
          Alert.alert("Success", "Payment successful");
          getCart();
          navigation.navigate("Home");
        })
        .catch(() => {
          Alert.alert("Payment Cancelled");
        });

    } catch (e) {
      console.log("PAY ERROR:", e);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ITEM UI ================= */

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.item_name}</Text>
      <Text>₹{item.total}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF8C00" />

      <View style={styles.header}>
        <Ionicons name="chevron-back" size={26} color="#fff" />
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 25 }} />
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={i => i.id.toString()}
        renderItem={renderItem}
      />

      <View style={styles.bottom}>
        <Text style={styles.total}>Total: ₹{total}</Text>

        <TouchableOpacity
          style={styles.payBtn}
          disabled={loading}
          onPress={payNow}
        >
          <Text style={styles.payText}>
            {loading ? "Processing..." : `Pay ₹${total}`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CheckoutComponent;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },

  header: {
    backgroundColor: "#FF8C00",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between"
  },

  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700"
  },

  item: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 12,
    borderRadius: 10
  },

  name: { fontSize: 15, fontWeight: "600" },

  bottom: {
    backgroundColor: "#fff",
    padding: 20
  },

  total: {
    fontSize: 18,
    fontWeight: "700"
  },

  payBtn: {
    backgroundColor: "#FF8C00",
    marginTop: 10,
    padding: 14,
    borderRadius: 10,
    alignItems: "center"
  },

  payText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700"
  }
});
