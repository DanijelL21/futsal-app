import React, { useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import Background from "../components/Background";
import { View } from "react-native";
export default function SplashScreen() {
  const navigation = useNavigation();
  const animationRef = useRef(null);

  useEffect(() => {
    animationRef.current?.play();

    // animationRef.current?.play(30, 120);

    const timer = setTimeout(() => {
      navigation.replace("MainScreen", { screen: "News" });
    }, 1600);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View>
      <LottieView
        ref={animationRef} // Using useRef correctly
        source={require("../assets/fin.json")}
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
}
