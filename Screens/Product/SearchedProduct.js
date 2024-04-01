import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Text } from "native-base";
import { useNavigation } from "@react-navigation/native";

const SearchedProduct = (props) => {
  const { productsFiltered } = props;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {productsFiltered.length >= 1 ? (
        <FlatList
          data={productsFiltered}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Product Detail", { item: item })
              }
            >
              <View style={styles.productItem}>
                <Image
                  className="rounded"
                  source={
                    item.images[0]?.url
                      ? { uri: item.images[0]?.url }
                      : require("../../assets/images/teampoor-default.png")
                  }
                  style={styles.productImage}
                />
                <Text style={styles.productName}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View className="flex justify-center items-center">
          <Text className="font-bold text-base">No product found</Text>
          <Text className="text-sm text-neutral">
            Try different or more general keywords
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
  },
  productImage: {
    width: 35,
    height: 35,
    marginRight: 10,
  },
  productName: {
    fontSize: 16,
  },
});

export default SearchedProduct;
