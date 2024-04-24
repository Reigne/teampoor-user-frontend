import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Checkout = (props) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();

  const handleDayPress = (day) => {
    const selectedDate = new Date(day.dateString);
    const today = new Date();

    if (selectedDate >= today) {
      setSelectedDate(day.dateString);
    } else {
      console.log("Please select a date after today.");
      // You can display a message or take any other action here
    }
  };

  const validateForm = () => {
    let errors = {};

    if (!selectedDate) errors.selectedDate = "Please select a date";
    if (!selectedTime) errors.selectedTime = "Time is required!";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const renderTimeButton = (time, selected) => (
    <TouchableOpacity
      key={time}
      onPress={() => handleTimePress(time)}
      style={{
        backgroundColor: selected ? "#ef4444" : "white",
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ef4444",
        margin: 5,
        alignItems: "center",
      }}
    >
      <Text style={{ color: selected ? "white" : "#ef4444" }}>{time}</Text>
    </TouchableOpacity>
  );

  const handleTimePress = (time) => {
    setSelectedTime(time);
  };

  const timeOptions = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ];

  const submitHandler = () => {
    if (!selectedDate || !selectedTime) {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please select date and time.",
        text2: "Incomplete form.",
      });
      console.log("please select date and time");
      return;
    }

    if (selectedDate && selectedTime) {
      let serviceItem = {
        date: selectedDate,
        timeSlot: selectedTime,
      };
      console.log(serviceItem, "serviceItem");
      navigation.navigate("Services", serviceItem);
    } else {
      console.log("Please select a date and time.");
      // You can display a message or take any other action here
    }
  };

  const markedDates = {};
  if (selectedDate) {
    markedDates[selectedDate] = { selected: true };
  }

  return (
    <View className="flex-1 bg-zinc-100 p-3 space-y-4">
      <KeyboardAwareScrollView className="space-y-2">
        <Text className="text-lg font-bold">Select a Date & Time</Text>

        <View className="bg-white rounded-xl p-1 space-y-3">
          <View className="px-2 pt-3">
            <Text className="font-semibold">Select Date *</Text>
          </View>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={markedDates} // Highlight selected date
            theme={{
              calendarBackground: "white",
              todayTextColor: "#ef4444",
              arrowColor: "#ef4444",
              selectedDayBackgroundColor: "#ef4444",
              selectedDayTextColor: "white",
            }}
          />
        </View>

        <View className="">
          <View className="bg-white p-3 rounded-xl space-y-3">
            {/* <Text style={{ marginBottom: 10, fontSize: 16 }}>
          Available Time Slot: {timeOptions.length}
        </Text> */}

            <View>
              <Text className="font-semibold">
                Select Time ({timeOptions.length} Available) *
              </Text>
              {/* {errors.selectedTime ? (
              <Text className="text-sm text-red-500">
                {errors.selectedTime}
              </Text>
            ) : null} */}
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {timeOptions.map((time) =>
                renderTimeButton(time, time === selectedTime)
              )}
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <TouchableOpacity
        className="bg-red-500 p-3 rounded-xl items-center"
        onPress={() => submitHandler()}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Checkout;
