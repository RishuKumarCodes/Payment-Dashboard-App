import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import ApiService from "../services/api";
import TransactionCard from "../components/TransactionCard";
import TransactionFiltersModal from "../components/TransactionFiltersModal";
import { Feather } from "@expo/vector-icons";

export default function TransactionListScreen({ navigation }: any) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ status: "", method: "", page: 1 });
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadTransactions(true);
  }, [filters.status, filters.method]);

  const loadTransactions = async (reset = false) => {
    if (loading && !reset) return;

    try {
      const page = reset ? 1 : filters.page;
      const apiFilters: any = { page, limit: 10 };

      if (filters.status) apiFilters.status = filters.status;
      if (filters.method) apiFilters.method = filters.method;

      const response = await ApiService.getPayments(apiFilters);
      const transactionsData = response.data || response || [];
      const totalPages = response.totalPages || 1;

      if (reset) {
        setTransactions(transactionsData);
      } else {
        setTransactions((prev) => [...prev, ...transactionsData]);
      }

      setHasMore(page < totalPages);
      setFilters((prev) => ({ ...prev, page: page + 1 }));
    } catch (error) {
      console.error("Failed to load transactions:", error);
      Alert.alert("Error", "Failed to load transactions");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setFilters((prev) => ({ ...prev, page: 1 }));
    loadTransactions(true);
  };

  const loadMore = () => {
    if (hasMore && !loading) loadTransactions();
  };

  const applyFilters = () => {
    setShowFilters(false);
    setFilters((prev) => ({ ...prev, page: 1 }));
    setLoading(true);
    loadTransactions(true);
  };

  const clearFilters = () => {
    setFilters({ status: "", method: "", page: 1 });
    setShowFilters(false);
    setLoading(true);
    loadTransactions(true);
  };

  const renderTransaction = ({ item }: any) => (
    <TransactionCard
      transaction={item}
      onPress={() =>
        navigation.navigate("TransactionDetails", { id: item._id })
      }
    />
  );

  const renderFooter = () => {
    if (!loading || refreshing) return null;
    return (
      <View style={styles.loading}>
        <Text>Loading more...</Text>
      </View>
    );
  };

  const Header = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Transactions</Text>
      <TouchableOpacity
        onPress={() => setShowFilters(true)}
        style={styles.filterButton}
      >
        <Feather name="filter" size={20} color="black" />
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && transactions.length === 0) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.centerContainer}>
          <Text style={styles.centerText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (!loading && transactions.length === 0) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.centerContainer}>
          <Text style={styles.centerText}>No transactions found.</Text>
        </View>
        <TransactionFiltersModal
          visible={showFilters}
          filters={filters}
          setFilters={setFilters}
          onClose={() => setShowFilters(false)}
          onApply={applyFilters}
          onClear={clearFilters}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContainer}
      />
      <TransactionFiltersModal
        visible={showFilters}
        filters={filters}
        setFilters={setFilters}
        onClose={() => setShowFilters(false)}
        onApply={applyFilters}
        onClear={clearFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  listContainer: { paddingVertical: 10 },
  loading: { padding: 20, alignItems: "center" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  centerText: { fontSize: 16, color: "#666" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "white",
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#333" },
  filterButton: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#c0deffff",
    borderRadius: 60,
  },
  filterButtonText: { color: "black", fontWeight: "bold" },
});
