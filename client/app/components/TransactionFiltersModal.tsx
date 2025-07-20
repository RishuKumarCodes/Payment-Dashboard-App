import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function TransactionFiltersModal({
  visible,
  filters,
  setFilters,
  onApply,
  onClear,
  onClose,
}: any) {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Options */}
          <View style={styles.filtersContainer}>
            <View style={styles.filterGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={filters.status}
                  onValueChange={(value) =>
                    setFilters((prev: any) => ({ ...prev, status: value }))
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="All Statuses" value="" />
                  <Picker.Item label="Success" value="success" />
                  <Picker.Item label="Failed" value="failed" />
                  <Picker.Item label="Pending" value="pending" />
                </Picker>
              </View>
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.label}>Payment Method</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={filters.method}
                  onValueChange={(value) =>
                    setFilters((prev: any) => ({ ...prev, method: value }))
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="All Methods" value="" />
                  <Picker.Item label="Credit Card" value="credit_card" />
                  <Picker.Item label="Debit Card" value="debit_card" />
                  <Picker.Item label="PayPal" value="paypal" />
                  <Picker.Item label="Bank Transfer" value="bank_transfer" />
                </Picker>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.modalButtons}>
            <TouchableOpacity
              onPress={onClear}
              style={[styles.modalButton, styles.clearButton]}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onApply}
              style={[styles.modalButton, styles.applyButton]}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    minHeight: 320,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  filtersContainer: {
    gap: 24,
  },
  filterGroup: {
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    letterSpacing: -0.2,
  },
  pickerContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
    overflow: "hidden",
    paddingHorizontal: 4,
  },
  picker: {
    height: 56,
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 40,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  clearButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  applyButton: {
    backgroundColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  clearButtonText: {
    color: "#6c757d",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: -0.2,
  },
  applyButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: -0.2,
  },
});