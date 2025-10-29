import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

const CartContext = createContext(null)

function reducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return action.payload
    case 'ADD': {
      const { product, qty = 1 } = action.payload
      const exists = state.items.find(i => i.id === product.id)
      let items
      if (exists) {
        items = state.items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + (qty || 1) } : i)
      } else {
        items = [...state.items, { ...product, quantity: qty || 1 }]
      }
      return { items }
    }
    case 'REMOVE':
      return { items: state.items.filter(i => i.id !== action.payload) }
    case 'UPDATE_QTY': {
      const items = state.items.map(i => i.id === action.payload.id ? { ...i, quantity: Math.max(1, action.payload.quantity) } : i)
      return { items }
    }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

const initialState = { items: [] }

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Load from localStorage once
  useEffect(() => {
    const raw = localStorage.getItem('cart:v1')
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed.items)) {
          dispatch({ type: 'INIT', payload: { items: parsed.items } })
        }
      } catch {}
    }
  }, [])

  // Persist changes
  useEffect(() => {
    localStorage.setItem('cart:v1', JSON.stringify(state))
  }, [state])

  const value = useMemo(() => {
    const items = state.items
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0)

    return {
      items,
      total,
      totalQuantity,
      addItem: (product, qty = 1) => dispatch({ type: 'ADD', payload: { product, qty } }),
      removeItem: (id) => dispatch({ type: 'REMOVE', payload: id }),
      updateQuantity: (id, quantity) => dispatch({ type: 'UPDATE_QTY', payload: { id, quantity } }),
      clear: () => dispatch({ type: 'CLEAR' }),
    }
  }, [state])

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
