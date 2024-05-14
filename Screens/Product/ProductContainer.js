import React, { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Text, Center, FlatList } from "native-base";
import Banner from "../../Shared/Banner";
import baseURL from "../../assets/common/baseUrl";
import axios from "axios";
import ProductList from "./ProductList";
import CategoryFilter from "./CategoryFilter";
import { MagnifyingGlassIcon, XMarkIcon } from "react-native-heroicons/solid";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import SearchedProduct from "./SearchedProduct";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const ProductContainer = () => {
  const [products, setProducts] = useState([]);
  const [productsCtg, setProductsCtg] = useState([]);
  const [productsFiltered, setProductsFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [focus, setFocus] = useState(false);
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState([]);
  const [initialState, setInitialState] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentBatch, setCurrentBatch] = useState(10);
  const [allProducts, setAllProducts] = useState([]);
  const navigation = useNavigation();

  const searchProduct = (text) => {
    setSearchText(text);
    setProductsFiltered(
      allProducts.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
    );
  };

  const openList = () => {
    setFocus(true);
  };

  const closeList = () => {
    setFocus(false);
    setSearchText("");
  };

  const changeCtg = (ctg) => {
    setCurrentBatch(10);
    if (ctg === "all") {
      setProductsCtg(allProducts.slice(0, 10));
      setProductsFiltered(allProducts);
      setActive(true);
    } else {
      const filteredProducts = allProducts.filter(
        (i) => i.category !== null && i.category._id === ctg
      );
      setProductsCtg(filteredProducts.slice(0, 10));
      setProductsFiltered(filteredProducts);
      setActive(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setFocus(false);
      setActive(-1);

      // call categories
      axios
        .get(`${baseURL}categories`)
        .then((res) => {
          setCategories(res.data);
        })
        .catch((error) => {
          console.log("Api categories call error");
        });

      // call products
      axios
        .get(`${baseURL}products`)
        .then((res) => {
          setAllProducts(res.data);
          setProducts(res.data.slice(0, 10));
          setProductsFiltered(res.data);
          setProductsCtg(res.data.slice(0, 10));
          setInitialState(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Api products call error!");
          console.log(error);
        });

      return () => {
        setProductsCtg([]);
        setFocus();
        setCategories([]);
        setActive();
        setInitialState();
      };
    }, [])
  );

  const loadMoreProducts = () => {
    if (currentBatch < productsFiltered.length) {
      const newBatch = currentBatch + 10;
      setProductsCtg(productsFiltered.slice(0, newBatch));
      setCurrentBatch(newBatch);
    }
  };

  const handleScroll = ({ nativeEvent }) => {
    if (isCloseToBottom(nativeEvent)) {
      loadMoreProducts();
    }
  };

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  const renderProductList = ({ item }) => (
    <ProductList key={item._id} item={item} />
  );

  const getItemLayout = (data, index) => ({
    length: wp(50), // Assuming each item has a width of 50% of the screen width
    offset: wp(50) * index,
    index,
  });

  return (
    <>
      {loading === true ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : (
        <SafeAreaView>
          <ScrollView className="bg-gray-100 " onScroll={handleScroll} scrollEventThrottle={16}>
            <View className="mt-3">
              <View className="flex-row items-center space-x-2 px-2 pb-1">
                <View
                  className={
                    focus === true
                      ? "flex-row flex-1 items-center p-2 rounded-lg border border-red-500 bg-white"
                      : "flex-row flex-1 items-center p-2 rounded-lg bg-white"
                  }
                >
                  <View className="p-1">
                    <MagnifyingGlassIcon
                      color="#52525b"
                      size={hp(2)}
                      strokeWidth={5}
                    />
                  </View>

                  <TextInput
                    className="flex-1 ml-2 tracking-wider"
                    placeholder="Search..."
                    onFocus={openList}
                    value={searchText}
                    onChangeText={(text) => searchProduct(text)}
                  />

                  {focus === true ? (
                    <TouchableOpacity
                      onPress={closeList}
                      className="rounded-full"
                    >
                      <View className="mr-2">
                        <XMarkIcon
                          color="gray"
                          size={hp(2.5)}
                          strokeWidth={3}
                        />
                      </View>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
              {focus === true ? (
                <SearchedProduct productsFiltered={productsFiltered} />
              ) : (
                <View>
                  <View className="p-2">
                    <Banner />
                  </View>

                  <View className="mt-2 px-2">
                    <View className="flex flex-row space-x-2 items-center mb-3">
                      <Text className="font-bold text-xl">Categories</Text>
                    </View>

                    <CategoryFilter
                      categories={categories}
                      active={active}
                      categoryFilter={changeCtg}
                      setActive={setActive}
                    />
                  </View>
                  <View className="p-2 mt-2 mb-1">
                    <View className="flex-row items-center justify-between">
                      <Text className="font-bold text-xl">Products</Text>
                    </View>
                  </View>

                  <View className="flex-row flex-wrap px-1">
                    {productsCtg.length > 0 ? (
                      <FlatList
                        data={productsCtg}
                        renderItem={renderProductList}
                        keyExtractor={(item) => item._id}
                        numColumns={2}
                        contentContainerStyle={{ paddingHorizontal: 1 }}
                        getItemLayout={getItemLayout}
                        ListEmptyComponent={
                          <Center flex={1}>
                            <Text>No products found</Text>
                          </Center>
                        }
                      />
                    ) : (
                      <Center flex={1}>
                        <Text>No products found</Text>
                      </Center>
                    )}
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
};

export default ProductContainer;
