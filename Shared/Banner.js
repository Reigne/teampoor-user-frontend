import React, { useEffect, useState, useRef } from "react";
import { Image, View, FlatList, Dimensions } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Banner = () => {
  const [bannerData, setBannerData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    setBannerData([
      "https://i.postimg.cc/L6MQLKx3/3.png",
      "https://i.postimg.cc/GpNqpZBY/4.png",
      "https://i.postimg.cc/hPyTLNn5/teampoor.png",
      "https://i.postimg.cc/fW9t1kxD/teampoor-3.png",
    ]);

    return () => {
      setBannerData([]);
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Calculate the next page
      const nextPage = (currentPage + 1) % bannerData.length;
      // Scroll to the next page
      flatListRef.current.scrollToIndex({ animated: true, index: nextPage });
      // Update the current page
      setCurrentPage(nextPage);
    }, 5000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [currentPage, bannerData]);

  const handleScroll = (event) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const page = Math.floor(contentOffset.x / layoutMeasurement.width);
    setCurrentPage(page);
  };

  return (
    <View style={{ width: wp("96%") }}>
      <FlatList
        ref={flatListRef}
        data={bannerData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View className="flex-1 rounded-xl overflow-hidden">
            <Image
              source={{ uri: item }}
              style={{
                width: wp("96%"),
                height: hp("23%"),
                resizeMode: "contain",
                borderRadius: 5, // Adjust the value as needed for the desired roundedness
              }}
            />
          </View>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
    </View>
  );
};

export default Banner;
