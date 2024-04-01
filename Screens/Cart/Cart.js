import React, { useContext } from "react";
import {
  View,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  Text,
  Box,
  HStack,
  Avatar,
  VStack,
  Spacer,
  Image,
  Button,
  AddIcon,
} from "native-base";

import {
  clearCart,
  removeFromCart,
  updateCartItemQuantity,
} from "../../Redux/Actions/cartActions";
import {
  ChevronLeftIcon,
  MinusCircleIcon,
  PlusCircleIcon,
  TrashIcon,
} from "react-native-heroicons/solid";
import { SwipeListView } from "react-native-swipe-list-view";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import Login from "../User/Login";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";

const Cart = (props) => {
  var total = 0;
  const navigation = useNavigation();
  const cartItems = useSelector((state) => state.cartItems);
  const dispatch = useDispatch();
  const context = useContext(AuthGlobal);

  cartItems.forEach((cart) => {
    return (total += cart.price * cart.quantity);
  });

  const addQuantity = (item) => {
    if (item.quantity >= item.stock) {
    } else {
      dispatch(updateCartItemQuantity(item.id, item.quantity + 1));
    }
  };

  const minusQuantity = (item) => {
    if (item.quantity > 1) {
      dispatch(updateCartItemQuantity(item.id, item.quantity - 1));
    }
  };

  const checkout = () => {
    if (context.stateUser.isAuthenticated === true) {
      navigation.navigate("Checkout");
    } else {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Authentication Required",
        text2: "Please log in to your account before proceeding to checkout.",
      });

      navigation.navigate("User");
    }
  };

  console.log(cartItems, "cart");
  const renderItem = ({ item, index }) => (
    <View className="h-24 bg-white">
      <View className="flex flex-row p-5 space-x-5 divide">
        <View className="border-2 border-zinc-200 p-1 rounded-lg">
          <Image
            className="rounded-lg"
            style={{
              width: 40,
              height: 40,
            }}
            source={
              item.images[0]?.url
                ? { uri: item.images[0]?.url }
                : require("../../assets/images/teampoor-default.png")
            }
            alt="images"
          />
        </View>

        <View className="flex flex-column w-44">
          <Text className="font-semibold text-base">
            {item.name.length > 30 ? `${item.name.slice(0, 30)}...` : item.name}
          </Text>
          <Text className="">
            ₱
            {item.price?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        </View>

        <View className="flex-row justify-center items-center space-x-3 grow">
          <TouchableOpacity onPress={() => addQuantity(item)}>
            <PlusCircleIcon color="#84cc16" size={29} />
          </TouchableOpacity>
          <View className="bg-zinc-100 p-2 rounded">
            <Text className="font-semibold">{item.quantity}</Text>
          </View>
          <TouchableOpacity onPress={() => minusQuantity(item)}>
            <MinusCircleIcon color="#ef4444" size={29} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderHiddenItem = (cartItems) => (
    <TouchableOpacity
      onPress={() => dispatch(removeFromCart(cartItems.item))}
      className="flex flex-row-reverse h-24"
    >
      <View className="justify-center px-5 items-center bg-red-500">
        <TrashIcon color="white" size={18} />
        <Text className="text-white">Delete</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-between items-center p-3">
        <View className="w-32">
          <TouchableOpacity
            className="rounded"
            onPress={() => navigation.goBack()}
          >
            <View className="flex-row items-center rounded-full">
              <ChevronLeftIcon size={wp(6)} color="black" />
              {/* <Text className="text-black">Back</Text> */}
            </View>
          </TouchableOpacity>
        </View>

        <View className="">
          <Text className="font-bold text-lg">Cart</Text>
        </View>

        <View className="w-32 flex-row-reverse">
          {cartItems.length > 0 ? (
            <TouchableOpacity onPress={() => dispatch(clearCart())}>
              <TrashIcon size={wp(5)} color="#ef4444" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {cartItems.length > 0 ? (
        <View className="flex-1">
          <ScrollView>
            <Box safeArea>
              <SwipeListView
                data={cartItems}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                disableRightSwipe={true}
                leftOpenValue={75}
                rightOpenValue={-80}
                previewOpenValue={-100}
                previewOpenDelay={3000}
              />
            </Box>
          </ScrollView>
        </View>
      ) : (
        <View className="flex-1 justify-center items-center">
          <View>
            <Image
              size={300}
              source={require("../../assets/empty-cart-2.png")}
              alt="empty-cart"
            />
          </View>

          <Text className="font-extrabold text-3xl mt-5 text-red-500">
            Empty Cart
          </Text>

          <Text className="w-80 text-center mt-3 text-zinc-700">
            Looks like your cart is feeling a bit lonely! Add some items to your
            cart and let the shopping spree begin.
          </Text>
        </View>
      )}

      {cartItems.length > 0 ? (
        <View className="py-3 bg-white rounded-t-3xl px-2 space-y-1">
          <View className="p-3  flex flex-row justify-between items-center bg-zinc-100 rounded-lg mb-1">
            <Text className="">Total Price:</Text>

            <Text className="text-base text-red-500 font-bold">
              ₱{total?.toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity
            className="bg-red-500 rounded-xl w-full py-4 px-4"
            onPress={() => checkout()}
          >
            <Text className="font-bold text-white text-center">Checkout</Text>
          </TouchableOpacity>

          {/* <View>
            <TouchableOpacity
              className="flex-row justify-between items-center mx-5 rounded-xl bg-red-500 p-4 py-2"
              onPress={() => checkout()}
            >
              <View className="rounded-full bg-white">
                <Text className="p-2 text-red-500 font-bold">
                  {cartItems.length}
                </Text>
              </View>
              <Text className="text-white font-extrabold text-lg">
                Checkout
              </Text>
              <Text className="text-white font-bold">
                ₱
                {total?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </TouchableOpacity>
          </View> */}
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default Cart;
