import React, { useEffect ,useState} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CheckoutComponent from "../component/CheckoutComponent";
import orderingStore from "../store/orderingStore";
import useAuthStore from "../store/useAuthStore";
import useCmsStore from "../store/useCmsStore";

const CheckoutContainer = ({ navigation }) => {
  const {
    getCart,
    cartItems,
    loading,
    updateQty,
    deleteCartItem,
    getMerchant,
    merchantData,
    clearCart
  } = orderingStore();
  const {saveUserAddress,getProfile,profile} = useAuthStore()
  const { cmsData } = useCmsStore();
const [checkoutUi, setCheckoutUi] = useState({});
const [addressUiConfig, setAddressUiConfig] = useState({});

  useEffect(() => {
    getCart();
    getMerchant()
    getProfile()
  }, []);
  // console.log(merchantData,"merchantData");

  useEffect(() => {
  if (!Array.isArray(cmsData)) return;

  const config = cmsData.find(
    (item) => item.modelSlug === "checkoutPageConfiguration"
  );

  if (!config?.cms) return;

  const formatted = Object.values(config.cms).reduce((acc, field) => {
    acc[field.fieldKey] = field.fieldValue;
    return acc;
  }, {});

  setCheckoutUi(formatted);
}, [cmsData]);

useEffect(() => {
  if (!Array.isArray(cmsData)) return;

  const config = cmsData.find(
    (item) => item.modelSlug === "addressPageConfiguration"
  );

  if (!config?.cms) return;

  const formatted = Object.values(config.cms).reduce((acc, field) => {
    acc[field.fieldKey] = field.fieldValue;
    return acc;
  }, {});

  setAddressUiConfig(formatted);

}, [cmsData]);
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:"#F57C00" }}>
      <CheckoutComponent
        navigation={navigation}
        cartItems={cartItems}
        loading={loading}
        updateQty={updateQty}
        deleteCartItem={deleteCartItem}
        getCart={getCart}
        merchantData={merchantData}
        clearCart={clearCart}
        saveUserAddress={saveUserAddress}
        profile={profile}
        getProfile={getProfile}
        uiConfig={checkoutUi}
        addressUiConfig={addressUiConfig}
      />
    </SafeAreaView>
  );
};

export default CheckoutContainer;
