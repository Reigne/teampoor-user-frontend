import React, { useState } from "react";
import { View, Text, ScrollView, CheckCircleIcon, Select } from "native-base";
import { Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BanknotesIcon } from "react-native-heroicons/solid";

const Payment = (props) => {
  const order = props.route.params;
  const [selected, setSelected] = useState("Cash On Delivery");
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();

  console.log(order, 'payment js orders')

  const handlePaymentSelection = (paymentMethod) => {
    setSelected(paymentMethod);
  };

  const validateForm = () => {
    let errors = {};

    if (!selected) errors.selected = "Please select a payment method";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const paydetails = () => {
    if (!validateForm()) {
      return;
    }

    let payment = {
      paymentMethod: selected,
    };

    navigation.navigate("Confirm", { order: order, payment: payment });
    console.log(payment, "the payment");
  };

  return (
    <View className="bg-zinc-100 flex-1">
      <ScrollView className="">
        <View className="p-2 space-y-3">

          {/* <View className="bg-white p-3 rounded">
            <Text className="mb-2">Payment Method</Text>
            <Select
              placeholder="Select payment method"
              value={selected}
              onValueChange={(value) => setSelected(value)}
            >
              <Select.Item label="Cash On Delivery" value={1} />
              <Select.Item label="GCash" value={2} />
            </Select>

            <View className="mt-1">
              {errors.selected ? (
                <Text className="text-sm text-red-500">{errors.selected}</Text>
              ) : null}
            </View>
            </View> */}
          <View className="bg-white p-3 rounded-lg">
            {/* <Text className="mb-2">Payment Method: </Text> */}
            <Text className="font-bold text-lg mb-5">Payment Method</Text>

            <View className="space-y-3">
              <TouchableOpacity
                onPress={() => handlePaymentSelection("Cash On Delivery")}
                className={
                  selected === "Cash On Delivery"
                    ? "bg-blue-200 p-2 rounded-lg flex flex-row items-center "
                    : "bg-zinc-200 p-2 rounded-lg flex flex-row items-center "
                }
              >
                <View className="p-3 bg-blue-300 rounded-lg">
                  <BanknotesIcon color="#075985" size="25" />
                </View>
                <View className="flex-1 flex-row justify-between items-center px-3">
                  <Text className="font-semibold">Cash On Delivery</Text>

                  {selected === "Cash On Delivery" && (
                    <View>
                      <CheckCircleIcon color="#22c55e" size={4} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handlePaymentSelection("GCash")}
                className={
                  selected === "GCash"
                    ? "bg-blue-200 p-2 rounded-lg flex flex-row items-center"
                    : "bg-zinc-200 p-2 rounded-lg flex flex-row items-center"
                }
              >
                <Image
                  className="rounded-lg"
                  style={{ width: 50, height: 50 }}
                  source={require("../../../assets/images/gcash.png")}
                  resizeMode="contain"
                />

                <View className="flex-1 flex-row justify-between items-center px-3">
                  <Text className="font-semibold">GCash</Text>

                  {selected === "GCash" && (
                    <View>
                      <CheckCircleIcon color="#22c55e" size={4} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {errors.selected && (
              <Text className="text-sm text-red-500">{errors.selected}</Text>
            )}
          </View>
        </View>
      </ScrollView>
      <View className="px-4">
        <TouchableOpacity
          className="bg-red-500 py-4 rounded-2xl items-center mb-1"
          onPress={paydetails}
        >
          <Text className="text-base font-bold text-center text-white">
            Confirm
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Payment;


// import React, { useState } from "react";
// import { View, Text, Select, ScrollView } from "native-base";
// import { Image, TouchableOpacity } from "react-native";
// import { useNavigation } from "@react-navigation/native";

// const Payment = (props) => {
//   const eWalletList = [{ name: "GCash", value: 1 }];
//   const order = props.route.params;
//   const [selected, setSelected] = useState(0);
//   const [eWallet, setEWallet] = useState(null);
//   const [errors, setErrors] = useState({});

//   console.log(order, "payment section");

//   const navigation = useNavigation();

//   const validateForm = () => {
//     let errors = {};

//     if (!selected) errors.selected = "Please select an payment method";

//     // if (selected === 2 && !eWallet) {
//     //   if (!eWallet) errors.eWallet = "Please select an e-Wallet";

//     //   alert("Please select an e-Wallet");
//     // }

//     setErrors(errors);

//     return Object.keys(errors).length === 0;
//   };

//   const paydetails = () => {
//     if (!validateForm()) {
//       return;
//     }

//     let payment = {
//       paymentMethod: selected === 1 ? "Cash On Delivery" : "GCash",
//     };

//     navigation.navigate("Confirm", { order: order, payment: payment });
//     console.log(payment, "the payment");
//   };

//   return (
//     <View className="bg-gray-100 flex-1">
//       <ScrollView className="">
//         <View className="p-2 mt-3">
//           <Text className="mb-2">Payment Details</Text>
//           <View className="bg-white p-3 rounded">
//             <Text className="mb-2">Payment Method</Text>
//             <Select
//               placeholder="Select payment method"
//               value={selected}
//               onValueChange={(value) => setSelected(value)}
//             >
//               <Select.Item label="Cash On Delivery" value={1} />
//               <Select.Item label="GCash" value={2} />
//             </Select>

//             <View className="mt-1">
//               {errors.selected ? (
//                 <Text className="text-sm text-red-500">{errors.selected}</Text>
//               ) : null}
//             </View>

//             {/* Conditionally render the dropdown list for e-Wallet */}
//             {/* {selected === 2 && (
//             <View className="mt-2">
//               <Text className="mb-2">Select e-Wallet</Text>
//               <Select
//                 placeholder="Select e-Wallet"
//                 value={eWallet}
//                 onValueChange={(value) => setEWallet(value)}
//               >
//                 {eWalletList.map((wallet) => (
//                   <Select.Item
//                     key={wallet.value}
//                     label={wallet.name}
//                     value={wallet.name} // Store the name in the state
//                   />
//                 ))}
//               </Select>

//               <View className="mt-1">
//                 {errors.eWallet ? (
//                   <Text className="text-sm text-red-500">{errors.eWallet}</Text>
//                 ) : null}
//               </View>
//             </View>
//           )} */}
//           </View>

//           {/* {selected === 2 && (
//             <View className="flex justify-center items-center bg-white p-3 mt-3">
//               <Text className="font-bold text-lg">Pay thru GCash</Text>

//               <View className="mt-3">
//                 <Image
//                   style={{ width: 300, height: 500 }}
//                   source={require("../../../assets/images/GCash-Payment.jpg")}
//                   resizeMode="contain"
//                   className="rounded-lg"
//                 />
//               </View>

//               <View className="mt-3">
//                 <TouchableOpacity className="flex bg-blue-500 px-10 py-3 rounded-xl">
//                   <Text className="font-bold text-white ">Download Image</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )} */}
//         </View>
//       </ScrollView>
//       <View className="px-4">
//         <TouchableOpacity
//           className="bg-red-500 py-4 rounded-2xl items-center mb-1"
//           onPress={() => paydetails()}
//         >
//           <View style={{ flexDirection: "row", alignItems: "center" }}>
//             <Text className="text-base font-bold text-center text-white">
//               Confirm
//             </Text>
//           </View>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default Payment;

