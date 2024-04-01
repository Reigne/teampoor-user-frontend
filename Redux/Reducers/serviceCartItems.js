import {
  ADD_SERVICE_TO_CART,
  REMOVE_SERVICE_FROM_CART,
  CLEAR_SERVICE_CART,
  // UPDATE_SERVICE_CART_ITEM_QUANTITY,
} from "../Constants";

const serviceCartItems = (state = [], action) => {
  switch (action.type) {
    case ADD_SERVICE_TO_CART:
      const newItem = action.payload;
      const existingItemIndex = state.findIndex(
        (item) => item.id === newItem.id
      );

      if (existingItemIndex !== -1) {
      } else {
        return [...state, action.payload];
      }

    case REMOVE_SERVICE_FROM_CART:
      return state.filter(
        (serviceCartItems) => serviceCartItems !== action.payload
      );

    case CLEAR_SERVICE_CART:
      return [];

    default:
      return state;
  }
};

export default serviceCartItems;
