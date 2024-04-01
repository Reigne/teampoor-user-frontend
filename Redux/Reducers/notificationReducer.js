import {
    FETCH_UNREAD_COUNT_REQUEST,
    FETCH_UNREAD_COUNT_SUCCESS,
    FETCH_UNREAD_COUNT_FAILURE,
  } from '../Constants';
  
  const initialState = {
    unreadCount: 0,
    loading: false,
    error: null,
  };
  
  const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_UNREAD_COUNT_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case FETCH_UNREAD_COUNT_SUCCESS:
        return {
          ...state,
          unreadCount: action.payload,
          loading: false,
          error: null,
        };
      case FETCH_UNREAD_COUNT_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default notificationReducer;