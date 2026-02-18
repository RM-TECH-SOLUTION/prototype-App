import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 10;
const CARD_WIDTH = (width - 60) / 2;

/* ================= IMAGE NORMALIZER ================= */

const getImageUri = (item) => {
  if (Array.isArray(item?.images) && item.images.length > 0)
    return item.images[0];
  if (Array.isArray(item?.image) && item.image.length > 0)
    return item.image[0];
  if (typeof item?.image === "string") return item.image;
  return null;
};

/* ======================================================
   COMPONENT
====================================================== */

const CategoryListComponent = ({
  CATEGORIES = [],
  ITEMS = [],
  cartItems = [],     // 👈 from store
  onSelectCategory,
  loadingItems,
  addToCart,
  updateQty,
  deleteCartItem,
  getCart,
}) => {

  const navigation = useNavigation();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // { item_id : { quantity , cart_id } }
  const [cart, setCart] = useState({});

  /* ======================================================
     LOAD CART ON SCREEN OPEN
  ====================================================== */

  useEffect(() => {
    getCart && getCart();
  }, []);

  /* ======================================================
     MAP BACKEND CART → UI CART
  ====================================================== */

  useEffect(() => {
    const map = {};

    cartItems.forEach((item) => {
      map[item.item_id] = {
        quantity: Number(item.quantity),
        cart_id: item.id,
      };
    });

    setCart(map);
  }, [cartItems]);

  /* ======================================================
     OPEN CATEGORY MODAL INITIALLY
  ====================================================== */

  useEffect(() => {
    const t = setTimeout(() => setModalVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  /* ======================================================
     HELPERS
  ====================================================== */

  const getQty = (id) => cart[id]?.quantity || 0;

  const handleSelectCategoryLocal = (cat) => {
    setSelectedCategory(cat);
    setModalVisible(false);
    onSelectCategory(cat.id);
  };

  /* ======================================================
     CART TOTAL
  ====================================================== */

 const { totalItems, totalPrice } = useMemo(() => {
  let count = 0;
  let price = 0;

  cartItems.forEach((item) => {
    count += Number(item.quantity || 0);
    price += Number(item.total || 0);
  });

  return {
    totalItems: count,
    totalPrice: price.toFixed(2),
  };
}, [cartItems]);


  /* ======================================================
     CART ACTIONS
  ====================================================== */

  const handleAdd = async (item) => {
    await addToCart({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: 1,
    });

    await getCart();   // 🔥 refresh
  };

  const handleIncrease = async (item) => {
    await updateQty(cart[item.id].cart_id, "inc");
    await getCart();   // 🔥 refresh
  };

  const handleDecrease = async (item) => {
    if (getQty(item.id) === 1) {
      await deleteCartItem(cart[item.id].cart_id);
    } else {
      await updateQty(cart[item.id].cart_id, "dec");
    }

    await getCart();   // 🔥 refresh
  };

  /* ======================================================
     CARD
  ====================================================== */

  const renderCard = (item, index, isItem = false, total = 0) => {
    const qty = getQty(item.id);

    const isLastRow =
      isItem && (index === total - 1 || index === total - 2);

    return (
      <View style={{ marginBottom: isLastRow ? 120 : 20 }}>
        <View style={styles.card}>

          <Image
            source={getImageUri(item) && { uri: getImageUri(item) }}
            style={styles.image}
          />

          <Text style={styles.cardText}>{item.name}</Text>

          {isItem && (
            <>
              <Text style={styles.priceText}>₹{item.price}</Text>

              {qty === 0 ? (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => handleAdd(item)}
                >
                  <Text style={styles.addButtonText}>ADD</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.qtyContainer}>

                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => handleDecrease(item)}
                  >
                    <Text style={styles.qtyText}>-</Text>
                  </TouchableOpacity>

                  <Text style={styles.qtyValue}>{qty}</Text>

                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => handleIncrease(item)}
                  >
                    <Text style={styles.qtyText}>+</Text>
                  </TouchableOpacity>

                </View>
              )}
            </>
          )}

        </View>
      </View>
    );
  };

  /* ======================================================
     UI
  ====================================================== */

  return (
    <View style={styles.container}>

      <Text style={styles.headerTitle}>Catalog</Text>

      {!selectedCategory ? (
        <Text style={styles.selectText}>Please select a catalog...</Text>
      ) : (
        <>
          <View style={styles.selectedBox}>
            <Text style={styles.selectedLabel}>
              Selected:
              <Text style={styles.selectedValue}> {selectedCategory.name}</Text>
            </Text>

            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>

          {loadingItems ? (
            <Text style={styles.selectText}>Loading items...</Text>
          ) : ITEMS.length === 0 ? (
            <Text style={styles.selectText}>No items found.</Text>
          ) : (
            <FlatList
              data={ITEMS}
              keyExtractor={(i) => i.id.toString()}
              numColumns={2}
              renderItem={({ item, index }) =>
                renderCard(item, index, true, ITEMS.length)
              }
              contentContainerStyle={styles.gridContainer}
            />
          )}
        </>
      )}

      {totalItems > 0 && (
        <View style={styles.cartContainer}>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate("Checkout")}
          >
            <Text style={styles.cartText}>
              View Cart ({totalItems}) - ₹{totalPrice}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ================= CATEGORY MODAL ================= */}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            <Text style={styles.modalTitle}>Select a Catalog</Text>

            <FlatList
              data={CATEGORIES}
              keyExtractor={(i) => i.id.toString()}
              numColumns={2}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectCategoryLocal(item)}
                >
                  {renderCard(item)}
                </TouchableOpacity>
              )}
            />

            {/* <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity> */}

          </View>
        </View>
      </Modal>

    </View>
  );
};

export default CategoryListComponent;

/* ================= STYLES (UNCHANGED) ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0",
    paddingHorizontal: 15,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FF8C00",
    marginVertical: 15,
  },

  selectText: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    marginTop: 80,
  },

  selectedBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.3)",
  },

  selectedLabel: { fontSize: 16, color: "#333" },
  selectedValue: { fontWeight: "700", color: "#FF8C00" },
  changeText: { color: "#007bff", fontWeight: "600" },

  gridContainer: {
    alignItems: "center",
    paddingBottom: 40,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: CARD_WIDTH,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    margin: CARD_MARGIN,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginBottom: 6,
  },

  cardText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  priceText: {
    fontSize: 13,
    color: "#666",
  },

  addButton: {
    backgroundColor: "#FF8C00",
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 6,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF8C00",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 6,
  },

  qtyButton: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  qtyText: {
    color: "#FF8C00",
    fontWeight: "700",
    fontSize: 16,
  },

  qtyValue: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
    marginHorizontal: 6,
  },

  modalOverlay: {
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },

  modalBox: {
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    maxHeight: "80%",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FF8C00",
    textAlign: "center",
    marginVertical: 15,
  },

  closeButton: {
    margin: 10,
    backgroundColor: "#FF8C00",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  closeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

  cartContainer: {
    position: "absolute",
    bottom: 20,
    left: 15,
    right: 15,
    zIndex: 999,
  },

  cartButton: {
    backgroundColor: "#FF8C00",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },

  cartText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
