import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAppContext } from "./AppContext";

const Settings = () => {
  const { reminderTimes, setReminderTimes } = useAppContext(); // Get context values

  const [morning, setMorning] = useState(null);
  const [noon, setNoon] = useState(null);
  const [evening, setEvening] = useState(null);
  const [selectedTime,setSelectedTime]  = useState(null);
  const [picker, setPicker] = useState({ show: false, type: "" });

  useEffect(() => {
    if (reminderTimes.length === 3) {
      // Convert saved times to Date objects in local time
      setMorning(new Date(`1970-01-01T${reminderTimes[0]}Z`));
      setNoon(new Date(`1970-01-01T${reminderTimes[1]}Z`));
      setEvening(new Date(`1970-01-01T${reminderTimes[2]}Z`));
    }
  }, [reminderTimes]);

  const showTimePicker = (type) => {
    let defaultTime;

    // Set default times for each picker type (morning, noon, evening)
    if (type === "morning") defaultTime = morning || new Date().setHours(7, 0, 0, 0);
    if (type === "noon") defaultTime = noon || new Date().setHours(13, 0, 0, 0);
    if (type === "evening") defaultTime = evening || new Date().setHours(20, 0, 0, 0);

    setSelectedTime(new Date(defaultTime)); // Set initial time
    setPicker({ show: true, type });
  };
  

  const handleConfirm = (event, selectedTime) => {
    if (!selectedTime) return setPicker({ show: false, type: "" });

    // Get local time from selectedTime
    let updatedTimes = [...reminderTimes];

    if (picker.type === "morning") {
      setMorning(selectedTime);
      updatedTimes[0] = selectedTime.toISOString().substring(11, 16); // Save time as HH:mm in UTC
    }
    if (picker.type === "noon") {
      setNoon(selectedTime);
      updatedTimes[1] = selectedTime.toISOString().substring(11, 16);
    }
    if (picker.type === "evening") {
      setEvening(selectedTime);
      updatedTimes[2] = selectedTime.toISOString().substring(11, 16);
    }

    setReminderTimes(updatedTimes); // Update context
    setPicker({ show: false, type: "" });
  };

  const formatTime = (date) => {
    if (!date) return "--:--"; 
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.timeButton} onPress={() => showTimePicker("morning")}>
        <Text style={styles.buttonText}>Morning: {formatTime(morning)}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.timeButton} onPress={() => showTimePicker("noon")}>
        <Text style={styles.buttonText}>Noon: {formatTime(noon)}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.timeButton} onPress={() => showTimePicker("evening")}>
        <Text style={styles.buttonText}>Evening: {formatTime(evening)}</Text>
      </TouchableOpacity>

      {picker.show && (
        <DateTimePicker 
        value={selectedTime || new Date()}  
        mode="time"
        display="default"
        onChange={handleConfirm}
      />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  timeButton: { backgroundColor: "#6a5acd", padding: 15, borderRadius: 10, marginVertical: 10, width: 200, alignItems: "center" },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});

export default Settings;
