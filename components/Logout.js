import { useContext } from "react";
import { View, StyleSheet, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import SecondaryButton from "./buttons/SecondaryButton";
import colors from "../constants/colors";
import { AuthContext } from "../store/auth-context";
import dimensions from "../constants/dimensions";
const ICON_SIZE = dimensions.screenWidth * 0.04;

function LogOutScreen() {
  const authCtx = useContext(AuthContext);

  async function handleLogOut() {
    Alert.alert(
      "Confirm Changes",
      `Are you sure you want to log out?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => authCtx.logout(),
        },
      ],
      { cancelable: false }
    );
  }

  return (
    <View>
      <SecondaryButton onPress={() => handleLogOut()}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="log-out"
            color={colors.headerTextColor}
            size={ICON_SIZE}
          />
        </View>
      </SecondaryButton>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    paddingRight: 10,
  },
});

export default LogOutScreen;
