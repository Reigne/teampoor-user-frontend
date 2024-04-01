import React, { useContext, useEffect, useCallback } from "react";
import { VStack, Badge, View } from "native-base";
import { useDispatch, useSelector } from "react-redux";
import { BellIcon } from "react-native-heroicons/solid";
import axios from "axios";
import AuthGlobal from "../Context/Store/AuthGlobal";
import baseURL from "../assets/common/baseUrl";
import * as actions from "../Redux/Actions/notificationActions";

const NotificationIcon = (props) => {
  const dispatch = useDispatch();
  const color = props.color;
  const context = useContext(AuthGlobal);
  const id = context.stateUser.user.userId;

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await axios.get(`${baseURL}notifications/unread/${id}`);

      console.log("response:", response.data.unreadCount);
      dispatch(actions.fetchUnreadCountSuccess(response.data.unreadCount)); // Dispatch action to update Redux store
    } catch (error) {
      console.error("Error fetching unread notification count:", error);
    }
  }, [dispatch, id]);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  const unreadCount = useSelector((state) => state.notificationItems.unreadCount);

  return (
    <>
      {unreadCount > 0 ? (
        <VStack>
          <View className="">
            <Badge
              className="bg-red-500 border-solid border-white"
              rounded="full"
              mb={-3}
              mr={-2}
              zIndex={1}
              variant="solid"
              alignSelf="flex-end"
              _text={{
                fontSize: 10,
              }}
            >
              {unreadCount}
            </Badge>
            <BellIcon color={color} />
          </View>
        </VStack>
      ) : (
        <BellIcon color={color} />
      )}
    </>
  );
};

export default NotificationIcon;
