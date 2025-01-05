import { createStore, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import {rootReducer} from "./Reducer";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user'] // Chỉ lưu trữ reducer 'user'
};


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
    persistedReducer,
    applyMiddleware(thunk)
);

export const persistor = persistStore(store);