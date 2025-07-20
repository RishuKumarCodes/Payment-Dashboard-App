import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import ApiService from "../services/api";
import { AntDesign } from "@expo/vector-icons";

export default function TransactionDetailsScreen({ route, navigation }: any) {
  const { id } = route.params;
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransaction();
  }, []);

  const loadTransaction = async () => {
    try {
      const data = await ApiService.getPaymentById(id);
      setTransaction(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load transaction details");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "#28a745";
      case "failed":
        return "#dc3545";
      case "pending":
        return "#f7b900ff";
      default:
        return "#6c757d";
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount?.toLocaleString() || 0}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading transaction details...</Text>
      </View>
    );
  }

  if (!transaction) {
    return (
      <View style={styles.centered}>
        <Text>Transaction not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          { backgroundColor: getStatusColor(transaction.status) },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Transaction Details</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <View style={styles.amountContainer}>
            <Text style={styles.amount}>
              {formatCurrency(transaction.amount)}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(transaction.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {transaction.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.label}>Transaction ID:</Text>
            <Text style={styles.value}>{transaction._id}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Receiver:</Text>
            <Text style={styles.value}>{transaction.receiver}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Payment Method:</Text>
            <Text style={styles.value}>
              {transaction.method.replace("_", " ").toUpperCase()}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>
              {formatDate(transaction.createdAt)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "white",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  amount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 20,
  },
  detailRow: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#888",
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
    flex: 2,
    textAlign: "right",
    fontFamily: "monospace",
  },
});
