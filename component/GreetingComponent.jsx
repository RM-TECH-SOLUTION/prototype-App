import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function GreetingComponent({
  greetingConfig = {},
}) {
  const { message, description } = useMemo(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return {
        message:
          greetingConfig?.morningMessage ||
          "Good Morning",
        description:
          greetingConfig?.morningMessageDescription ||
          "",
      };
    }

    if (hour >= 12 && hour < 17) {
      return {
        message:
          greetingConfig?.afternoonMessage ||
          "Good Afternoon",
        description:
          greetingConfig?.afternoonMessageDescription ||
          "",
      };
    }

    if (hour >= 17 && hour < 21) {
      return {
        message:
          greetingConfig?.eveningMessage ||
          "Good Evening",
        description:
          greetingConfig?.eveningMessageDescription ||
          "",
      };
    }

    return {
      message:
        greetingConfig?.nightMessage ||
        "Good Night",
      description:
        greetingConfig?.nightMessageDescription ||
        "",
    };
  }, [greetingConfig]);

  return (
    <View style={styles.container}>
      <Text style={styles.greetingText}>
        {message}
      </Text>

      {description ? (
        <Text style={styles.subText}>
          {description}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  greetingText: {
    fontSize: 16,
    color: "#E50914",
    fontWeight: "bold",
  },
  subText: {
    fontSize: 13,
    color: "#ddd",
    marginTop: 2,
  },
});