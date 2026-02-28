import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
  Modal,
} from "react-native";

import RazorpayCheckout from "react-native-razorpay";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import useSessionStore from "../store/useSessionStore";
import AddAddressComponent from "./AddAddressComponent";

/* =========================================================
   COMPONENT
========================================================= */

const CheckoutComponent = ({
  cartItems = [],
  getCart,
  merchantData,
  updateQty,
  deleteCartItem,
  clearCart,
  saveUserAddress,
  getProfile,
  profile,
  uiConfig = {},
  addressUiConfig = {}
}) => {
  const navigation = useNavigation();
  const { user } = useSessionStore();

  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const styles = createStyles(uiConfig);

  /* ================= ADDRESS ================= */

  useEffect(() => {
    if (profile?.address) {
      setSelectedAddress(profile.address);
    }
  }, [profile]);

  /* ================= TOTAL ================= */

  const total = useMemo(() => {
    let sum = 0;
    cartItems.forEach((i) => {
      sum += Number(i.total || 0);
    });
    return sum.toFixed(2);
  }, [cartItems]);

  /* ================= PAYMENT ================= */

  const createOrder = async (orderType) => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://api.rmtechsolution.com/create_order.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Number(total),
            merchant_id: merchantData?.merchantId,
            keyId: merchantData?.keyId,
            keySecret: merchantData?.keySecret,
            user_id: user?.id,
            phone: user?.phone,
            items: cartItems,
            orderType,
            discount: 0,
            address: JSON.stringify(selectedAddress),
          }),
        }
      );

      const order = await res.json();

      if (!order.success) {
        Alert.alert("Order Error", order.message);
        return;
      }

      if (orderType === "online") {
        const options = {
          key: order.key,
          order_id: order.id,
          amount: order.amount,
          currency: order.currency,
          name: merchantData?.name || "ZZZ Mobiles",
          description: "Order Payment",
          prefill: {
            contact: user?.phone,
            name: user?.name,
            email: user?.email,
          },
          theme: {
            color: uiConfig?.primaryColor || "#E50914",
          },
        };

        RazorpayCheckout.open(options)
          .then(async (data) => {
            await fetch(
              "https://api.rmtechsolution.com/create_order.php",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  order_id: order.id,
                  payment_id: data.razorpay_payment_id,
                  merchant_id: merchantData?.merchantId,
                  user_id: user?.id,
                  status: "success",
                }),
              }
            );

            clearCart();
            getCart();
            Alert.alert("Success", "Payment Successful");
            navigation.navigate("Home");
          })
          .catch(() => {
            Alert.alert("Payment Cancelled");
          });
      }

      if (orderType === "COD") {
        Alert.alert("Order Placed", "Cash on Delivery Selected");
        clearCart();
        getCart();
        navigation.navigate("Home");
      }
    } catch (e) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CART ITEM ================= */

  const renderItem = ({ item }) => {
    const imageUrl = item.images
      ? JSON.parse(item.images)[0]
      : null;

    return (
      <View style={styles.itemCard}>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Image source={{ uri: imageUrl }} style={styles.productImage} />

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.item_name}</Text>

            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQty(item.cart_id, "dec")}
              >
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.qtyValue}>{item.quantity}</Text>

              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQty(item.cart_id, "inc")}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.price}>₹{item.total}</Text>
          <TouchableOpacity
            onPress={() => deleteCartItem(item.cart_id)}
          >
            <Ionicons name="trash-outline" size={20} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={uiConfig?.headerBgColor || "#000"}
      />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={uiConfig?.headerTextColor || "#fff"}
          />
        </TouchableOpacity>

        <Text style={styles.title}>Checkout</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* EMPTY CART */}
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Your cart is empty
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(i) => i.cart_id.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />

          {/* ADDRESS */}
          {selectedAddress ? (
            <View style={styles.addressCard}>
              <Text style={styles.addressTitle}>
                Delivery Address
              </Text>
              <Text style={styles.addressText}>
                {selectedAddress.street}
              </Text>
            </View>
          ) : (
            <AddAddressComponent
              onSave={(data) => {
                setSelectedAddress(data);
                saveUserAddress(data);
              }}
              uiConfig={addressUiConfig}
            />
          )}

          {/* BOTTOM */}
          <View style={styles.bottom}>
            <Text style={styles.total}>₹{total}</Text>

            <TouchableOpacity
              style={styles.payBtn}
              onPress={() => setShowPaymentModal(true)}
            >
              <Text style={styles.payText}>
                Pay ₹{total}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* PAYMENT MODAL */}
      <Modal visible={showPaymentModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.paymentSheet}>
            <Text style={styles.sheetTitle}>
              Select Payment
            </Text>

            {uiConfig?.enableOnline !== false && (
              <TouchableOpacity
                style={styles.paymentOption}
                onPress={() => createOrder("online")}
              >
                <Text style={styles.optionText}>
                  Pay Online
                </Text>
              </TouchableOpacity>
            )}

            {uiConfig?.enableCOD !== false && (
              <TouchableOpacity
                style={styles.paymentOption}
                onPress={() => createOrder("COD")}
              >
                <Text style={styles.optionText}>
                  Cash On Delivery
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => setShowPaymentModal(false)}
            >
              <Text style={{ textAlign: "center", marginTop: 15 }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CheckoutComponent;

/* =========================================================
   DYNAMIC STYLES
========================================================= */

const createStyles = (ui) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: ui?.pageBgColor || "#111",
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      backgroundColor: ui?.headerBgColor || "#000",
    },

    title: {
      fontSize: 18,
      fontWeight: "800",
      color: ui?.headerTextColor || "#fff",
    },

    itemCard: {
      backgroundColor: ui?.cardBgColor || "#1A1A1A",
      margin: 12,
      padding: 16,
      borderRadius: 18,
      flexDirection: "row",
      justifyContent: "space-between",
    },

    name: {
      color: ui?.cardTextColor || "#fff",
      fontWeight: "700",
    },

    price: {
      color: ui?.primaryColor || "#E50914",
      fontWeight: "800",
    },

    qtyRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
    },

    qtyBtn: {
      backgroundColor: ui?.primaryColor || "#E50914",
      width: 30,
      height: 30,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },

    qtyBtnText: {
      color: "#fff",
      fontWeight: "800",
    },

    qtyValue: {
      marginHorizontal: 10,
      color: ui?.cardTextColor || "#fff",
    },

    productImage: {
      width: 70,
      height: 70,
      borderRadius: 12,
      marginRight: 12,
    },

    addressCard: {
      backgroundColor: ui?.cardBgColor || "#1A1A1A",
      margin: 16,
      padding: 16,
      borderRadius: 18,
    },

    addressTitle: {
      color: ui?.primaryColor || "#E50914",
      fontWeight: "800",
    },

    addressText: {
      color: ui?.cardTextColor || "#ddd",
      marginTop: 4,
    },

    bottom: {
      padding: 20,
      backgroundColor: ui?.bottomBarColor || "#000",
    },

    total: {
      color: ui?.cardTextColor || "#fff",
      fontSize: 18,
      fontWeight: "800",
    },

    payBtn: {
      backgroundColor: ui?.payButtonColor || "#E50914",
      padding: 16,
      borderRadius: 14,
      marginTop: 10,
      alignItems: "center",
    },

    payText: {
      color: ui?.payButtonTextColor || "#fff",
      fontWeight: "800",
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },

    paymentSheet: {
      backgroundColor: ui?.sheetBgColor || "#1A1A1A",
      padding: 20,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },

    sheetTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: ui?.cardTextColor || "#fff",
      marginBottom: 15,
    },

    paymentOption: {
      padding: 15,
      borderRadius: 12,
      backgroundColor: ui?.cardBgColor || "#2A2A2A",
      marginBottom: 10,
    },

    optionText: {
      color: ui?.cardTextColor || "#fff",
      fontWeight: "700",
    },

    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    emptyText: {
      color: "#999",
      fontSize: 16,
    },
  });