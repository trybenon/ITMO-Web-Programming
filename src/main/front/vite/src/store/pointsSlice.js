
import { createSlice } from '@reduxjs/toolkit';

const pointsSlice = createSlice({
    name: 'points',
    initialState: {
        results: []
    },
    reducers: {
        addPoint: (state, action) => {
            state.results.push(action.payload); 
        },
       
        setPoints: (state, action) => {
            state.results = action.payload;
        },
       
        clearPoints: (state) => {
            state.results = [];
        }
    }
});

export const { addPoint, setPoints, clearPoints } = pointsSlice.actions;
export default pointsSlice.reducer;