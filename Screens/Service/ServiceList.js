import React from "react";
import {
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ServiceCard from "./ServiceCard";

var { width } = Dimensions.get("window");

const ServiceList = (props) => {
  const { item } = props;
  const navigation = useNavigation();
  // console.log(item, "items");
  return (
    <View style={{ width: "100%" }} className="px-3 py-1">
      <TouchableOpacity 
      onPress={() => navigation.navigate("Service Details", { item: item })}
      >
        <ServiceCard {...item} />
      </TouchableOpacity>
    </View>
  );
};

export default ServiceList;
