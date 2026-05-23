import { createContext, useContext, useReducer, ReactNode, useEffect, useCallback } from 'react';
import { Advert } from '../src/types';
import API_URL from '../src/api';
import { useAuth } from './AuthContext';

interface AdvertsState {
  adverts: Advert[];
}

type Action =
  | { type: 'SET'; payload: Advert[] }
  | { type: 'ADD'; payload: Advert }
  | { type: 'UPDATE'; payload: Advert }
  | { type: 'DELETE'; payload: string };

function advertsReducer(state: AdvertsState, action: Action): AdvertsState {
  switch (action.type) {
    case 'SET':
      return { ...state, adverts: action.payload };
    case 'ADD':
      return { ...state, adverts: [action.payload, ...state.adverts] };
    case 'UPDATE':
      return {
        ...state,
        adverts: state.adverts.map(a => a.id === action.payload.id ? action.payload : a)
      };
    case 'DELETE':
      return {
        ...state,
        adverts: state.adverts.filter(a => a.id !== action.payload)
      };
    default:
      return state;
  }
}

interface AdvertsContextValue {
  adverts: Advert[];
  addAdvert: (data: Omit<Advert, 'id' | 'createdAt'>) => Promise<void>;
  updateAdvert: (advert: Advert) => Promise<void>;
  deleteAdvert: (id: string) => Promise<void>;
  getAdvert: (id: string) => Advert | undefined;
  refreshAdverts: (search?: string, category?: string) => Promise<void>;
}

const AdvertsContext = createContext<AdvertsContextValue | undefined>(undefined);

export const AdvertsProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [state, dispatch] = useReducer(advertsReducer, { adverts: [] });

  const refreshAdverts = useCallback(async (search?: string, category?: string) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    const res = await fetch(`${API_URL}/adverts?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      dispatch({ type: 'SET', payload: data });
    }
  }, []);

  // Загружаем все объявления при монтировании
  useEffect(() => {
    refreshAdverts();
  }, [refreshAdverts]);

  const addAdvert = async (data: Omit<Advert, 'id' | 'createdAt'>) => {
    if (!token) return;
    const res = await fetch(`${API_URL}/adverts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      const newAdvert = await res.json();
      dispatch({ type: 'ADD', payload: newAdvert });
    }
  };

  const updateAdvert = async (advert: Advert) => {
    if (!token) return;
    const res = await fetch(`${API_URL}/adverts/${advert.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(advert)
    });
    if (res.ok) {
      const updated = await res.json();
      dispatch({ type: 'UPDATE', payload: updated });
    }
  };

  const deleteAdvert = async (id: string) => {
    if (!token) return;
    const res = await fetch(`${API_URL}/adverts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      dispatch({ type: 'DELETE', payload: id });
    }
  };

  const getAdvert = (id: string) => state.adverts.find(a => a.id === id);

  return (
    <AdvertsContext.Provider value={{
      adverts: state.adverts,
      addAdvert,
      updateAdvert,
      deleteAdvert,
      getAdvert,
      refreshAdverts
    }}>
      {children}
    </AdvertsContext.Provider>
  );
};

export const useAdverts = () => {
  const context = useContext(AdvertsContext);
  if (!context) throw new Error('useAdverts must be used within AdvertsProvider');
  return context;
};