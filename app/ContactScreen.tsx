import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const COLORS = {
  primary: "#FDB022",
  dark: "#1a1a2e",
  background: "#f7f7f7",
  white: "#fff",
  text: "#1a1a2e",
  textLight: "#555",
  gray: "#ccc",
};

export default function ContactScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    // handle message sending logic here
    console.log({ name, email, subject, message });
    alert("Message sent!");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/*<Text style={styles.header}>Get in Touch</Text>*/}
        <Text style={styles.subHeader}>
          We'd love to hear from you. Send us a message and we'll respond as
          soon as possible.
        </Text>

        {/* Form */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Subject"
            value={subject}
            onChangeText={setSubject}
          />
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Message"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity style={styles.button} onPress={handleSendMessage}>
            <Text style={styles.buttonText}>Send Message</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Contact Information</Text>
          <Text style={styles.infoText}>📧 Email: support@daybee.lk</Text>
          <Text style={styles.infoText}>📞 Phone: +94 11 234 5678</Text>
          <Text style={styles.infoText}>
            🏢 Office: 123 Business Tower, Colombo 03, Sri Lanka
          </Text>
          <Text style={styles.infoText}>
            ⏰ Business Hours: Mon-Fri 9:00 AM - 6:00 PM, Sat 9:00 AM - 1:00 PM
          </Text>
        </View>

        {/* Immediate Help */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpTitle}>Need Immediate Help?</Text>
          <Text style={styles.helpText}>
            Our support team is available to assist you with any questions or
            concerns.
          </Text>
          <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpButtonText}>Visit Help Center</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.dark,
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 20,
    marginTop: 50,
  },
  formContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: COLORS.dark,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: COLORS.white,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
  },
  infoContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: COLORS.dark,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 10,
  },
  helpContainer: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: COLORS.white,
  },
  helpText: {
    fontSize: 14,
    color: COLORS.white,
    marginBottom: 12,
  },
  helpButton: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  helpButtonText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 14,
  },
});
