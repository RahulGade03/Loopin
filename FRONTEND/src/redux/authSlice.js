import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice ({
    name: "auth",
    initialState: {
        user:null,
        userProfile: null,
        selectedProfile: null,
        suggestedUsers: null,
    },
    reducers: {
        setAuthUser: (state, action) => {
            state.user = action.payload;
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload;
        },
        setSelectedProfile: (state, action) => {
            state.selectedProfile = action.payload;
        },
        setSuggestedUsers: (state, action) => {
            state.suggestedUsers = action.payload;
        }
    }
});

export const {setAuthUser, setUserProfile, setSelectedProfile, setSuggestedUsers} = authSlice.actions;
export default authSlice.reducer;