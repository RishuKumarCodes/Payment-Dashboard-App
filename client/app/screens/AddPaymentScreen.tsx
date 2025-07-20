// app/screens/AddPaymentScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import ApiService from "../services/api";

export default function AddPaymentScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    amount: "",
    receiver: "",
    status: "pending",
    method: "credit_card",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.amount || isNaN(Number(formData.amount))) {
      Alert.alert("Error", "Please enter a valid amount");
      return false;
    }
    if (!formData.receiver.trim()) {
      Alert.alert("Error", "Please enter a receiver name");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const paymentData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      await ApiService.createPayment(paymentData);
      Alert.alert("Success", "Payment created successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Reset form
            setFormData({
              amount: "",
              receiver: "",
              status: "pending",
              method: "credit_card",
            });
            // Navigate to transactions list
            navigation.navigate("Transactions");
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to create payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add New Payment</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              value={formData.amount}
              onChangeText={(value) => handleInputChange("amount", value)}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Receiver</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter receiver name"
              value={formData.receiver}
              onChangeText={(value) => handleInputChange("receiver", value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <Picker.Item label="Pending" value="pending" />
                <Picker.Item label="Success" value="success" />
                <Picker.Item label="Failed" value="failed" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Payment Method</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.method}
                onValueChange={(value) => handleInputChange("method", value)}
              >
                <Picker.Item label="Credit Card" value="credit_card" />
              </Picker>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Create Payment</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  form: {
    padding: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  submitButton: {
    width: "auto",
    marginLeft: "auto",
    backgroundColor: "#000",
    borderRadius: 40,
    padding: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
