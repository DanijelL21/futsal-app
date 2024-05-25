import { useState, useContext } from "react";
import { View, StyleSheet, Modal, TextInput, Button } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import SecondaryButton from "./SecondaryButton";
import colors from "../constants/colors";
import { login } from "../util/auth";
import { AuthContext } from "../store/auth-context";

function LoginScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const authCtx = useContext(AuthContext);

  async function handleLogin() {
    console.log("Logging in with:", username, password);
    const token = await login(username, password);
    authCtx.authenticate(token);
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
