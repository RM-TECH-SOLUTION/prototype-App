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
  Image
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

  useEffect(() => {
  if (profile?.address) {
    setSelectedAddress(profile.address);
  }
}, [profile]);


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
      amount: Number(total),               
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
          clearCart()
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
      {selectedAddress.city} - {selectedAddress.pincode}
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
  />

)}
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
      </>
      }
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
});
