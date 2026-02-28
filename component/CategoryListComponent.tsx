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

/* IMAGE NORMALIZER */
const getImageUri = (item) => {
  if (Array.isArray(item?.images) && item.images.length > 0)
    return item.images[0];
  if (Array.isArray(item?.image) && item.image.length > 0)
    return item.image[0];
  if (typeof item?.image === "string") return item.image;
  return null;
};

const CategoryListComponent = ({
  uiConfig = {},
  CATEGORIES = [],
  ITEMS = [],
  cartItems = [],
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
  const [cart, setCart] = useState({});

  const gridColumns = uiConfig?.gridColumns || 2;
  const CARD_WIDTH =
    (width - 40 - (gridColumns - 1) * 12) / gridColumns;

  useEffect(() => {
    getCart && getCart();
  }, []);

  useEffect(() => {
    const map = {};
    cartItems.forEach((item) => {
      map[item.item_id] = {
        quantity: Number(item.quantity),
        cart_id: item.cart_id,
      };
    });
    setCart(map);
  }, [cartItems]);

  useEffect(() => {
    const t = setTimeout(() => setModalVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  const getQty = (id) => cart[id]?.quantity || 0;

  const handleSelectCategoryLocal = (cat) => {
    setSelectedCategory(cat);
    setModalVisible(false);
    onSelectCategory(cat.id);
  };

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

  const dynamicStyles = styles(uiConfig, CARD_WIDTH);

  const renderCard = (item, isItem = false) => {
    const qty = getQty(item.id);

    return (
      <View style={dynamicStyles.card}>
        {getImageUri(item) && (
          <Image
            source={{ uri: getImageUri(item) }}
            style={dynamicStyles.image}
          />
        )}

        <Text style={dynamicStyles.cardText}>
          {item.name}
        </Text>

        {isItem && (
          <>
            <Text style={dynamicStyles.priceText}>
              ₹{item.price}
            </Text>

            {qty === 0 ? (
              <TouchableOpacity
                style={dynamicStyles.addButton}
                onPress={() => addToCart({
                  item_id: item.id,
                  item_name: item.name,
                  price: item.price,
                  quantity: 1,
                })}
              >
                <Text style={dynamicStyles.addButtonText}>
                  ADD
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={dynamicStyles.qtyContainer}>
                <TouchableOpacity
                  style={dynamicStyles.qtyButton}
                  onPress={() =>
                    qty === 1
                      ? deleteCartItem(cart[item.id].cart_id)
                      : updateQty(cart[item.id].cart_id, "dec")
                  }
                >
                  <Text style={dynamicStyles.qtyText}>-</Text>
                </TouchableOpacity>

                <Text style={dynamicStyles.qtyValue}>
                  {qty}
                </Text>

                <TouchableOpacity
                  style={dynamicStyles.qtyButton}
                  onPress={() =>
                    updateQty(cart[item.id].cart_id, "inc")
                  }
                >
                  <Text style={dynamicStyles.qtyText}>+</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.headerTitle}>
        {uiConfig?.headerTitle || "Catalog"}
      </Text>

      {!selectedCategory ? (
        <Text style={dynamicStyles.selectText}>
          Please select a catalog...
        </Text>
      ) : (
        <>
          <View style={dynamicStyles.selectedBox}>
            <Text style={dynamicStyles.selectedLabel}>
              {selectedCategory.name}
            </Text>

            <TouchableOpacity
              onPress={() => setModalVisible(true)}
            >
              <Text style={dynamicStyles.changeText}>
                Change
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={ITEMS}
            keyExtractor={(i) => i.id.toString()}
            numColumns={gridColumns}
            renderItem={({ item }) =>
              renderCard(item, true)
            }
            contentContainerStyle={{ paddingBottom: 120 }}
          />
        </>
      )}

      {uiConfig?.enableFloatingCart &&
        totalItems > 0 && (
          <View style={dynamicStyles.cartContainer}>
            <TouchableOpacity
              style={dynamicStyles.cartButton}
              onPress={() =>
                navigation.navigate("Checkout")
              }
            >
              <Text style={dynamicStyles.cartText}>
                View Cart ({totalItems}) - ₹{totalPrice}
              </Text>
            </TouchableOpacity>
          </View>
        )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
      >
        <View style={dynamicStyles.modalOverlay}>
          <View style={dynamicStyles.modalBox}>
            <Text style={dynamicStyles.modalTitle}>
              Select Catalog
            </Text>

            <FlatList
              data={CATEGORIES}
              keyExtractor={(i) => i.id.toString()}
              numColumns={gridColumns}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    handleSelectCategoryLocal(item)
                  }
                >
                  {renderCard(item)}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CategoryListComponent;

/* ================= CMS BASED STYLES ================= */

const styles = (ui, CARD_WIDTH) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        ui?.pageBgColor || "#0F0F0F",
      paddingHorizontal: 16,
    },

    headerTitle: {
      fontSize: 24,
      fontWeight: "800",
      color:
        ui?.headerTitleColor ||
        ui?.primaryColor ||
        "#E50914",
      marginVertical: 20,
    },

    selectText: {
      textAlign: "center",
      color: "#888",
      marginTop: 80,
    },

    selectedBox: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor:
        ui?.cardBgColor || "#1A1A1A",
      padding: 14,
      borderRadius: 16,
      marginBottom: 20,
    },

    selectedLabel: {
      color: ui?.cardTextColor || "#fff",
      fontWeight: "700",
    },

    changeText: {
      color: ui?.primaryColor || "#E50914",
    },

    card: {
      width: CARD_WIDTH,
      backgroundColor:
        ui?.cardBgColor || "#1A1A1A",
      borderRadius: 20,
      padding: 14,
      margin: 6,
    },

    image: {
      width: "100%",
      height: 110,
      borderRadius: 14,
      marginBottom: 10,
    },

    cardText: {
      color: ui?.cardTextColor || "#fff",
      fontWeight: "700",
    },

    priceText: {
      color: ui?.priceColor || "#aaa",
      marginTop: 4,
    },

    addButton: {
      backgroundColor:
        ui?.buttonColor || "#E50914",
      paddingVertical: 8,
      borderRadius: 12,
      marginTop: 10,
      alignItems: "center",
    },

    addButtonText: {
      color: ui?.buttonTextColor || "#fff",
      fontWeight: "700",
    },

    qtyContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor:
        ui?.qtyBgColor || "#E50914",
      borderRadius: 12,
      paddingVertical: 6,
      paddingHorizontal: 10,
      marginTop: 10,
    },

    qtyButton: {
      backgroundColor: "#fff",
      width: 26,
      height: 26,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },

    qtyText: {
      color: ui?.buttonColor || "#E50914",
      fontWeight: "700",
      fontSize: 16,
    },

    qtyValue: {
      color: "#fff",
      fontWeight: "700",
    },

    cartContainer: {
      position: "absolute",
      bottom: 20,
      left: 20,
      right: 20,
      borderRadius: 20,
    },

    cartButton: {
      backgroundColor:
        ui?.cartBarColor || "#111",
      paddingVertical: 16,
      borderRadius: 20,
      alignItems: "center",
      borderWidth: 1,
      borderColor:
        ui?.primaryColor || "#E50914",
    },

    cartText: {
      color:
        ui?.cartTextColor ||
        ui?.primaryColor ||
        "#E50914",
      fontWeight: "800",
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.7)",
      justifyContent: "center",
      alignItems: "center",
    },

    modalBox: {
      width: "92%",
      backgroundColor:
        ui?.modalBgColor || "#1A1A1A",
      borderRadius: 24,
      padding: 16,
      maxHeight: "80%",
    },

    modalTitle: {
      color:
        ui?.modalTitleColor ||
        ui?.primaryColor ||
        "#E50914",
      fontSize: 20,
      fontWeight: "800",
      textAlign: "center",
      marginBottom: 20,
    },
  });