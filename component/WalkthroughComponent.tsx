import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
} from "react-native";

const { width, height } = Dimensions.get("window");

const WalkthroughComponent = ({ onFinish, walkthroughData = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < walkthroughData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      onFinish && onFinish();
    }
  };

  const handleScroll = (event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / width
    );
    setCurrentIndex(index);
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      {/* Background Image */}
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Overlay Content */}
      <View style={styles.overlay}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={walkthroughData}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {/* Pagination Dots */}
      <View style={styles.dotsContainer}>
        {walkthroughData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentIndex ? "#ff6347" : "#ccc",
              },
            ]}
          />
        ))}
      </View>

      {/* CTA Button */}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {currentIndex === walkthroughData.length - 1
            ? "Get Started"
            : "Next"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default WalkthroughComponent;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  slide: {
    width,
    height,
  },
  image: {
    width: "100%",
    height: "75%",
  },
  overlay: {
    position: "absolute",
    bottom: 120,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "#fff",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    width:"100%"
  },
  description: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "700",
    textShadowColor: "#2E7D32",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  dotsContainer: {
    position: "absolute",
    bottom: 100,
    flexDirection: "row",
    alignSelf: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  button: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#ff6347",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
