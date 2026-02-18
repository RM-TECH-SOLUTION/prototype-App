import { View } from "react-native";
import React, { useEffect } from "react";
import CategoryListComponent from "../component/CategoryListComponent";
import orderingStore from "../store/orderingStore";

const CategoryContainer = () => {

  const {
    catalogModels,
    catalogItems,
    cartItems,
    selectedCatalogId,
    loading,
    getCatalogModels,
    getCatalogItems,
    addToCart,
    updateQty,
    deleteCartItem,
    getCart
  } = orderingStore();

  useEffect(() => {
    getCatalogModels();
    getCart(); 
  }, []);

  const handleSelectCategory = (catalogId) => {
    getCatalogItems(catalogId);
  };

  console.log(cartItems,"cartItemshh");
  

  return (
    <View style={{ flex: 1 }}>
      <CategoryListComponent
        CATEGORIES={catalogModels}
        ITEMS={catalogItems}
        cartItems={cartItems}
        onSelectCategory={handleSelectCategory}
        loadingItems={loading}
        addToCart={addToCart}
        updateQty={updateQty}
        deleteCartItem={deleteCartItem}
      />
    </View>
  );
};

export default CategoryContainer;
