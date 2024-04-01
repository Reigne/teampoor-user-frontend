import {
    FETCH_UNREAD_COUNT_REQUEST,
    FETCH_UNREAD_COUNT_SUCCESS,
    FETCH_UNREAD_COUNT_FAILURE,
} from '../Constants';

export const fetchUnreadCountRequest = () => ({
  type: FETCH_UNREAD_COUNT_REQUEST,
});

export const fetchUnreadCountSuccess = (payload) => ({
  type: FETCH_UNREAD_COUNT_SUCCESS,
  payload,
});

export const fetchUnreadCountFailure = (error) => ({
  type: FETCH_UNREAD_COUNT_FAILURE,
  payload: error,
});