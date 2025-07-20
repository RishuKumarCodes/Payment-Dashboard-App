import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface Transaction {
  _id: string;
  amount: number;
  receiver: string;
  status: string;
  method: string;
  createdAt: string;
}

interface Props {
  transaction: Transaction;
  onPress: () => void;
}

export default function TransactionCard({ transaction, onPress }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "#28a745";
      case "failed":
        return "#dc3545";
      case "pending":
        return "#ffc107";
      default:
        return "#6c757d";
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount?.toLocaleString() || 0}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.amount}>{formatCurrency(transaction.amount)}</Text>
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

      <View style={styles.details}>
        <Text style={styles.receiver}>To: {transaction.receiver}</Text>
        <Text style={styles.method}>
          {transaction.method.replace("_", " ").toUpperCase()}
        </Text>
      </View>

      <Text style={styles.date}>{formatDate(transaction.createdAt)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderBottomWidth: 0.5,
    borderColor: "#aaa",
    padding: 16,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  details: {
    marginBottom: 8,
  },
  receiver: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  method: {
    fontSize: 12,
    color: "#007bff",
    fontWeight: "500",
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
});
