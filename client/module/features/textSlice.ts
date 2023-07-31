import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface ISlipageText {
    slipageNotice: Array<string>;
    slipageSetting: string;
    unStake: Array<string>;
}
const initialState: ISlipageText = {
    slipageNotice: [
        '슬리피지 최종 설정 전 선택한 슬리피지에 따른 예상 거래 수량과 최소 거래 수량을 확인하시길 바랍니다.',
        '과도한 슬리피지 설정은 거래 허용 범위를 넓혀 손실이 발생할 수 있으니 각별히 주의해주시길 바랍니다.',
        "스왑 거래와 풀 예치에 능숙한 이용자만 '슬리피지 설정'을 사용하시길 바랍니다.",
    ],
    slipageSetting: `Lorem ipsum dolor sit amet consectetur. Amet est feugiat et augue
elementum dictum ante aliquet. Lorem sem in sollicitudin cursus
posuere. Eget sit commodo fames nibh enim dictum.
Fringilla vulputate enim sit laoreet pellentesque mauris odio.`,
    unStake: [
        '스테이크 취소에 따른 수수료부과는 본인몫입니다.',
        '스테이크를 진행한 경과에 따른 추가적인 보상은 없으니 유의 바랍니다.',
        '취소에 따른 불이익은 본인이 책임져야합니다.',
    ],
};

const textSlice = createSlice({
    name: 'text',
    initialState,
    reducers: {
        setSlipageNotice: (state, { payload }) => {
            state.slipageNotice = payload;
        },
        setSlipageSetting: (state, { payload }) => {
            state.slipageSetting = payload;
        },
        setUnStake: (state, { payload }) => {
            state.unStake = payload;
        },
    },
});

const { actions, reducer: textSliceReducer } = textSlice;

export const { setSlipageNotice, setSlipageSetting, setUnStake } = actions;

export default textSliceReducer;
