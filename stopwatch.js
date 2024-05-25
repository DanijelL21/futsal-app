import React, { useState, useEffect } from "react";
import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";

function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedSeconds, setEditedSeconds] = useState("00");

  useEffect(() => {
    let intervalId;
    if (isActive) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isActive]);

  const handleToggle = () => {
    if (!isEditMode) {
      setIsActive(!isActive);
    }
  };

  const handleLongPress = () => {
    setIsEditMode(true);
    setEditedSeconds(formatTime(seconds)); // Set the edited seconds to current formatted time
    setIsActive(false); // Pause the stopwatch when in edit mode
  };

  const handleChange = (value) => {
    setEditedSeconds(value);
  };

  const handleSaveEdit = () => {
    setIsEditMode(false);
    const updatedSeconds = parseTimeToSeconds(editedSeconds);
    setSeconds(updatedSeconds);
    setIsActive(true); // Resume the stopwatch after editing
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const parseTimeToSeconds = (formattedTime) => {
    const [minutesStr, secondsStr] = formattedTime.split(":");
    const minutes = parseInt(minutesStr, 10);
    const seconds = parseInt(secondsStr, 10);
    return minutes * 60 + seconds;
  };

  return (
    <View>
      <Pressable onPress={handleToggle} onLongPress={handleLongPress}>
        {isEditMode ? (
          <TextInput
            style={styles.input}
            value={editedSeconds}
            onChangeText={(value) => handleChange(value)}
            onBlur={handleSaveEdit}
            keyboardType="numeric"
            selectTextOnFocus={true} // Ensure the entire text is selected on focus
          />
        ) : (
          <Text style={styles.time}>{formatTime(seconds)}</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  time: {
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Stopwatch;
