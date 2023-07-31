import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
interface tokenBalance {
    MATIC: string;
    HUT: string;
}
const initialState: tokenBalance = {
    MATIC: '0',
    HUT: '0',
};
export const getBalanceThunk = createAsyncThunk('/balance/getBalance', async (_account: string) => {
    try {
        const { data } = await axios.post('https://server.efforthye.com/api/contract/getBalance', {
            account: _account,
        });
        return data;
    } catch (error) {
        return error;
    }
});

const balanceSlice = createSlice({
    name: 'balance',
    initialState,
    reducers: {
        maticBalance: (state, { payload: amount }) => {
            state.MATIC = amount;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBalanceThunk.pending, (state, action) => {})
            .addCase(getBalanceThunk.fulfilled, (state, action) => {
                const { type, payload } = action;

                const maticChange = parseFloat(payload.MATIC);
                const HUTChange = parseFloat(payload.HUT);

                payload.MATIC = Math.floor(maticChange * 1000) / 1000;
                payload.HUT = Math.floor(HUTChange * 1000) / 1000;
                return payload;
            })
            .addCase(getBalanceThunk.rejected, (state, action) => {});
    },
});

const { actions, reducer: balanceSliceReducer } = balanceSlice;

export const { maticBalance } = actions;

export default balanceSliceReducer;
