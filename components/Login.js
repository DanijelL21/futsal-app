// External Libraries
import { useState, useContext } from "react";
import { View, StyleSheet, Modal, TextInput, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

// Internal Modules
import SecondaryButton from "./buttons/SecondaryButton";
import PrimaryButton from "./buttons/PrimaryButton";
import colors from "../constants/colors";
import dimensions from "../constants/dimensions";
import { AuthContext } from "../store/auth-context";
import { BasicContext } from "../store/basic-context";
import { login } from "../util/auth";
import { getCompetition } from "../util/https";

function LoginScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const authCtx = useContext(AuthContext);
  const basicCtx = useContext(BasicContext);
  const competitionInfo = basicCtx.getCompetitionData();
  const competitionName = competitionInfo.competitionName;

  const ICON_SIZE = dimensions.screenWidth * 0.04;

  async function handleLogin() {
    console.log("Logging in with:", username, password);

    const token = await login(username, password);
    const competition = await getCompetition(
      competitionInfo.mode,
      competitionName
    );
    // check if that admin is for correct competition
    if (username === competition.adminMail) {
      authCtx.authenticate({ token: token, competitionName: competitionName });
    }
    setIsModalVisible(false);
  }

  return (
    <View>
      <SecondaryButton onPress={() => setIsModalVisible(true)}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="person-outline"
            color={colors.headerTextColor}
            size={ICON_SIZE}
          />
        </View>
      </SecondaryButton>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={(text) => setUsername(text)}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
              autoCapitalize="none"
            />
            <View style={styles.buttonContainer}>
              <PrimaryButton
                onPress={handleLogin}
                buttonText={"Login"}
                buttonStyle={{ marginRight: dimensions.screenWidth * 0.1 }}
                buttonTextStyle={{ color: "blue" }}
              />
              <PrimaryButton
                onPress={() => setIsModalVisible(false)}
                buttonText={"Close"}
                buttonTextStyle={{ color: "blue" }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    paddingRight: dimensions.screenWidth * 0.03,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: dimensions.screenWidth * 0.05,
    borderRadius: 10,
    width: "60%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: dimensions.screenWidth * 0.02,
    marginBottom: dimensions.screenWidth * 0.02,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default LoginScreen;
