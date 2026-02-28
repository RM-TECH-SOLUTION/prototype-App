import { View } from "react-native";
import React, { useEffect ,useState} from "react";
import CategoryListComponent from "../component/CategoryListComponent";
import orderingStore from "../store/orderingStore";
import useCmsStore from "../store/useCmsStore";

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
  const { cmsData } = useCmsStore();

  const [categoryUiConfig, setCategoryUiConfig] = useState({});

  // console.log(cartItems,"cartItemshh");

  useEffect(() => {
  if (!Array.isArray(cmsData)) return;

  const config = cmsData.find(
    (item) => item.modelSlug === "categoryPageConfiguration"
  );

  if (!config?.cms) return;

  const formatted = Object.values(config.cms).reduce((acc, field) => {
    acc[field.fieldKey] = field.fieldValue;
    return acc;
  }, {});

  setCategoryUiConfig(formatted);

}, [cmsData]);
  

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
         getCart={getCart}
        uiConfig={categoryUiConfig}
      />
    </View>
  );
};

export default CategoryContainer;
