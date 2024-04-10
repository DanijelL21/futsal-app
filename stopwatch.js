// Stopwatch.js
import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { sendTime } from "./util/https";

function Stopwatch({ updateSeconds }) {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  async function sendTimeHandler(params) {
    const res = await sendTime(params);
  }

  useEffect(() => {
    let intervalId;
    if (isActive) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => {
          const newSeconds = prevSeconds + 1;
          // if (newSeconds % 60 === 0) {
          //   console.log("ENTERED");
          //   sendTimeHandler({ time: Math.floor(newSeconds / 60) }); // Send time to Firebase Cloud Function every minute
          // }
          return newSeconds;
        });
        updateSeconds(newSeconds);
      }, 1000); // if isActive is on, it will change time every 1000 miliseconds
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isActive]);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const formatTime = () => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Pressable onPress={handleToggle}>
      <Text style={styles.time}>{formatTime()}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  time: {
    fontSize: 30,
  },
});

export default Stopwatch;
