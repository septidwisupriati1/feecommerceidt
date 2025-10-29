import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { products as seed } from '../shared/data/products.js'

const ProductsContext = createContext(null)

const initialState = {
  products: [],
  nextId: 1000,
}

function reducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return action.payload
    case 'CREATE': {
      const id = state.nextId
      const prod = { id, ...action.payload }
      return { products: [prod, ...state.products], nextId: id + 1 }
    }
    case 'UPDATE': {
      const products = state.products.map(p => p.id === action.payload.id ? { ...p, ...action.payload.data } : p)
      return { ...state, products }
    }
    case 'DELETE': {
      const products = state.products.filter(p => p.id !== action.payload)
      return { ...state, products }
    }
    default:
      return state
  }
}

export function ProductsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // init from storage or seed
  useEffect(() => {
    const raw = localStorage.getItem('products:v1')
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed.products)) {
          dispatch({ type: 'INIT', payload: parsed })
          return
        }
      } catch {}
    }
    // seed initial
    const seeded = { products: seed, nextId: 1000 }
    localStorage.setItem('products:v1', JSON.stringify(seeded))
    dispatch({ type: 'INIT', payload: seeded })
  }, [])

  // persist
  useEffect(() => {
    if (state.products.length) {
      localStorage.setItem('products:v1', JSON.stringify(state))
    }
  }, [state])

  const value = useMemo(() => ({
    products: state.products,
    getById: (id) => state.products.find(p => String(p.id) === String(id)),
    create: (data) => dispatch({ type: 'CREATE', payload: data }),
    update: (id, data) => dispatch({ type: 'UPDATE', payload: { id, data } }),
    remove: (id) => dispatch({ type: 'DELETE', payload: id }),
  }), [state])

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider')
  return ctx
}
