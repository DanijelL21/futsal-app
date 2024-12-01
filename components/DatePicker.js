// External Libraries
import { useState, useEffect } from "react";
import { Button, View, Modal, StyleSheet, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

// Internal Modules
import dimensions from "../constants/dimensions";
import colors from "../constants/colors";

const DatePicker = ({ visible, setDate, currentDisplayedDate, onClose }) => {
  const [selectedDay, setSelectedDay] = useState("01");
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [startYear, setStartYear] = useState(0);
  const [days, setDays] = useState([]);

  useEffect(() => {
    let day, month, year;
    if (currentDisplayedDate !== "" && currentDisplayedDate !== "TBD") {
      [day, month, year] = currentDisplayedDate.split(".");
    } else {
      const today = new Date();
      day = formatNumber(today.getDate());
      month = formatNumber(today.getMonth() + 1);
      year = today.getFullYear();
    }

    setSelectedDay(day);
    setSelectedMonth(month);
    setSelectedYear(year.toString());
    setStartYear(parseInt(year));
  }, []);

  useEffect(() => {
    // Update days based on selected month and year
    updateDaysInMonth(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  const updateDaysInMonth = (month, year) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) =>
      formatNumber(i + 1)
    );
    setDays(daysArray);
    // Adjust selectedDay if it exceeds the new number of days
    if (parseInt(selectedDay) > daysInMonth) {
      setSelectedDay(daysArray[daysArray.length - 1]);
    }
  };

  const handleConfirm = () => {
    setDate(`${selectedDay}.${selectedMonth}.${selectedYear}`);
    onClose();
  };

  const formatNumber = (num) => num.toString().padStart(2, "0");

  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.title}>Select Date</Text>
          <Text style={styles.title}>DD.MM.YYYY</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedDay}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedDay(itemValue)}
            >
              {days.map((day) => (
                <Picker.Item key={day} label={day} value={day} />
              ))}
            </Picker>
            <Picker
              selectedValue={selectedMonth}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedMonth(itemValue)}
              numberOfLines={1}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((i) => (
                <Picker.Item
                  key={i}
                  label={formatNumber(i)}
                  value={formatNumber(i)}
                />
              ))}
            </Picker>
            <Picker
              selectedValue={selectedYear}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedYear(itemValue)}
              numberOfLines={1}
            >
              {Array.from({ length: 2 }, (_, i) => startYear + i).map((i) => (
                <Picker.Item
                  key={i}
                  label={i.toString()}
                  value={i.toString()}
                />
              ))}
            </Picker>
          </View>
          <View style={{ flexDirection: "row", marginTop: 50 }}>
            <Button title="Cancel" onPress={() => onClose()} />
            <Button title="Confirm" onPress={handleConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerContainer: {
    width: dimensions.screenWidth,
    padding: 20,
    backgroundColor: colors.headerTextColor,
    borderRadius: 10,
    alignItems: "center",
    alignContent: "center",
  },
  title: {
    fontSize: dimensions.screenWidth * 0.03,
  },
  pickerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  picker: {
    width: dimensions.screenWidth * 0.3,
    height: dimensions.screenWidth * 0.4,
  },
});

export default DatePicker;
