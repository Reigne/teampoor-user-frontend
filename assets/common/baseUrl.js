import { Platform } from "react-native";

let baseURL = "";

{
  Platform.OS == "android"
    ? (baseURL = "https://teampoor-api.onrender.com/api/v1/")
    : (baseURL = "https://teampoor-api.onrender.com/api/v1/");
}

export default baseURL;
