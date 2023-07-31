import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { modalRequest, modalType } from '@/module/features/modalSlice';

const UnStake = () => {
    const textAry = useAppSelector((state) => state.text.unStake);
    const dispatch = useAppDispatch();

    const modalNextFunction = () => {
        dispatch(modalRequest(true));
    };
    return (
        <SlippageNoticeBox>
            {textAry.map((item, index) => {
                return <div key={`${item}-${index}`}>{item}</div>;
            })}

            <NoticeAcceptBtn onClick={modalNextFunction}>확인했습니다.</NoticeAcceptBtn>
        </SlippageNoticeBox>
    );
};

export default UnStake;

const SlippageNoticeBox = styled.div`
    padding-top: 30px;
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 19px;
    img {
        background-color: transparent;
        &:hover {
            filter: drop-shadow(0 0 2px var(--orange));
        }
    }
    & > li {
        font-size: 12px;
        line-height: 17.38px;
        background-color: transparent;
        display: flex;
        list-style: none;
        column-gap: 16px;
        & > div {
            display: flex;
        }
        &:not(.checked) img {
            filter: grayscale(100%);
            &:hover {
                filter: grayscale(100%) drop-shadow(0 0 2px var(--orange));
            }
        }
    }
`;

const NoticeAcceptBtn = styled.div`
    width: 113%;
    padding: 20px 0;
    margin-top: 80px;
    text-align: center;
    border: 1px solid var(--grey);
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    font-size: 15px;
    font-weight: 600;
    transform: translateX(-5.8%);
    &:hover {
        color: var(--bg);
        background: linear-gradient(90deg, #ffd740 0%, #ffab00 100%);
        cursor: pointer;
    }
`;
