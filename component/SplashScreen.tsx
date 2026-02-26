import React, { useEffect, useRef, useState } from "react";
import { View, Image, StyleSheet, Animated, Dimensions } from "react-native";
import splashScreenImage from "../assets/bgHome1.png";
import logoImage from "../assets/AR-Fashion.png"; 
import useCmsStore from '../store/useCmsStore';
import useSessionStore from "../store/useSessionStore";

const { width, height } = Dimensions.get("window");
 const LOGO_SIZE = 200;

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const { getCmsData ,cmsData} = useCmsStore();
  const [splashCmsData, setSplashCmsData] = useState([]);
  const { user} = useSessionStore();


  useEffect(()=>{
    getCmsData()
  },[])

useEffect(() => {
  if (!Array.isArray(cmsData)) return;
  const splashItem = cmsData.find(
    (item) => item.modelSlug === "splashScreen"
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
    // Fade-in background image
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Rotate logo 360 degrees once
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 1500, // 1.5 seconds for one rotation
      useNativeDriver: true,
    }).start();

    // Navigate after delay
    const timeout = setTimeout(() => {
      if (user) {
        navigation.replace("Home"); 
      }
      else{
         navigation.replace("Walkthrough"); 
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [navigation,splashCmsData]);

  // Interpolate rotation from 0 to 360 degrees
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
  source={
    splashCmsData?.backgroundImage
      ? { uri: splashCmsData.backgroundImage }
      : splashScreenImage // fallback local image
  }
  style={[styles.fullImage, { opacity: fadeAnim }]}
  resizeMode="cover"
/>

<Animated.Image
  source={
    splashCmsData?.logo
      ? { uri: splashCmsData.logo }
      : logoImage // fallback local logo
  }
  style={[
    styles.logo,
    { transform: [{ rotate: rotateInterpolate }] },
  ]}
/>

    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  fullImage: {
    width: width,
    height: height,
    position: "absolute",
    top: 0,
    left: 0,
  },
 logo: {
  width: LOGO_SIZE,
  height: LOGO_SIZE,
  borderRadius: LOGO_SIZE / 2, 
  zIndex: 2,
}
});
