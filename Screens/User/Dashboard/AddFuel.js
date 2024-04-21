import React, { useState, useContext, useEffect } from "react";
import { ScrollView } from "native-base";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { CalendarDaysIcon } from "react-native-heroicons/solid";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseURL from "../../../assets/common/baseUrl";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import AuthGlobal from "../../../Context/Store/AuthGlobal";
import { Dropdown } from "react-native-element-dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMotorcycle } from "@fortawesome/free-solid-svg-icons/faMotorcycle";
import { CheckIcon } from "react-native-heroicons/solid";

const AddFuel = (props) => {
  const context = useContext(AuthGlobal);
  const navigation = useNavigation();

  const [userId, getUserId] = useState(context.stateUser.user.userId);
  const [item, setItem] = useState(null);
  const [pricePerKg, setPricePerKg] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [odometer, setOdometer] = useState(0);
  const [notes, setNotes] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState();
  const [fillingStation, setFillingStation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isFillingStationFocused, setIsFillingStationFocused] = useState(false);
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [motorcycles, setMotorcycles] = useState([]);
  const [selectedMotorcycle, setSelectedMotorcycle] = useState(null);

  // const [isHidden, setIsHidden] = useState(true);

  console.log(userId, "id moooooooooo");

  useEffect(() => {
    fetchMotorcycle();

    if (!props.route.params) {
      setItem(null);
      setDate(new Date());
    } else {
      console.log(props.route.params, "props 2");

      setSelectedMotorcycle(props.route.params.motorcycle);
      setItem(props.route.params);
      setDate(props.route.params.date);
      setOdometer(props.route.params.odometer?.toString());
      setPricePerKg(props.route.params.price?.toString());
      setQuantity(props.route.params.quantity?.toString());
      setTotalCost(props.route.params.totalCost?.toString());
      setFillingStation(props.route.params.fillingStation);
      setNotes(props.route.params.notes);
    }

    // getStation();
    fetchSuggestions();
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));
  }, [props.route.params]);

  const fetchMotorcycle = () => {
    axios
      .get(`${baseURL}motorcycles/my-motorcycles/${userId}`, userId)
      .then((res) => {
        setMotorcycles(res.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDate(date);
    // console.warn("A date has been picked: ", date);
    hideDatePicker();
  };

  const getStation = async () => {
    axios
      .get(`${baseURL}fuels/station/${userId}`)
      .then((res) => {
        setStation(res.data);
        // setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const handleFillingStationFocus = () => {
    setIsFillingStationFocused(true);
  };

  const handleFillingStationBlur = () => {
    setIsFillingStationFocused(false);
  };

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(`${baseURL}fuels/station/${userId}`);
      const stations = response.data.map((station) => station.fillingStation);
      setSuggestions(stations);
    } catch (error) {
      console.log("Error fetching suggestions:", error);
    }
  };
  const handleInputChange = (text) => {
    setFillingStation(text);

    // Filter suggestions based on the input text
    const filteredSuggestions = suggestions.filter((station) =>
      station.toLowerCase().includes(text.toLowerCase())
    );

    // Update the filtered suggestions state
    setFilteredSuggestions(filteredSuggestions);

    // If the text input matches one of the suggestions exactly, clear the filtered suggestions
    if (
      filteredSuggestions.length === 1 &&
      filteredSuggestions[0].toLowerCase() === text.toLowerCase()
    ) {
      setFilteredSuggestions([]);
    }
  };

  // const renderSuggestions = () => {

  //   return filteredSuggestions.map((station, index) => (
  //     <View className="flex bg-zinc-100 p-4 rounded-b-lg" key={index}>
  //       <TouchableOpacity onPress={() => setFillingStation(station)}>
  //         <Text>{station}</Text>
  //       </TouchableOpacity>
  //     </View>
  //   ));
  // };

  const renderSuggestions = () => {
    console.log(filteredSuggestions, "filteredSuggestions");
    if (
      isFillingStationFocused &&
      filteredSuggestions.length > 0 &&
      fillingStation.length > 0
    ) {
      return filteredSuggestions.map((station, index) => (
        <TouchableOpacity
          className="flex bg-zinc-100 p-4 rounded-b-lg"
          key={index}
          onPress={() => (
            setFillingStation(station), handleFillingStationBlur()
          )}
        >
          <View>
            <Text>{station}</Text>
          </View>
        </TouchableOpacity>
      ));
    } else {
      return null; // Return null when the user is not typing in the TextInput or there are no suggestions
    }
  };
  const formattedDate = new Date(date).toLocaleDateString(); // Format date as string
  console.log("Formatted Date:", formattedDate); // Add this line

  const calculateTotalCost = () => {
    const price = parseFloat(pricePerKg);
    const qty = parseFloat(quantity);

    if (!isNaN(price) && !isNaN(qty)) {
      const calculatedTotalCost = price * qty;
      setTotalCost(calculatedTotalCost.toFixed(2));
    } else {
      setTotalCost("");
    }
  };

  // const calculatePricePerKg = () => {
  //   const qty = parseFloat(quantity);
  //   const cost = parseFloat(totalCost);

  //   if (!isNaN(qty) && !isNaN(cost) && qty !== 0) {
  //     const calculatedPrice = cost / qty;
  //     setPricePerKg(calculatedPrice.toFixed(2));
  //   } else {
  //     setPricePerKg("");
  //   }
  // };

  const calculateQuantity = () => {
    const price = parseFloat(pricePerKg);
    const cost = parseFloat(totalCost);

    if (!isNaN(price) && !isNaN(cost) && price !== 0) {
      const calculatedQuantity = cost / price;
      setQuantity(calculatedQuantity.toFixed(2));
    } else {
      setQuantity("");
    }
  };

  console.log(date);

  const validateForm = () => {
    let errors = {};

    if (!date) errors.date = "Date is required";
    if (!odometer) errors.odometer = "Odometer is required";
    if (!pricePerKg) errors.pricePerKg = "Price is required";
    if (!quantity) errors.quantity = "Quantity is required";
    if (!totalCost) errors.totalCost = "Total cost is required";
    if (!fillingStation) errors.fillingStation = "Filling station is required";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));

    let formData = new FormData();

    var datestr = new Date(date).toISOString();

    formData.append("motorcycle", selectedMotorcycle);
    formData.append("date", datestr);
    formData.append("odometer", odometer);
    formData.append("price", pricePerKg);
    formData.append("quantity", quantity);
    formData.append("totalCost", totalCost);
    formData.append("fillingStation", fillingStation);
    formData.append("notes", notes);
    formData.append("userId", userId);

    console.log(formData);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    if (item !== null) {
      axios
        .post(`${baseURL}fuels/update/${item._id}`, formData, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Fuel Updated",
              text2: "Successfuly Updated",
            });

            setTimeout(() => {
              navigation.navigate("UserDashboard");
            }, 500);

            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error, "error");
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Update Fuel Form",
          });

          setLoading(false);
        });
    } else {
      axios
        .post(`${baseURL}fuels/create`, formData, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "New Fuel Added",
              text2: "Successfuly Created",
            });

            setTimeout(() => {
              navigation.navigate("UserDashboard");
            }, 500);

            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Create Fuel Form",
          });

          setLoading(false);
        });
    }
  };

  const data = motorcycles.map((motorcycle) => ({
    label: `${motorcycle.brand} (${motorcycle.plateNumber})`,
    value: motorcycle._id,
  }));

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === selectedMotorcycle && (
          <CheckIcon
            style={styles.icon}
            color="black"
            name="Safety"
            size={20}
          />
        )}
      </View>
    );
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <View>
          <Text className="text-xl font-bold">Add Fuel</Text>
          <Text className="text-zinc-500">Fill up the information below.</Text>
        </View>

        <View className="space-y-3 mt-3">
          <View>
            <View className="p-3 bg-gray-100 text-gray-700 rounded-xl">
              <Dropdown
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select motorcycle"
                searchPlaceholder="Search..."
                value={selectedMotorcycle}
                onChange={(item) => {
                  setSelectedMotorcycle(item.value);
                }}
                renderLeftIcon={() => (
                  <FontAwesomeIcon
                    icon={faMotorcycle}
                    style={styles.icon}
                    color="black"
                    name="Safety"
                    size={20}
                  />
                )}
                renderItem={renderItem}
              />
            </View>
          </View>

          <View className="space-y-2">
            <Text>Date *</Text>

            <View>
              <TouchableOpacity
                onPress={showDatePicker}
                className={
                  errors.date
                    ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1 flex-row items-center space-x-2"
                    : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1 flex-row items-center space-x-2"
                }
              >
                <CalendarDaysIcon color="black" size={20} />
                <TextInput
                  value={formattedDate}
                  placeholder="Select date"
                  editable={false}
                  className="text-black"
                />
              </TouchableOpacity>

              <View>
                {errors.date ? (
                  <Text className="text-sm text-red-500">{errors.date}</Text>
                ) : null}
              </View>
            </View>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>

          <View className="space-y-2">
            <Text>Odometer *</Text>
            <View>
              <View
                className={
                  errors.odometer
                    ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1 flex-row items-center"
                    : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1 flex-row items-center"
                }
              >
                {/* <Text>₱ </Text> */}
                <TextInput
                  placeholder="Enter odometer"
                  keyboardType={"numeric"}
                  id="odometer"
                  name="odometer"
                  value={odometer}
                  onChangeText={(text) => setOdometer(text)}
                  // onBlur={calculateQuantity}
                />
              </View>

              <View>
                {errors.odometer ? (
                  <Text className="text-sm text-red-500">
                    {errors.odometer}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>

          <View className="space-y-2">
            <Text>Price (Gas) *</Text>
            <View>
              <View
                className={
                  errors.quantity
                    ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1 flex-row items-center"
                    : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1 flex-row items-center"
                }
              >
                <Text>₱ </Text>
                <TextInput
                  placeholder="Enter price per kilogram of gas"
                  value={pricePerKg}
                  onChangeText={(text) => setPricePerKg(text)}
                  inputMode="numeric"
                  onBlur={calculateQuantity}
                />
              </View>

              <View>
                {errors.pricePerKg ? (
                  <Text className="text-sm text-red-500">
                    {errors.pricePerKg}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>

          <View className="space-y-2">
            <Text>Quantity (Per Liter) *</Text>
            <View>
              <TextInput
                placeholder="Enter quantity of gas"
                value={quantity}
                onChangeText={(text) => setQuantity(text)}
                className={
                  errors.quantity
                    ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                    : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                }
                inputMode="numeric"
                onBlur={calculateTotalCost}
              />

              <View>
                {errors.quantity ? (
                  <Text className="text-sm text-red-500">
                    {errors.quantity}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>

          <View className="space-y-2">
            <Text>Total Cost *</Text>
            <View>
              <View
                className={
                  errors.quantity
                    ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1 flex-row items-center"
                    : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1 flex-row items-center"
                }
              >
                <Text>₱ </Text>
                <TextInput
                  placeholder="Enter total cost"
                  value={totalCost}
                  onChangeText={(text) => setTotalCost(text)}
                  keyboardType={"numeric"}
                  onBlur={calculateQuantity}
                />
              </View>

              <View>
                {errors.totalCost ? (
                  <Text className="text-sm text-red-500">
                    {errors.totalCost}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>

          <View className="space-y-2">
            <Text>Filling Station *</Text>

            <View className=" mt-3">
              <TextInput
                placeholder="Enter filling station"
                value={fillingStation}
                onChangeText={handleInputChange}
                onFocus={handleFillingStationFocus}
                // onBlur={handleFillingStationBlur}
                className="p-4 bg-gray-100 text-gray-700 rounded-t-2xl"
              />

              <View>
                {/* Suggestions */}
                {renderSuggestions()}
              </View>
            </View>
          </View>

          <View className="space-y-2">
            <Text>Notes</Text>

            <View className="rounded-2xl">
              <TextInput
                placeholder="Enter your notes"
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                rows={5}
                multiline={true}
                textAlignVertical="top"
                value={notes}
                onChangeText={(text) => setNotes(text)}
              />
            </View>
          </View>
        </View>
      </View>

      <View className="my-3 justify-center items-center px-4">
        <TouchableOpacity
          className={
            loading
              ? "py-4 w-full bg-zinc-500 rounded-xl items-center"
              : "py-4 w-full bg-red-500 rounded-xl items-center"
          }
          onPress={() => handleSubmit()}
          disabled={loading === true}
        >
          <View className="flex flex-row space-x-2 items-center justify-center">
            <Text className="font-bold text-white">
              {item ? "Update Fuel" : "Create Fuel"}
            </Text>

            {loading && <ActivityIndicator size="small" color="white" />}
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddFuel;

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
