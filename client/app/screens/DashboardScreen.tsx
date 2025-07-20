import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import ApiService from "../services/api";
import { logout } from "../utils/auth";

const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen({ navigation, onLogout }: any) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await ApiService.getPaymentStats();
      setStats(data);
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  const formatCurrency = (amount: number) => {
    return `${amount?.toLocaleString() || 0}`;
  };
  const prepareChartData = () => {
    if (!stats?.revenueByDay?.length) {
      return {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }],
      };
    }

    const rawLabels = stats.revenueByDay.map((item: any) => {
      const date = new Date(item._id);
      return date.toLocaleDateString("en-US", { weekday: "short" });
    });

    const rawData = stats.revenueByDay.map((item: any) => item.revenue);

    // Ensure at least 2 points
    const labels = rawLabels.slice(-7);
    let data = rawData.slice(-7);

    if (data.length === 1) {
      labels.push("Next");
      data.push(0); // pad with a 0
    }

    return {
      labels,
      datasets: [{ data }],
    };
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Payment Dashboard</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Payments Today</Text>
          <Text style={styles.statNumber}>
            {stats?.totalPaymentsToday || 0}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>This Week</Text>
          <Text style={styles.statNumber}>{stats?.totalPaymentsWeek || 0}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Revenue</Text>
          <Text style={styles.statNumber}>
            {formatCurrency(stats?.totalRevenue || 0)}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Failed Transactions</Text>
          <Text style={[styles.statNumber, styles.failedText]}>
            {stats?.failedTransactions || 0}
          </Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Revenue (Last 7d)</Text>
        <LineChart
          data={prepareChartData()}
          width={screenWidth - 16}
          height={220}
          chartConfig={{
            backgroundColor: "#ECE19B",
            backgroundGradientFrom: "#ECE19B",
            backgroundGradientTo: "#eee8c0ff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,

            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#007bff",
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  logoutButton: {
    paddingHorizontal: 15,
  },
  logoutText: {
    color: "#dc3545",
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 6,
    marginTop: 6,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#D7DECE",
    padding: 20,
    marginHorizontal: 3,
    borderRadius: 20,
    gap: 20,
    justifyContent: "space-between",
  },
  statNumber: {
    fontSize: 35,
    fontWeight: "light",
    color: "#000",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#222",
  },
  failedText: {
    color: "#dc3545",
  },
  chartContainer: {
    marginTop: 20,
    padding: 8,
  },
  chartTitle: {
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  chart: {
    borderRadius: 20,
  },
});
