import React, { useMemo, useState,useEffect } from "react";
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
  Modal
} from "react-native";

import RazorpayCheckout from "react-native-razorpay";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import useSessionStore from "../store/useSessionStore";
import AddAddressComponent from "./AddAddressComponent";

const CheckoutComponent = ({
  cartItems = [],
  getCart,
  merchantData,
  updateQty,
  deleteCartItem,
  clearCart,
  saveUserAddress,
  getProfile,profile
}) => {

  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const { user} = useSessionStore();
  const keyId = merchantData?.keyId
  const keySecret = merchantData?.keySecret
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
const [paymentMethod, setPaymentMethod] = useState(null);


  useEffect(() => {
  if (profile?.address) {
    setSelectedAddress(profile.address);
  }
}, [profile]);

useEffect(()=>{
getProfile()
},[])


  console.log(profile,"useruser selectedAddress",);
  

  /* ================= TOTAL ================= */

  const total = useMemo(() => {
    let sum = 0;
    cartItems.forEach(i => {
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
          orderType: orderType,
          discount: 0,
          address: JSON.stringify(selectedAddress)
        })
      }
    );

    const order = await res.json();

    if (!order.success) {
      Alert.alert("Order Error", order.message);
      return;
    }

    /* ================= ONLINE ================= */

    if (orderType === "online") {

      const orderId = order.id; // 🔥 Save order id

      const options = {
        key: order.key,
        order_id: orderId,
        amount: order.amount,
        currency: order.currency,
        name: merchantData?.name || "RM Tech Solution",
        description: "Order Payment",
        prefill: {
          contact: user?.phone,
          name: user?.name,
          email: user?.email
        },
        theme: { color: "#FF8C00" }
      };

      RazorpayCheckout.open(options)
        .then(async (data) => {

          console.log("Payment Success:", data);

          // ✅ SEND SUCCESS TO BACKEND
          await fetch(
            "https://api.rmtechsolution.com/create_order.php",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                order_id: orderId,
                payment_id: data.razorpay_payment_id,
                merchant_id: merchantData?.merchantId,
                user_id: user?.id,
                phone: user?.phone,
                items: cartItems,
                address: JSON.stringify(selectedAddress),
                amount: Number(total),
                orderType: "online",
                discount: 0,
                status: "success"
              })
            }
          );

          clearCart();
          getCart();
          Alert.alert("Success", "Payment successful");
          navigation.navigate("Home");
        })

        .catch(async (error) => {

          console.log("Payment Failed:", error);

          // ✅ SEND FAILURE TO BACKEND
          await fetch(
            "https://api.rmtechsolution.com/create_order.php",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                order_id: orderId,
                merchant_id: merchantData?.merchantId,
                user_id: user?.id,
                phone: user?.phone,
                items: cartItems,
                address: JSON.stringify(selectedAddress),
                amount: Number(total),
                orderType: "online",
                discount: 0,
                status: "failure"
              })
            }
          );

          Alert.alert("Payment Cancelled");
        });
    }

    /* ================= COD ================= */

    if (orderType === "COD") {
      Alert.alert("Order Placed", "Cash on Delivery selected");
      clearCart();
      getCart();
      navigation.navigate("Home");
    }

  } catch (e) {
    console.log("ORDER ERROR:", e);
    Alert.alert("Error", "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  const handleIncrease = async (item) => {

    await updateQty(item?.cart_id, "inc");
    await getCart();   // 🔥 refresh
  };

    const handleDecrease = async (item) => {
      await updateQty(item?.cart_id, "dec");
    await getCart();   // 🔥 refresh
  };

  const deleteCart = async (item) =>{
    await deleteCartItem(item?.cart_id)
  }

  /* ================= ITEM UI ================= */

  console.log(cartItems,"cartItemshhh");
  // Nothing found in your cart

  // ORDER NOW
  



const renderItem = ({ item }) => {
  console.log(item, "itemitem list");
  const imageUrl = item.images
  ? JSON.parse(item.images)[0]
  : null;

  return (
    <View style={styles.itemCard}>

      {/* LEFT SIDE */}
      <View style={{ flexDirection: "row", flex: 1 }}>

        {/* PRODUCT IMAGE */}
        <Image
          source={{ uri: imageUrl}}
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* DETAILS */}
        <View style={styles.leftSection}>
          <Text style={styles.name}>{item.item_name}</Text>

          {/* QTY CONTROLS */}
          <View style={styles.qtyRow}>
            <TouchableOpacity style={styles.qtyBtn} 
            onPress={()=>{
              handleDecrease(item)
            }}>
              <Text style={styles.qtyBtnText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.qtyValue}>{item.quantity}</Text>

            <TouchableOpacity style={styles.qtyBtn}
            onPress={()=>{
              handleIncrease(item)
            }}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* RIGHT SIDE */}
      <View style={styles.rightSection}>
        <Text style={styles.price}>₹{item.total}</Text>
        <TouchableOpacity 
        onPress={()=>{
          deleteCart(item)
        }}
        >
        <Ionicons name="trash-outline" size={22} color="red" />
        </TouchableOpacity>
      </View>

    </View>
  );
};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF8C00" />

      <View style={styles.header}>
        <Ionicons name="chevron-back" size={26} color="#fff" />
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 25 }} />
      </View>

       {cartItems.length < 1 ?
      <View style={{width:"100%",height:"100%",justifyContent:"center",alignItems:"center"}}>
      <View style={{}}>
        <Text style={{fontSize:20}}> Nothing found in your cart</Text>
      </View>
      {/* <TouchableOpacity style={{marginTop:20,padding:10,backgroundColor:"#FF8C00",borderRadius:10}}>
        <Text style={{color:"#fff",fontSize:15,fontWeight:"bold"}}>Order Now</Text>
      </TouchableOpacity> */}
      </View>

      :
        <>

      <FlatList
        data={cartItems}
        keyExtractor={i => i.cart_id.toString()}
        renderItem={renderItem}
      />

      {/* ===== DELIVERY ADDRESS ===== */}

{selectedAddress ? (

  <View style={styles.addressCard}>

    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={styles.addressTitle}>Delivery Address</Text>

      <TouchableOpacity onPress={() => setSelectedAddress(null)}>
        <Text style={styles.changeText}>Change</Text>
      </TouchableOpacity>
    </View>

    <Text style={styles.addressText}>
      {selectedAddress.building}, {selectedAddress.doorNo}
    </Text>

    <Text style={styles.addressText}>
      {selectedAddress.street}
    </Text>

    {selectedAddress.landmark ? (
      <Text style={styles.addressText}>
        Landmark: {selectedAddress.landmark}
      </Text>
    ) : null}

    <Text style={styles.addressText}>
      {selectedAddress.city} - {selectedAddress.pincode} - {selectedAddress.state}
    </Text>
    <Text style={styles.addressText}>
      {profile.phone}
    </Text>

  </View>

) : (

  <AddAddressComponent
    onSave={(data) => {
      setSelectedAddress(data);
      saveUserAddress(data)
      Alert.alert("Address Saved");
      getProfile()
    }}
    getProfile={getProfile}
  />

)}
      <View style={styles.bottom}>
        <Text style={styles.total}>Total: ₹{total}</Text>

        <TouchableOpacity
          style={styles.payBtn}
          disabled={loading}
          onPress={() => setShowPaymentModal(true)}
        >
          <Text style={styles.payText}>
            {loading ? "Processing..." : `Pay ₹${total}`}
          </Text>
        </TouchableOpacity>
      </View>
      </>
      }
      {/* ===== PAYMENT METHOD MODAL ===== */}
<Modal visible={showPaymentModal} transparent animationType="slide">

  <View style={styles.modalOverlay}>

    <View style={styles.paymentSheet}>

     <View style={styles.sheetHeader}>

  <Text style={styles.sheetTitle}>Choose Payment Method</Text>

  <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
    <Ionicons name="close" size={22} color="#333" />
  </TouchableOpacity>

</View>

      {/* ONLINE */}
      <TouchableOpacity
        style={[
          styles.paymentOption,
          paymentMethod === "online" && styles.activeOption
        ]}
        onPress={() => setPaymentMethod("online")}
      >
        <Text style={styles.optionText}>Pay Online</Text>
        <Text style={styles.optionAmount}>₹{total}</Text>
      </TouchableOpacity>

      {/* COD */}
      <TouchableOpacity
        style={[
          styles.paymentOption,
          paymentMethod === "COD" && styles.activeOption
        ]}
        onPress={() => setPaymentMethod("COD")}
      >
        <Text style={styles.optionText}>Cash on Delivery</Text>
        <Text style={styles.optionAmount}>₹{total}</Text>
      </TouchableOpacity>

      {/* CONTINUE */}
      <TouchableOpacity
        style={[
          styles.continueBtn,
          !paymentMethod && { opacity: 0.5 }
        ]}
        disabled={!paymentMethod}
        onPress={() => {
          setShowPaymentModal(false);

         if (paymentMethod === "online") {
            createOrder("online");
            } else {
                createOrder("COD");   // ✅ Now COD also calls backend
          }
        }}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>

    </View>

  </View>
</Modal>
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
    padding: 20,
    borderTopWidth:1,
    borderLeftWidth:1,
    borderRightWidth:1,
    elevation:2
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
  },
  itemCard: {
  backgroundColor: "#fff",
  marginHorizontal: 12,
  marginVertical: 6,
  padding: 14,
  borderRadius: 12,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  elevation: 3
},

leftSection: {
  flex: 1
},

rightSection: {
  alignItems: "flex-end"
},

price: {
  fontSize: 16,
  fontWeight: "700",
  color: "#FF8C00",
  marginBottom: 6
},
qtyRow: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 6
},

qtyBtn: {
  width: 28,
  height: 28,
  borderRadius: 6,
  backgroundColor: "#FF8C00",
  alignItems: "center",
  justifyContent: "center"
},

qtyBtnText: {
  color: "#fff",
  fontSize: 18,
  fontWeight: "700"
},

qtyValue: {
  marginHorizontal: 10,
  fontSize: 15,
  fontWeight: "700",
  color: "#333"
},
productImage: {
  width: 70,
  height: 70,
  borderRadius: 8,
  marginRight: 10,
  backgroundColor: "#eee"
},
addressCard: {
  backgroundColor: "#fff",
  margin: 12,
  padding: 14,
  borderRadius: 12,
  elevation: 2
},

addressTitle: {
  fontSize: 16,
  fontWeight: "700",
  marginBottom: 6
},

addressText: {
  fontSize: 14,
  color: "#444",
  marginBottom: 2
},

changeText: {
  color: "#FF8C00",
  fontWeight: "700"
},
modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "flex-end"
},

paymentSheet: {
  backgroundColor: "#fff",
  padding: 20,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20
},

sheetTitle: {
  fontSize: 18,
  fontWeight: "700",
  marginBottom: 15,
  textAlign: "center"
},

paymentOption: {
  flexDirection: "row",
  justifyContent: "space-between",
  padding: 15,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#ddd",
  marginBottom: 10
},

activeOption: {
  borderColor: "#FF8C00",
  backgroundColor: "#FFF3E0"
},

optionText: {
  fontSize: 16,
  fontWeight: "600"
},

optionAmount: {
  fontSize: 16,
  fontWeight: "700",
  color: "#FF8C00"
},

continueBtn: {
  backgroundColor: "#FF8C00",
  padding: 14,
  borderRadius: 12,
  alignItems: "center",
  marginTop: 10
},

continueText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "700"
},
sheetHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 15
},
});
