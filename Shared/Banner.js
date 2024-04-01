import React, { useEffect, useState, useRef } from "react";
import { Image, View, FlatList } from "react-native";

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
      "https://hondaph.com/cms/images/news/5f7c2f62796fe.png",
      "https://www.webike.ph/ph_news/wp-content/uploads/2020/12/HONDA-PH-Promotion-1.png",
      "https://wheels.com.ph/wp-content/uploads/2020/10/121198773_2736629883253327_339092979694998459_o.jpg",
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
    <View className="">
      <FlatList
        ref={flatListRef}
        data={bannerData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View className="flex justify-center items-center" style={{ width: wp("100%"), height: hp("26%")}}>
            <Image
              source={{ uri: item }}
              style={{ width: wp("95%"), height: hp("25%")}}
              resizeMode="cover"
              className="rounded-lg"
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
