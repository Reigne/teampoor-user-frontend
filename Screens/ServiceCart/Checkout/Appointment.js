import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { faMotorcycle } from "@fortawesome/free-solid-svg-icons/faMotorcycle";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import axios from "axios";
import { useSelector } from "react-redux";
import baseURL from "../../../assets/common/baseUrl";
import AuthGlobal from "../../../Context/Store/AuthGlobal";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { CheckIcon } from "react-native-heroicons/solid";
import {
  Modal,
  Button,
  Select,
  Badge,
  ScrollView,
  FlatList,
} from "native-base";
import AddressList from "../../Cart/Checkout/AddressList";
import {
  regions,
  provinces,
  cities,
  barangays,
} from "select-philippines-address";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";

const Appointment = (props) => {
  const [user, setUser] = useState("");
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [motorcycles, setMotorcycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(null);
  // const [serviceItems, setServiceItems] = useState([]);

  const [regionData, setRegionData] = useState([]);
  const [usedAddress, setUsedAddress] = useState();
  const [addressList, setAddressList] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const navigation = useNavigation();

  const context = useContext(AuthGlobal);
  const userid = context.stateUser.user.userId;
  const serviceCart = props.route.params;

  // const serviceSelectedCart = useSelector((state) => state.serviceCartItems);

  console.log(serviceCart?.selectedServices, "serviceCart");

  useEffect(() => {
    fetchUser();
    regions().then((regionResponse) => setRegionData(regionResponse));
    fetchMotorcycle();
    fetchAddresses();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchMotorcycle();
      fetchAddresses();
    }, [])
  );

  const fetchMotorcycle = () => {
    axios
      .get(`${baseURL}motorcycles/my-motorcycles/${userid}`, userid)
      .then((res) => {
        setMotorcycles(res.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const fetchAddresses = async () => {
    axios
      .get(`${baseURL}addresses/user/${context.stateUser.user.userId}`)
      .then((res) => {
        setAddressList(res.data);
        // If there are addresses and no selected address ID is set, set the selected address ID to the ID of the first address
        if (res.data.length > 0 && selectedAddressId === null) {
          setSelectedAddressId(res.data[0]._id);
        }
      })
      .catch((error) => console.log(error));
  };

  // Function to handle when addresses are fetched
  const handleAddressesFetched = (res) => {
    setAddressList(res.data);

    // If there are addresses and no selected address ID is set, set the selected address ID to the ID of the first address
    if (res.data.length > 0 && selectedAddressId === null) {
      setSelectedAddressId(res.data[0]._id);
      setUsedAddress(res.data[0]); // Set the used address to the first address
    }
  };

  const getAddresses = async () => {
    axios
      .get(`${baseURL}addresses/user/${context.stateUser.user.userId}`)
      .then(handleAddressesFetched)
      .catch((error) => console.log(error));
  };

  const fetchUser = async () => {
    axios
      .get(`${baseURL}users/${context.stateUser.user.userId}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => console.log(error));
  };

  // Function to handle selecting an address
  const selectedAddress = (item) => {
    setUsedAddress(item);
    setSelectedAddressId(item._id);

    console.log(item, "item address");
  };

  const data = motorcycles.map((motorcycle) => ({
    label: `${motorcycle.brand} (${motorcycle.plateNumber})`,
    value: motorcycle._id,
  }));

  const submitHandler = async () => {
    var total = 0;
    // Find the selected motorcycle based on its ID
    const selectedMotorcycle = motorcycles.find((m) => m._id === value);

    if (!selectedMotorcycle) {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please select motorcycle",
        text2: "Incomplete form",
      });
      console.log("Please select motorcycle");
      return;
    }

    if (serviceCart?.selectedServices?.services[0]?.type === 2) {
      if (!usedAddress) {
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Please select address",
          text2: "Incomplete form",
        });
        console.log("Please select address");
        return;
      }
    }

    console.log(serviceCart.type, "cart cart cart ");

    serviceCart.selectedServices.services.forEach((service) => {
      total += service.price;
    });

    console.log(total, "total price");

    // console.log(
    //   serviceCart.serviceItems,
    //   "serviceCart serviceCart serviceCart"
    // );

    if (serviceCart?.selectedServices?.services[0]?.type === 1) {
      let serviceAppointment = {
        fullname: user.firstname + " " + user.lastname,
        phone: user.phone,
        status: "Pending",
        user: user._id,
        serviceCart,
        totalPrice: total,
        // Include selected motorcycle data
        brand: selectedMotorcycle.brand,
        model: selectedMotorcycle.model,
        year: selectedMotorcycle.year,
        plateNumber: selectedMotorcycle.plateNumber,
        engineNumber: selectedMotorcycle.engineNumber,
        type: selectedMotorcycle.type,
        fuel: selectedMotorcycle.fuel,
      };

      console.log(serviceAppointment, "submit 1");

      navigation.navigate("Confirm", serviceAppointment);
    } else if (serviceCart?.selectedServices?.services[0]?.type === 2) {
      const regionCode = usedAddress.region;
      const provinceCode = usedAddress.province;
      const cityCode = usedAddress.city;
      const barangayCode = usedAddress.barangay;

      const regionResponse = await regions(regionCode);
      const provinceResponse = await provinces(regionCode);
      const cityResponse = await cities(provinceCode);
      const barangayResponse = await barangays(cityCode);

      const regionName = regionResponse.find(
        (region) => region.region_code === regionCode
      )?.region_name;
      const provinceName = provinceResponse.find(
        (province) => province.province_code === provinceCode
      )?.province_name;
      const cityName = cityResponse.find(
        (city) => city.city_code === cityCode
      )?.city_name;
      const barangayName = barangayResponse.find(
        (barangay) => barangay.brgy_code === barangayCode
      )?.brgy_name;

      let serviceAppointment = {
        fullname: user.firstname + " " + user.lastname,
        phone: user.phone,
        region: regionName,
        province: provinceName,
        city: cityName,
        barangay: barangayName,
        postalcode: usedAddress.postalcode,
        address: usedAddress.address,
        status: "Pending",
        user: user._id,
        serviceCart,
        totalPrice: total,
        // Include selected motorcycle data
        fuel: selectedMotorcycle.fuel,
        brand: selectedMotorcycle.brand,
        model: selectedMotorcycle.model,
        year: selectedMotorcycle.year,
        plateNumber: selectedMotorcycle.plateNumber,
        engineNumber: selectedMotorcycle.engineNumber,
        type: selectedMotorcycle.type,
      };
      console.log(serviceAppointment, "submit 2");

      navigation.navigate("Confirm", serviceAppointment);
    }
  };

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === value && (
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

  // console.log(props.route.params);
  return (
    <KeyboardAwareScrollView className="px-3 space-y-3">
      <SafeAreaView>
        <Text className="text-lg font-bold text-center">
          Appointment Information
        </Text>
      </SafeAreaView>

      <View className="bg-white p-3 rounded-xl space-y-3">
        <Text className="text-base font-semibold">Contact Details</Text>
        <View className="space-y-1">
          <Text className="font-semibold">Full Name *</Text>

          <TextInput
            className="p-3 bg-gray-100 text-gray-700 rounded-xl mb-1 flex-row items-center"
            placeholder="Enter full name"
            name="fullname"
            id="fullname"
            value={user.firstname + " " + user.lastname}
            onChangeText={(text) => setFullname(text)}
            editable={false}
          />
        </View>

        <View className="space-y-1">
          <Text className="font-semibold">Phone *</Text>

          <TextInput
            className="p-3 bg-gray-100 text-gray-700 rounded-xl mb-1 flex-row items-center"
            placeholder="Enter phone number"
            name="phone"
            id="phone"
            onChangeText={(text) => setPhone(text)}
            value={user.phone}
            editable={false}
          />
        </View>
      </View>

      <View className="bg-white p-3 rounded-xl space-y-3">
        <View>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-base font-semibold">Motorcycle *</Text>

            <TouchableOpacity
              className="px-2 py-1 rounded bg-red-500"
              onPress={() => navigation.navigate("MotorcycleForm")}
            >
              <Text className="text-white text-xs">Add Motorcycle</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-zinc-500 text-xs">Select your motocycle</Text>
        </View>

        <View className="space-y-1">
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
              placeholder="Select item"
              searchPlaceholder="Search..."
              value={value}
              onChange={(item) => {
                setValue(item.value);
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
      </View>

      {serviceCart?.selectedServices?.services[0]?.type === 2 && (
        <View className="bg-white p-3 rounded-xl space-y-3">
          <View>
            <View className="flex flex-row justify-between items-center">
              <Text className="text-base font-semibold">Address *</Text>

              <TouchableOpacity className="px-2 py-1 rounded bg-red-500">
                <Text className="text-white text-xs">Add Address</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-zinc-500 text-xs">Select your address</Text>
          </View>

          <FlatList
            data={addressList}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View>
                {addressList.length > 0 ? (
                  <AddressList
                    item={item}
                    index={index}
                    regionData={regionData}
                    selectedAddress={selectedAddress}
                    selectedAddressId={selectedAddressId}
                  />
                ) : (
                  <View className="flex justify-center items-center p-5">
                    <Text>No data available.</Text>
                  </View>
                )}
              </View>
            )}
          />
        </View>
      )}

      <View className="">
        <View className="flex justify-center items-center mt-3">
          <TouchableOpacity
            className="bg-red-500 w-full py-3 rounded-full items-center"
            onPress={() => submitHandler()}
          >
            <Text className="font-bold text-base text-white">Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Appointment;

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
