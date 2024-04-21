import { StatusBar } from "expo-status-bar";
import { Text, View, LogBox } from "react-native";
import Toast from "react-native-toast-message";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { NativeBaseProvider, extendTheme } from "native-base";
import store from "./Redux/store";
import Auth from "./Context/Store/Auth";
import React, { useState, useEffect } from "react";
import Main from "./Navigators/Main";
export default function App() {
  useEffect(() => {
    LogBox.ignoreLogs([
      "In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.",
    ]);
  }, []);

  return (
    // <View className="bg-red-500 flex-1 justify-center items-center">
    //   <Text>Open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    // </View>
    <Auth>
      <Provider store={store}>
        <NativeBaseProvider>
          <NavigationContainer>
            <Main />
            <Toast />
            <StatusBar style="auto" 
            // animated={true}
             />
          </NavigationContainer>
        </NativeBaseProvider>
      </Provider>
    </Auth>
  );
}
