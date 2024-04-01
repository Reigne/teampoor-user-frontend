import React from "react";
import { VStack, Avatar, Badge, Text, View } from "native-base";
import { useSelector } from "react-redux";
import { ShoppingCartIcon } from "react-native-heroicons/solid";

const CartIcon = (props) => {

  const color = props.color;

  // console.log(props, 'props')
  const cartItems = useSelector((state) => state.cartItems);
  return (
    <>
      {cartItems.length > 0 ? (
        <VStack space={2} alignItems="center">
          <View className="p-5">
            <Badge // bg="red.400"
              className="bg-red-500 border-solid border-white"
              rounded="full"
              mb={-4}
              mr={-4}
              zIndex={1}
              variant="solid"
              alignSelf="flex-end"
              _text={{
                fontSize: 10,
              }}
            >
              {cartItems.length}
            </Badge>
            <ShoppingCartIcon color={color} />
          </View>
        </VStack>
      ) : (
        <ShoppingCartIcon color={color} />
      )}
    </>
  );
};

export default CartIcon;
