import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import { Text, Center } from "native-base";
import Banner from "../../Shared/Banner";
import baseURL from "../../assets/common/baseUrl";
import axios from "axios";
import ProductList from "./ProductList";
import CategoryFilter from "./CategoryFilter";
import {
  MagnifyingGlassIcon,
  Square2StackIcon,
  Squares2X2Icon,
  UserCircleIcon,
  UserIcon,
  XMarkIcon,
} from "react-native-heroicons/solid";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import SearchedProduct from "./SearchedProduct";
import { SafeAreaView } from "react-native-safe-area-context";
import NewArrival from "./NewArrival";
import ServiceContainer from "../Service/ServiceContainer";
import { useNavigation } from "@react-navigation/native";

const ProductContainer = () => {
  const [products, setProducts] = useState([]);
  const [productsCtg, setProductsCtg] = useState([]);
  const [productsFiltered, setProductsFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [focus, setFocus] = useState();
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState([]);
  const [initialState, setInitialState] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigation = useNavigation();

  const searchProduct = (text) => {
    // console.log(text);
    setSearchText(text);
    setProductsFiltered(
      products.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
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
    {
      console.log(ctg);
      ctg === "all"
        ? [setProductsCtg(initialState), setActive(true)]
        : [
            setProductsCtg(
              products.filter(
                (i) => i.category !== null && i.category._id === ctg
              ),
              setActive(true)
            ),
            console.log(setProducts),
          ];
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

      console.log(categories, "categories");
      // call products
      axios
        .get(`${baseURL}products`)
        .then((res) => {
          setProducts(res.data);
          setProductsFiltered(res.data);
          setProductsCtg(res.data);
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

  const paymongo = () => {
    try {
      axios.post(`${baseURL}orders/createCheckout`).then((res) => {
        // Update the status state variable with the newly updated status
        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Appointment Status Updated",
          text2: `#${item._id} Appointment has been Updated`,
        });
      });
    } catch (error) {
      console.error(error);
      // Handle errors, show an error toast, etc.
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Something went wrong",
        text2: "Please try again",
      });
    }
  };

  const handlePayMongo = () => {
    const options = {
      method: "POST",
      url: "https://api.paymongo.com/v1/checkout_sessions",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        authorization:
          "Basic c2tfdGVzdF9KMlBMVlp3ZHV3OExwV3hGeWhZZnRlQWQ6cGtfdGVzdF9kYmpQaUZDVGJqaHlUUnVCbmVRdW1OSkY=",
      },
      data: {
        data: {
          attributes: {
            send_email_receipt: false,
            show_description: true,
            show_line_items: true,
            line_items: [
              {
                currency: "PHP",
                amount: 20000,
                description: "armas",
                name: "pistol",
                quantity: 2,
              },
            ],
            payment_method_types: ["gcash"],
            description: "qwe",
            success_url: "https://www.google.com/",
          },
        },
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        const checkoutUrl = response.data.data.attributes.checkout_url;
        Linking.openURL(checkoutUrl); // Redirect the user to the checkout URL
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  return (
    <>
      {loading === true ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : (
        <SafeAreaView>
          <ScrollView className="bg-gray-100 ">
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
                      <View className="mr-2  ">
                        <XMarkIcon
                          color="gray"
                          size={hp(2.5)}
                          strokeWidth={3}
                        />
                      </View>
                    </TouchableOpacity>
                  ) : null}
                </View>

                {/* {focus === false ? (
                  <View className="bg-red-500 rounded-full">
                    <Image
                      source={require("../../assets/teampoor-icon.png")}
                      style={{ width: 40, height: 40 }}
                      className="rounded-full"
                      resizeMode="contain"
                      alt="teampoor logo"
                    />
                  </View>
                ) : null} */}
              </View>
              {focus === true ? (
                <SearchedProduct productsFiltered={productsFiltered} />
              ) : (
                <View>
                  {/* <View className="flex-row justify-center items-center gap-5 p-2">
                    <TouchableOpacity className="bg-white p-5 rounded-lg grow">
                      <Text>Products</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-white p-5 rounded-lg grow" onPress={() => navigation.navigate("Services")}>
                      <Text>Services</Text>
                    </TouchableOpacity>
                  </View> */}
                  <View className="p-2">
                    <Banner />
                  </View>

                  <View className="mt-2 px-2">
                    <View className="flex flex-row space-x-2 items-center mb-3">
                      {/* <Squares2X2Icon color="black" size={24} /> */}
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
                      productsCtg.map((item, i) => {
                        return (
                          <ProductList key={item._id} item={item} index={i} />
                        );
                      })
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
