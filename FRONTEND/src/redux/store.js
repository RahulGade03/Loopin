import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js"
import postSlice from './postSlice.js'
import { persistReducer } from 'redux-persist';
import storage from "redux-persist/lib/storage";
import socketSlice from "./socketSlice.js";
import chatSlice from "./chatSlice.js";

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const rootReducer = combineReducers({
    auth: authSlice,
    posts: postSlice,
    socketio: socketSlice,
    chat: chatSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER', 'persist/FLUSH', 'persist/PAUSE', 'persist/PURGE'],
        },
    }),
})

export default store;