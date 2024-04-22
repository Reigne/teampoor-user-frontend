import { Platform } from "react-native";

let baseURL = "";

{
  Platform.OS == "android"
    // ? (baseURL = "http://192.168.100.93:4000/api/v1/")
    // : (baseURL = "http://localhost:4000/api/v1/");
  ? (baseURL = "https://teampoor-api-kh6x.onrender.com/api/v1/")
  : (baseURL = "https://teampoor-api-kh6x.onrender.com/api/v1/");
}

export default baseURL;
