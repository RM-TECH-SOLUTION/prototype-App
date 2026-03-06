import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView
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
  cartMap = {},
  totalItems = 0,
  totalPrice = "0.00",
  onSelectCategory,
  onAdd,
  onIncrease,
  onDecrease,
  loadingItems,
}) => {
  const navigation = useNavigation();

  console.log(ITEMS, "ITEMSITEMS");


  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [pdpVisible, setPdpVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showFullSpec, setShowFullSpec] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  const gridColumns = uiConfig?.gridColumns || 2;
  const CARD_WIDTH =
    (width - 40 - (gridColumns - 1) * 12) / gridColumns;

  useEffect(() => {
    const t = setTimeout(() => setModalVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  const getQty = (id) => cartMap[id]?.quantity || 0;

  const handleSelectCategoryLocal = (cat) => {
    setSelectedCategory(cat);
    setModalVisible(false);
    onSelectCategory && onSelectCategory(cat.id);
  };

  const dynamicStyles = styles(uiConfig, CARD_WIDTH);

  const renderCard = (item, isItem = false) => {
    const qty = getQty(item.id);

    return (
      <View style={dynamicStyles.card}
      >
        {!isItem && getImageUri(item) && (
          <View style={dynamicStyles.catalogCard}>
            <Image
              source={{ uri: getImageUri(item) }}
              style={dynamicStyles.image}
            />
            <Text style={dynamicStyles.cardText}>
              {item.name}
            </Text>
          </View>
        )}

        {isItem && (
          <View style={{justifyContent:"space-between",width:"100%",height:"100%"}}>
          <View>
            {getImageUri(item) && (
              <TouchableOpacity style={dynamicStyles.catalogCard}
                onPress={() => {
                  if (item?.variants?.length > 0) {
                    setSelectedProduct(item);
                    setSelectedVariant(item.variants[0]);
                    setPdpVisible(true);
                  }
                }}
              >
                <Image
                  source={{ uri: getImageUri(item) }}
                  style={dynamicStyles.image}
                />
                <Text style={dynamicStyles.cardText}
                 numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            <Text style={dynamicStyles.priceText}>
              ₹{item.price}
            </Text>
          </View>
          <View>
            {qty === 0 ? (
              <TouchableOpacity
                style={dynamicStyles.addButton}
                onPress={() => {
                  if (item?.variants?.length > 0) {
                    setSelectedProduct(item);
                    setSelectedVariant(item.variants[0]);
                    setPdpVisible(true);
                  } else {
                    onAdd && onAdd(item);
                  }
                }}
              >
                <Text style={dynamicStyles.addButtonText}>
                  ADD
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={dynamicStyles.qtyContainer}>
                <TouchableOpacity
                  style={dynamicStyles.qtyButton}
                  onPress={() => onDecrease && onDecrease(item)}
                >
                  <Text style={dynamicStyles.qtyText}>-</Text>
                </TouchableOpacity>

                <Text style={dynamicStyles.qtyValue}>
                  {qty}
                </Text>

                <TouchableOpacity
                  style={dynamicStyles.qtyButton}
                  onPress={() => onIncrease && onIncrease(item)}
                >
                  <Text style={dynamicStyles.qtyText}>+</Text>
                </TouchableOpacity>
              </View>
            )}
            </View>
          </View>
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
          <TouchableOpacity
            style={dynamicStyles.selectedBox}
            onPress={() => setModalVisible(true)}
          >
            <Text style={dynamicStyles.selectedLabel}>
              {selectedCategory.name}
            </Text>
            <Text style={dynamicStyles.changeText}>
              Change
            </Text>
          </TouchableOpacity>

          {(
            <FlatList
              data={ITEMS}
              keyExtractor={(i) => i.id.toString()}
              numColumns={gridColumns}
              renderItem={({ item }) =>
                renderCard(item, true)
              }
              contentContainerStyle={{ paddingBottom: 120 }}
            />
          )}
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
     <Modal visible={pdpVisible} transparent animationType="slide" >
     

  <View style={dynamicStyles.modalOverlay}>
     

    <View style={[dynamicStyles.modalBox2, { 
      borderRadius: 24,
      padding: 16,height: "100%" }]}>

      {/* BACK BUTTON */}
       <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
          marginTop:30
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setPdpVisible(false);
            setShowFullSpec(false);
          }}
          style={{
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 20,
            backgroundColor: "#1A1A1A",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            ← Back
          </Text>
        </TouchableOpacity>
      </View>


      {selectedProduct && (

        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          data={[selectedProduct]}
          keyExtractor={() => "pdp"}
          renderItem={() => {

            const specText = selectedProduct.specifications || "";
            const shortSpec = specText.substring(0, 220);

            return (

              <View style={{}}>

                {/* IMAGE SLIDER */}
                <FlatList
                  data={selectedProduct.images || []}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(img, i) => i.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => {
                        setActiveImage(item);
                        setImageViewerVisible(true);
                      }}
                    >
                      <Image
                        source={{ uri: item }}
                        style={{
                          width: width - 90,
                          height: 340,
                          borderRadius: 16,
                          marginRight: 10
                        }}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  )}
                />

                {/* TITLE */}
                <Text style={{
                  fontSize: 18,
                  fontWeight: "800",
                  color: "#fff",
                  marginTop: 10
                }}>
                  {selectedProduct.name}
                </Text>

                {/* BRAND */}
                {selectedProduct.brand && (
                  <Text style={{ color: "#aaa", marginTop: 4 }}>
                    {selectedProduct.brand}
                  </Text>
                )}

                {/* PRICE */}
                <View style={{ flexDirection: "row", marginTop: 6 }}>

                  <Text style={{
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: "700"
                  }}>
                    ₹{selectedVariant?.price || selectedProduct.price}
                  </Text>

                  {(selectedVariant?.compare_price || selectedProduct.compare_price) && (

                    <Text style={{
                      marginLeft: 10,
                      color: "#888",
                      textDecorationLine: "line-through"
                    }}>
                      ₹{selectedVariant?.compare_price || selectedProduct.compare_price}
                    </Text>

                  )}

                </View>

                {/* VARIANTS */}
                {selectedProduct.variants?.length > 0 && (

                  <View style={{ marginTop: 16 }}>

                    <Text style={{
                      color: "#fff",
                      fontWeight: "700",
                      marginBottom: 8
                    }}>
                      Select Variant
                    </Text>

                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      data={selectedProduct.variants}
                      keyExtractor={(v) => v.id.toString()}
                      renderItem={({ item }) => {

                        const active = selectedVariant?.id === item.id;

                        return (

                          <TouchableOpacity
                            style={{
                              paddingVertical: 8,
                              paddingHorizontal: 14,
                              borderRadius: 12,
                              marginRight: 10,
                              borderWidth: 1,
                              borderColor: active ? "#E50914" : "#444",
                              backgroundColor: active ? "#E50914" : "#1A1A1A"
                            }}
                            onPress={() => setSelectedVariant(item)}
                          >

                            <Text style={{ color: "#fff" }}>
                              {item.variant_name}
                            </Text>

                          </TouchableOpacity>

                        )

                      }}
                    />

                  </View>

                )}

                {/* SPECIFICATIONS */}
                {specText.length > 0 && (

                  <View style={{ marginTop: 16 }}>

                    <Text style={{
                      color: "#fff",
                      fontWeight: "700",
                      marginBottom: 6
                    }}>
                      Specifications
                    </Text>

                    <Text style={{
                      color: "#aaa",
                      fontSize: 13,
                      lineHeight: 20
                    }}>
                      {showFullSpec ? specText : shortSpec}
                    </Text>

                    {specText.length > 220 && (

                      <TouchableOpacity
                        onPress={() => setShowFullSpec(!showFullSpec)}
                      >

                        <Text style={{
                          color: "#E50914",
                          marginTop: 6,
                          fontWeight: "600"
                        }}>
                          {showFullSpec ? "See Less" : "See More"}
                        </Text>

                      </TouchableOpacity>

                    )}

                  </View>

                )}

              </View>

            )

          }}
        />

      )}

      {/* FIXED ADD TO CART */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 15,
          backgroundColor: "#111"
        }}
      >

        <TouchableOpacity
          style={{
            backgroundColor: "#E50914",
            paddingVertical: 14,
            borderRadius: 16,
            alignItems: "center",
            marginBottom:20
          }}
          onPress={() => {

            onAdd && onAdd({
              ...selectedProduct,
              variant: selectedVariant
            });

            setPdpVisible(false);
            setShowFullSpec(false);

          }}
        >

          <Text style={{
            color: "#fff",
            fontWeight: "800"
          }}>
            ADD TO CART
          </Text>

        </TouchableOpacity>

      </View>

    </View>

  </View>

</Modal>
      <Modal visible={imageViewerVisible} transparent animationType="fade">

        <View style={{
          flex: 1,
          backgroundColor: "#000",
          justifyContent: "center",
          alignItems: "center"
        }}>

          <Image
            source={{ uri: activeImage }}
            style={{
              width: "100%",
              height: "80%"
            }}
            resizeMode="contain"
          />

          <TouchableOpacity
            onPress={() => setImageViewerVisible(false)}
            style={{
              position: "absolute",
              top: 50,
              right: 20,
              backgroundColor: "rgba(0,0,0,0.6)",
              padding: 10,
              borderRadius: 20
            }}
          >

            <Text style={{ color: "#fff", fontSize: 16 }}>Close</Text>

          </TouchableOpacity>

        </View>

      </Modal>
    </View>
  );
};

export default CategoryListComponent;

/* ================= CMS DYNAMIC STYLES ================= */

const styles = (ui, CARD_WIDTH) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: ui?.pageBgColor || "#0F0F0F",
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
      fontWeight: "600",
    },

    card: {
      width: CARD_WIDTH,
      backgroundColor:
        ui?.cardBgColor || "#1A1A1A",
      borderRadius: 20,
      padding: 14,
      margin: 6,
    },

    catalogCard: {
      alignItems: "center",
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
      alignSelf:"flex-start"
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
      width: "95%",
      backgroundColor:
        ui?.modalBgColor || "#1A1A1A",
      borderRadius: 24,
      padding: 16,
      maxHeight: "80%",
    },
     modalBox2: {
      backgroundColor:
        ui?.modalBgColor || "#1A1A1A",
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