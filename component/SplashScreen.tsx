import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  Text,
} from "react-native";
import splashScreenImage from "../assets/bgHome1.png";
import logoImage from "../assets/AR-Fashion.png";
import useCmsStore from "../store/useCmsStore";
import useSessionStore from "../store/useSessionStore";

const { width, height } = Dimensions.get("window");
const LOGO_SIZE = 160;

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const bgScale = useRef(new Animated.Value(1)).current;

  const { getCmsData, cmsData } = useCmsStore();
  const { user } = useSessionStore();

  const [splashCmsData, setSplashCmsData] = useState({});

  useEffect(() => {
    getCmsData();
  }, []);

  useEffect(() => {
    if (!Array.isArray(cmsData)) return;

    const splashItem = cmsData.find(
      (item) => item.modelSlug === "splashConfiguration"
    );

    if (!splashItem || !splashItem.cms) return;

    const formattedCms = Object.keys(splashItem.cms).reduce(
      (acc, key) => {
        acc[key] = splashItem.cms[key]?.fieldValue;
        return acc;
      },
      {}
    );

    setSplashCmsData(formattedCms);
  }, [cmsData]);

  useEffect(() => {
    // Smooth fade in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(bgScale, {
        toValue: 1.1,
        duration: 4000,
        useNativeDriver: true,
      }),
    ]).start();

    const timeout = setTimeout(() => {
      if (user) {
        navigation.replace("Home");
      } else {
        navigation.replace("Walkthrough");
      }
    }, splashCmsData?.autoNavigationTimeout || 3000);

    return () => clearTimeout(timeout);
  }, [navigation, splashCmsData]);

  return (
    <View style={styles.container}>
      {/* Background Image with zoom effect */}
      <Animated.Image
        source={
          splashCmsData?.backgroundImage
            ? { uri: splashCmsData.backgroundImage }
            : splashScreenImage
        }
        style={[
          styles.fullImage,
          {
            opacity: fadeAnim,
            transform: [{ scale: bgScale }],
          },
        ]}
        resizeMode="cover"
      />

      {/* Dark Overlay for premium look */}
      <View style={styles.overlay} />

      {/* Logo + Text Section */}
      <Animated.View
        style={[
          styles.centerContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={
            splashCmsData?.logoImage
              ? { uri: splashCmsData.logoImage }
              : logoImage
          }
          style={styles.logo}
          resizeMode="contain"
        />

      </Animated.View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  fullImage: {
    width: width,
    height: height,
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    marginBottom: 20,
  },
  brandText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 14,
    color: "#E50914",
    marginTop: 6,
    letterSpacing: 1,
  },
});