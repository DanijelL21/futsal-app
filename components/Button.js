import { Pressable, Text, View, StyleSheet, Platform } from "react-native";

function PrimaryButton({ onPress, buttonText }) {
  return (
    <Pressable
      style={({ pressed }) =>
        pressed ? [styles.buttonStyle, styles.pressed] : styles.buttonStyle
      }
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{buttonText}</Text>
    </Pressable>
  );
}

export default PrimaryButton;

const styles = StyleSheet.create({
  buttonStyle: {
    paddingVertical: 10, // koliko ce izduzen bit button u visinu
    paddingHorizontal: 16, // koliko ce izduzen bit button
    margin: 16, // spacing around every box
    backgroundColor: "#5b2d05",
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
    color: "#c64545",
    fontSize: 15,
    fontWeight: "bold",
  },
});

// NOTE: WHEN USING BUTTON LIKE THIS, BUTTON SHOULD BE WRAPEED WITH VIEW WITH STYLE THAT HAS  overflow: "hidden",

// FLAT LIST + BUTTON

// if we have a list of objects like

// item = [{"id":1, "description";"Dummy"},{},...], we can set input in pressable component to be identicaly like
// description, id and then in we can pass list like {...item} and it will automatically take that values. This is usefull when using flat list
