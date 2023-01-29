

export function buyProduct (product) {
    return {
        "type": "BUY_PRODUCT",
        "payload": product,
    }
}

export function deleteProduct (product) {
    return {
        "type": "DELETE_PRODUCT",
        "payload": product,
    }
}