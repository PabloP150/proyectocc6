import React, { createContext, useState, useContext } from 'react';

// Crea un contexto para el carrito
export const CartContext = createContext();

// Componente proveedor del contexto del carrito
export function CartProvider({ children }) {
    // Estado para almacenar los items del carrito
    const [cart, setCart] = useState([]);
    // Estado para llevar la cuenta del número de items en el carrito
    const [counter, setCounter] = useState(0);

    // Función para añadir un item al carrito
    const addToCart = (item) => {
        // Asegura que el precio del item sea un número
        const itemWithParsedPrice = {
            ...item,
            precio: parseFloat(item.precio)
        };
        // Añade el nuevo item al carrito
        setCart([...cart, itemWithParsedPrice]);
        // Incrementa el contador
        setCounter(counter + 1);
    };

    // Función para remover un item del carrito
    const removeFromCart = (index) => { 
        // Crea una copia del carrito actual
        const updatedCart = [...cart];
        // Elimina el item en el índice especificado
        updatedCart.splice(index, 1);
        // Actualiza el carrito
        setCart(updatedCart);
        // Decrementa el contador
        setCounter(counter - 1);
    };

    // Proporciona el contexto del carrito a los componentes hijos
    return (
        <CartContext.Provider value={{ cart, counter, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

// Hook personalizado para usar el contexto del carrito
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
};