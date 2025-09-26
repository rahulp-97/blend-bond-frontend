import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../redux-toolkit/userSlice';
import feedReducer from '../redux-toolkit/feedSlice';
import connectionReducer from './connectionSlice';
import requestReducer from './requestSlice';

const appStore = configureStore({
    reducer: {
        user: userReducer,
        feed: feedReducer,
        connections: connectionReducer,
        requests: requestReducer,
    }
});


export default appStore;