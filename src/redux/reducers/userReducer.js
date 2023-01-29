import cookie from 'react-cookies'

const initState = {
    "user": cookie.load('user'),
    
}

const userReducer = (state = initState, action) => {
    switch (action.type) {// day la cac action de thay doi state
        case 'LOGIN':
            return {
                ...state,
                "user": action.payload
            }
        case 'LOGOUT':
            return {
                ...state,
                "user": null
            }
        default:
            return state;
    }
}

export default userReducer