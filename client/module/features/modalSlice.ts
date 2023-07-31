import { HYDRATE } from 'next-redux-wrapper';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface ModalState {
    isOpen: boolean;
    isLoading: boolean;
    type: string;
    request: boolean;
    transactionModal: string;
}

/**
 * type : duration, slippage, selectToken, slippageNotice
 */
const initialState: ModalState = {
    isOpen: false,
    isLoading: false,
    type: 'duration',
    request: false,
    transactionModal: '',
};

export const modalAsync = createAsyncThunk(
    'modal/modalAsync',
    async ({
        isOpen,
        isLoading,
        type,
        promiseFunc,
        transactionModal,
    }: {
        isOpen: boolean;
        isLoading: boolean;
        type: string;
        promiseFunc: Promise<any>;
        transactionModal: string;
    }) => {
        let tempData = '';
        const resultData = await new Promise((resolve, reject) => {
            promiseFunc
                .then((data) => {
                    tempData = data;
                    resolve(data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
        tempData == 'success' ? (tempData = 'success') : (tempData = 'fail');

        return { isOpen: true, type: tempData, isLoading, resultData, transactionModal: tempData };
    }
);

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        modalOpen: (state) => {
            state.isOpen = true;
        },
        modalClose: (state) => {
            state.isOpen = false;
        },
        modalType: (state, { payload: stateType }) => {
            return { ...state, isOpen: true, type: stateType };
        },
        modalRequest: (state, { payload }) => {
            return { ...state, request: payload };
        },
        transactionModalClose: (state) => {
            state.transactionModal = '';
        },
        transactionModalOpen: (state, { payload: transactionResult }) => {
            state.transactionModal = transactionResult;
        },
    },

    extraReducers: {
        [modalAsync.pending.type]: (state) => {
            console.log('pending');
            state.isOpen = true;
            state.isLoading = true;
        },
        [modalAsync.fulfilled.type]: (state, action) => {
            return {
                ...state,
                isLoading: false,
                type: action.payload.type,
                isOpen: true,
                request: false,
            };
        },
        [modalAsync.rejected.type]: (state, action) => {
            console.log('reject');

            return { ...state, isLoading: false, isOpen: true, request: false, type: action.payload.type };
        },
    },
});

const { actions, reducer: modalReducer } = modalSlice;
export const { modalOpen, modalClose, modalType, modalRequest, transactionModalClose, transactionModalOpen } = actions;
export default modalReducer;
