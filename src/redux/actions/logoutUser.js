export function logoutUser (payload = null) {
    return {
        "type": "LOGOUT",
        "payload": payload
    }
}