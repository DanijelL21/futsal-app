import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import Mailer from "react-native-mail";

const SendEmailScreen = () => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSendEmail = () => {
    Mailer.mail(
      {
        subject: subject,
        recipients: ["leonimail100@gmail.com"],
        body: "<b>A Bold Body</b>",
        isHTML: true,
      },
      (error, event) => {
        if (error) {
          Alert.alert("Error", "Could not send mail. Please try again later.");
        } else {
          Alert.alert("Success", "Email sent successfully.");
        }
      }
    );
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Subject"
        value={subject}
        onChangeText={setSubject}
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 20,
        }}
      />
      <TextInput
        placeholder="Email Body"
        value={body}
        onChangeText={setBody}
        multiline
        style={{
          height: 100,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 20,
        }}
      />
      <Button title="Send Email" onPress={handleSendEmail} />
    </View>
  );
};

export default SendEmailScreen;
