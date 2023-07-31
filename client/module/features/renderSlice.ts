import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface IRender {
    render: boolean;
}
const initialState: IRender = {
    render: false,
};

const renderSlice = createSlice({
    name: 'render',
    initialState,
    reducers: {
        render: (state) => {
            state.render = !state.render;
        },
    },
});

const { actions, reducer: renderSliceReducer } = renderSlice;

export const { render } = actions;

export default renderSliceReducer;
