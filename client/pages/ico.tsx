import styled from 'styled-components';
import axios from 'axios';
import { useEffect, useState } from 'react';
import CountdownClock from '@/components/CountdownClock';
import { modalAsync } from '@/module/features/modalSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { render } from '@/module/features/renderSlice';
import dayjs from 'dayjs';

const ICO = ({ web3, account }: { web3: any; account: string }) => {
    const [investAmount, setInvestAmount] = useState<number>(0);
    const [deadLine, setDeadLine] = useState<number>(new Date('2023-04-29 17:40:00').getTime());
    const [deadLineString, setDeadLineString] = useState<Date>();
    const [nowAmount, setNowAmount] = useState<number>(0);
    const [targetAmount, setTargetAmount] = useState<number>(0);
    const dispatch = useAppDispatch();
    const modal = useAppSelector((state) => state.modal);
    const renderState = useAppSelector((state) => state.render);

    const getICOUserDisplay = async () => {
        try {
            const { data } = await axios.post('https://server.efforthye.com/api/contract/IcoUserDisplay');
            setDeadLineString(new Date(Number(data.deadLine) * 1000));
            setDeadLine(Number(data.deadLine) * 1000);
            setNowAmount(data.nowAmount);
            setTargetAmount(data.targetAmount);
            console.log(data);
            return data;
        } catch (error) {
            console.error(error);
            return error;
        }
    };

    const investFunc = async () => {
        let status = '';
        if (!investAmount) return;
        if (deadLine < Date.now()) return alert('투자 기한이 지났습니다.');
        try {
            console.log('click', account, investAmount);
            const { data } = await axios.post('https://server.efforthye.com/api/contract/invest', {
                account,
                amount: investAmount,
            });
            console.log(data);
            const { data: saveData } = await web3.web3.eth.sendTransaction(data.sendMaticObj);
            dispatch(render());
            status = 'success';
        } catch (error) {
            console.error(error);
            status = 'fail';
        }
        return status;
    };

    useEffect(() => {
        getICOUserDisplay();
    }, [renderState]);

    useEffect(() => {
        console.log(investAmount);
    }, [investAmount]);

    return (
        <ICOBox>
            <ICOTitle className="fg-gold">Expiration</ICOTitle>
            {/* <ClockBox>
                <CountdownClock unit={'day'} deadLine={deadLine} />
                <CountdownClock unit={'hour'} deadLine={deadLine} />
                <CountdownClock unit={'minute'} deadLine={deadLine} />
                <CountdownClock unit={'second'} deadLine={deadLine} />
            </ClockBox> */}
            <div style={{ padding: '20px 0 5px 0' }}>투자만료일자</div>
            <div style={{ padding: '5px 0', fontSize: '2rem', minHeight: '72px' }}>
                {deadLineString && dayjs(deadLineString?.toString()).format('YYYY년 MM월 DD일 HH:mm')}
            </div>
            {/* <ICOGaugeBox percent={nowAmount}>
                <div className="bar"></div>
                <img src="/img/gauge.svg" alt="" />
            </ICOGaugeBox> */}
            <div style={{ padding: '10px 0 20px 0', minHeight: '72px' }}>
                투자유치현황 ( {nowAmount} <span>MATIC</span> / {targetAmount} MATIC )
            </div>
            <MeterGauge min="0" max={targetAmount} low={30} optimum={60} value={nowAmount}></MeterGauge>
            <AmountInputBox>
                <input
                    type="number"
                    onInput={(e) => {
                        setInvestAmount(e.currentTarget.valueAsNumber);
                    }}
                />
            </AmountInputBox>
            <ICOButtonBox
                className="winStyle-button"
                data-title="투자하기"
                onClick={() => {
                    dispatch(modalAsync({ ...modal, promiseFunc: investFunc() }));
                }}
            >
                <div>투자하기</div>
            </ICOButtonBox>
        </ICOBox>
    );
};

export default ICO;

const ICOBox = styled.div`
    position: relative;
    width: 80%;
    margin: 50px 10%;
    padding: 50px 0;
    border-radius: 15px;
    border: 1px solid var(--grey);
    display: flex;
    justify-content: start;
    align-items: center;
    flex-direction: column;
    /* &::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
        background: url('/img/warning.jpg');
        background-repeat: no-repeat;
        background-size: cover;
        z-index: 50;
        opacity: 0.5;
    } */
`;

const ClockBox = styled.div`
    width: 50%;
    display: flex;
    & > div {
        border: 1px solid var(--grey);
    }
    margin: 20px 0;
`;

const ICOGaugeBox = styled.div<{ percent: number }>`
    position: relative;
    --height: 85%;
    --width: 50%;
    width: var(--width);
    height: var(--height);
    display: flex;
    justify-content: left;
    margin: 40px 0;
    & .bar {
        /* -webkit-mask-image: url('/img/gaugeMask.svg');
        mask-image: url('/img/gaugeMask.svg');
        mask-repeat: no-repeat;
        mask-size: auto, auto;
        mask-position: 0 0; */
        position: absolute;
        border-radius: 15px;
        top: 8%;
        left: 7px;
        width: ${({ percent }) => percent - 3}%;
        height: 80%;
        transition: all 1s ease-in-out;
        background-color: green;
        transform: translateX(0%);
    }
    img {
        filter: invert(58%) sepia(61%) saturate(3236%) hue-rotate(3deg) brightness(108%) contrast(101%);
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`;

const ICOButtonBox = styled.div`
    border: 1px solid red;
    color: red;
    padding: 20px 30px;
    width: fit-content;
`;

const AmountInputBox = styled.div`
    width: 100%;
    display: flex;
    margin-bottom: 30px;
    padding: 20px 0;
    input {
        margin: auto;
        padding: 3px 5px;
    }
`;

const ICOTitle = styled.div`
    width: 100%;
    text-align: center;
    height: 50px;
    font-size: 2rem;
    margin: 20px 0;
`;

const MeterGauge = styled.meter`
    width: 50%;
    height: 100px;
    border: none;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    background: linear-gradient(to right, var(--white), var(--grey));

    &::-webkit-meter-bar {
        background-color: transparent;
    }

    &::-webkit-meter-optimum-value {
        background-color: var(--hotpink);
    }

    &::-webkit-meter-suboptimum-value {
        background-color: #ffc107;
    }

    &::-webkit-meter-even-less-good-value {
        background-color: #f44336;
    }

    &::-moz-meter-bar {
        background-color: transparent;
    }

    &::-moz-meter-optimum::-moz-meter-bar {
        background-color: #4caf50;
    }

    &::-moz-meter-suboptimum::-moz-meter-bar {
        background-color: #ffc107;
    }

    &::-moz-meter-even-less-good::-moz-meter-bar {
        background-color: #f44336;
    }
`;
