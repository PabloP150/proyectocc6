import React, { createContext, useState, useContext } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [counter, setCounter] = useState(0);

    const addToCart = (item) => {
        const itemWithParsedPrice = {
            ...item,
            precio: parseFloat(item.precio)
        };
        setCart([...cart, itemWithParsedPrice]);
        setCounter(counter + 1);
    };

    const removeFromCart = (index) => { 
        const updatedCart = [...cart];
        updatedCart.splice(index, 1);
        setCart(updatedCart);
        setCounter(counter - 1);
    };

    return (
        <CartContext.Provider value={{ cart, counter, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('Context error');
    }
    return context;
};
