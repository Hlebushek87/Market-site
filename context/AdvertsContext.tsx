import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Advert } from '../src/types';
import { initialAdverts } from '../data/mockAdverts';

interface AdvertsState {
  adverts: Advert[];
}

type Action =
  | { type: 'ADD'; payload: Advert }
  | { type: 'UPDATE'; payload: Advert }
  | { type: 'DELETE'; payload: string };

function advertsReducer(state: AdvertsState, action: Action): AdvertsState {
  switch (action.type) {
    case 'ADD':
      return { ...state, adverts: [action.payload, ...state.adverts] };
    case 'UPDATE':
      return {
        ...state,
        adverts: state.adverts.map((a) =>
          a.id === action.payload.id ? action.payload : a
        ),
      };
    case 'DELETE':
      return {
        ...state,
        adverts: state.adverts.filter((a) => a.id !== action.payload),
      };
    default:
      return state;
  }
}

interface AdvertsContextValue {
  adverts: Advert[];
  addAdvert: (advert: Omit<Advert, 'id' | 'createdAt'>) => void;
  updateAdvert: (advert: Advert) => void;
  deleteAdvert: (id: string) => void;
  getAdvert: (id: string) => Advert | undefined;
}

const AdvertsContext = createContext<AdvertsContextValue | undefined>(undefined);

export const AdvertsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(advertsReducer, {
    adverts: initialAdverts,
  });

  const addAdvert = (data: Omit<Advert, 'id' | 'createdAt'>) => {
    const newAdvert: Advert = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD', payload: newAdvert });
  };

  const updateAdvert = (advert: Advert) => {
    dispatch({ type: 'UPDATE', payload: advert });
  };

  const deleteAdvert = (id: string) => {
    dispatch({ type: 'DELETE', payload: id });
  };

  const getAdvert = (id: string) => state.adverts.find((a) => a.id === id);

  return (
    <AdvertsContext.Provider
      value={{ adverts: state.adverts, addAdvert, updateAdvert, deleteAdvert, getAdvert }}
    >
      {children}
    </AdvertsContext.Provider>
  );
};

export const useAdverts = () => {
  const context = useContext(AdvertsContext);
  if (!context) {
    throw new Error('useAdverts must be used within AdvertsProvider');
  }
  return context;
};