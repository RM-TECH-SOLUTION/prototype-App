import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";

import CategoryContainer from "../container/CategoryContainer";
import AccountComponent from "./AccountComponent";

import nutPng from "../assets/AR-Fashion.png";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import orderingStore from "../store/orderingStore";



const Tab = createBottomTabNavigator();
const { width } = Dimensions.get("window");

/* ================= CUSTOM HEADER ================= */

const CustomHeader = () => {
  const navigation = useNavigation();

  const { getCart, cartItems } = orderingStore();

  // load cart once
  useEffect(() => {
    getCart();
  }, []);

  // total quantity from cart
  const totalQty = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  return (
    <SafeAreaView
      edges={["top"]}
      style={styles.headerContainer}
    >
      {/* LOGO */}
      <Image
        source={nutPng}
        style={styles.headerLogo}
      />

      {/* CART ICON */}
      <TouchableOpacity
        style={styles.cartIconContainer}
        onPress={() => navigation.navigate("Checkout")}
      >
        <Ionicons name="cart-outline" size={26} color="#fff" />

        {/* BADGE */}
        {totalQty > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalQty}</Text>
          </View>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};



/* ================= HOME SCREEN ================= */

const HomeScreen = ({
  homeBanner = null,
  homeScreenSlider = [],
  trendingNow = [],
  newArrivals = [],
}) => {
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  /* 🔁 AUTO SCROLL SLIDER */
  useEffect(() => {
    if (!homeScreenSlider.length) return;

    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;

      if (nextIndex >= homeScreenSlider.length) {
        nextIndex = 0;
      }

      sliderRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, homeScreenSlider.length]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* 🟠 HOME SCREEN SLIDER */}
      {homeScreenSlider.length > 0 && (
        <FlatList
          ref={sliderRef}
          data={homeScreenSlider}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => i.toString()}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x / width
            );
            setCurrentIndex(index);
          }}
          renderItem={({ item }) => (
            <View style={styles.sliderItem}>
              <Image
                source={{ uri: item.image }}
                style={styles.sliderImage}
              />
              {item.buttonTittle && (
                <TouchableOpacity style={styles.sliderButton}>
                  <Text style={styles.sliderButtonText}>
                    {item.buttonTittle}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}

      {/* 🖼 HOME BANNER */}
      {homeBanner && (
        <View style={styles.featured}>
          <Image
            source={{ uri: homeBanner.image }}
            style={styles.featuredImg}
          />
          <Text style={styles.featuredText}>{homeBanner.title}</Text>
        </View>
      )}

      {/* 🔥 TRENDING */}
      {trendingNow.length > 0 && (
        <>
          <SectionTitle title="Trending Now 💕" />
          <HorizontalList data={trendingNow} />
        </>
      )}

      {/* 🆕 NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <>
          <SectionTitle title="New Arrivals ✨" />
          <Grid data={newArrivals} />
        </>
      )}

      {/* ❤️ BRAND LINE */}
      <Text style={styles.quote}>
        Fashion that celebrates you 💖
      </Text>
    </ScrollView>
  );
};

/* ================= ORDER SCREEN ================= */

const OrderScreen = () => (
  <View style={{ flex: 1 }}>
    <CategoryContainer />
  </View>
);

/* ================= ACCOUNT SCREEN ================= */

const AccountScreen = () => (
  <View style={{ flex: 1 }}>
    <AccountComponent />
  </View>
);

/* ================= MAIN TABS ================= */

export default function HomeTabs(props) {
  return (
    <Tab.Navigator
      screenOptions={{
        header: () => <CustomHeader />,
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#000",
        tabBarStyle: {
          height: 70,
          paddingBottom: 8,
          backgroundColor: "#F57C00",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={nutPng}
              style={{
                width: 26,
                height: 26,
                tintColor: focused ? "#fff" : "#000",
              }}
            />
          ),
        }}
      >
        {() => <HomeScreen {...props} />}
      </Tab.Screen>

      <Tab.Screen
        name="Order"
        component={OrderScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={nutPng}
              style={{
                width: 26,
                height: 26,
                tintColor: focused ? "#fff" : "#000",
              }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={nutPng}
              style={{
                width: 26,
                height: 26,
                tintColor: focused ? "#fff" : "#000",
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

/* ================= SMALL COMPONENTS ================= */

const SectionTitle = ({ title }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const HorizontalList = ({ data = [] }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {data.map((item, i) => (
      <View key={i} style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.cardImg} />
        <Text style={styles.cardTitle}>{item.title}</Text>
        {item.price && (
          <Text style={styles.cardPrice}>{item.price}</Text>
        )}
      </View>
    ))}
  </ScrollView>
);

const Grid = ({ data = [] }) => (
  <View style={styles.grid}>
    {data.map((item, i) => (
      <View key={i} style={styles.gridItem}>
        <Image source={{ uri: item.image }} style={styles.gridImg} />
        <Text style={styles.cardTitle}>{item.title}</Text>
        {item.price && (
          <Text style={styles.cardPrice}>{item.price}</Text>
        )}
      </View>
    ))}
  </View>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF3E0",
  },

  /* SLIDER */
  sliderItem: {
    width,
    height: 220,
  },
  sliderImage: {
    width: "100%",
    height: "100%",
  },
  sliderButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#F57C00",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sliderButtonText: {
    color: "#fff",
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    margin: 16,
    color: "#E65100",
  },
  card: {
    width: 140,
    marginLeft: 16,
  },
  cardImg: {
    width: "100%",
    height: 170,
    borderRadius: 14,
  },
  cardTitle: {
    marginTop: 6,
    fontWeight: "600",
  },
  cardPrice: {
    color: "#E65100",
    fontWeight: "700",
  },
  featured: {
    margin: 16,
    borderRadius: 18,
    overflow: "hidden",
  },
  featuredImg: {
    width: "100%",
    height: 180,
  },
  featuredText: {
    position: "absolute",
    bottom: 16,
    left: 16,
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
  },
  gridItem: {
    width: "48%",
    margin: "1%",
  },
  gridImg: {
    width: "100%",
    height: 200,
    borderRadius: 16,
  },
  quote: {
    textAlign: "center",
    marginVertical: 24,
    color: "#777",
    fontStyle: "italic",
  },
  headerContainer: {
  backgroundColor: "#F57C00",
  paddingVertical: 12,
  alignItems: "center",
  justifyContent: "center",
},

headerLogo: {
  width: 80,
  height: 80,
  borderRadius: 100,
},

cartIconContainer: {
  position: "absolute",
  right: 16,
  bottom: 20,
},
badge: {
  position: "absolute",
  top: -6,
  right: -6,
  backgroundColor: "red",
  width: 20,
  height: 20,
  borderRadius: 10,
  justifyContent: "center",
  alignItems: "center",
},

badgeText: {
  color: "#fff",
  fontSize: 11,
  fontWeight: "700",
},


});
