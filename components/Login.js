import { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import SecondaryButton from "./buttons/SecondaryButton";
import colors from "../constants/colors";
import { login } from "../util/auth";
import { AuthContext } from "../store/auth-context";
import { BasicContext } from "../store/basic-context";
import { getTournaments } from "../util/https";
function LoginScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const authCtx = useContext(AuthContext);
  const basicCtx = useContext(BasicContext);
  const tournament_name = basicCtx.getTournamentName();

  async function handleLogin() {
    console.log("Logging in with:", username, password);

    const token = await login(username, password);
    const tournament = await getTournaments(tournament_name);

    console.log(tournament);
    // check if that admin is for correct tournament
    if (username === tournament.adminMail) {
      authCtx.authenticate({ token: token, tournament_name: tournament_name });
      console.log("DID IT");
    } else {
      Alert.alert(
        "Authentication failed!",
        "This user is not autenticated for this tournament"
      );
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
            size={18}
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
              // secureTextEntry={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
              autoCapitalize="none"
            />
            <Button title="Login" onPress={handleLogin} />
            <Button title="Close" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    paddingRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default LoginScreen;