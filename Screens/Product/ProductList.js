import React from "react";
import {
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProductCard from "./ProductCard";

var { width } = Dimensions.get("window");

const ProductList = (props) => {
  const { item } = props;
  const navigation = useNavigation();
  // console.log(item, "items");
  return (
    <View style={{ width: "50%", padding: 3 }}>
      <TouchableOpacity onPress={() => navigation.navigate("Product Detail", { item: item })
            }>
        <ProductCard {...item} />
      </TouchableOpacity>
    </View>
  );
};

export default ProductList;
