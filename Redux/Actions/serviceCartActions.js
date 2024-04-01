import {
    ADD_SERVICE_TO_CART,
    REMOVE_SERVICE_FROM_CART,
    CLEAR_SERVICE_CART,
} from '../Constants';

export const addServiceToCart = (payload) => {
    console.log("payload",payload)
    return {
        type: ADD_SERVICE_TO_CART,
        payload
    }
}

export const removeServiceFromCart = (payload) => {
    return {
        type: REMOVE_SERVICE_FROM_CART,
        payload
    }
}

export const clearServiceCart = () => {
    return {
        type: CLEAR_SERVICE_CART
    }
}

