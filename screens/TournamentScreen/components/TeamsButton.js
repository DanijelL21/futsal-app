import { Pressable, Text, View, StyleSheet, Platform } from "react-native";

function TeamsButton({ onPress, team, group }) {
  return (
    <Pressable
      style={({ pressed }) =>
        pressed ? [styles.buttonStyle, styles.pressed] : styles.buttonStyle
      }
      onPress={onPress}
    >
      <Text style={styles.buttonText}>
        {team} {group}
      </Text>
    </Pressable>
  );
}

export default TeamsButton;

const styles = StyleSheet.create({
  buttonStyle: {
    paddingVertical: 10, // koliko ce izduzen bit button u visinu
    paddingHorizontal: 16, // koliko ce izduzen bit button
    margin: 16, // spacing around every box
    backgroundColor: "#f4a460",
    borderRadius: 30, // so we don't have sharp edges
    marginTop: 15, // margin from upper component
    marginHorizontal: 10, // so the buttons don't touch
    // shadows

    elevation: 4, // shadow on android
    backgroundColor: "white", // this is needed because of shadow for ios
    shadowColor: "black", // this is for ios shadow with shadowOpacity, shadowOffset and shadowRadius
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    overflow: Platform.OS === "android" ? "hidden" : "visible", // for ripple effect so the ripple don't go over button
  },
  pressed: {
    opacity: 0.75,
  },
  buttonText: {
    color: "#060606",
    fontSize: 15,
    fontWeight: "bold",
  },
});
