// SplashScreen.js
import React, { useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import Background from "../components/Background";
export default function SplashScreen() {
  const navigation = useNavigation();
  const animationRef = useRef(null); // Initialize the ref correctly

  useEffect(() => {
    animationRef.current?.play(); // Play the animation

    // Optional: Specify a frame range to play
    animationRef.current?.play(30, 120);

    // Navigate to Main Tab Navigator after 10 seconds
    const timer = setTimeout(() => {
      navigation.replace("MainScreen", { screen: "News" }); // Replace Splash with MainStack and navigate to News
    }, 1000);

    // Cleanup timeout on component unmount
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <Background>
      <LottieView
        ref={animationRef} // Using useRef correctly
        source={require("../Futsalapp.json")}
        style={{ width: "100%", height: "100%" }}
      />
    </Background>
  );
}
