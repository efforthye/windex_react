import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Input from '@/components/Input';
import axios from 'axios';
import styled from 'styled-components';
import PictureImg from '@/components/Picture/PicutreImg';
import TransactionResult from '@/components/modal/TransactionResult';

const Login = () => {
    const testNum = 3123.21312;
    const testSplitNum = testNum.toString().split('.');
    console.log(testSplitNum);
    const newArr = [testSplitNum[0], testSplitNum[1].slice(0, 3)];
    console.log(newArr.join('.'));

    console.log('https://testcolor99b.s3.us-east-1.amazonaws.com/1683526064324_file'.split('_')[1]);

    const TitleDiv = ({ title }: { title: string }) => (
        <ModalTitle className="fg-white bg-darkgrey">{title}</ModalTitle>
    );
    const CloseBtn = () => {
        return <ModalClose className="fg-grey">{'X'}</ModalClose>;
    };
    return (
        <>
            {' '}
            <LoginBoxModal backgroundColor="blue">
                <div>
                    <p className="winStyle-fontGradient fg-gold ac-orange">WIN</p>
                    <p>DEX</p>
                </div>
                <div>
                    <div>
                        <div>
                            <input placeholder="아이디" />
                        </div>
                    </div>
                    <div>
                        <div>
                            <input placeholder="비밀번호" type="password" />
                        </div>
                    </div>
                </div>
                <div>로그인123</div>
            </LoginBoxModal>
        </>
    );
};
interface StyledBoxProps {
    backgroundColor: string;
}

const LoginBoxModal = styled.div<StyledBoxProps>`
    width: fit-content;
    margin: auto;
    background-color: ${(props) => props.backgroundColor};
    & > div:first-child {
        display: flex;
        justify-content: center;
        & > p {
            font-size: 2rem;
            font-weight: 700;
        }
        & > p:nth-child(2) {
            color: var(--middlegrey);
        }
    }
    & > div {
        margin: 10px;
    }
    & > div:nth-child(2) {
        border: 1px solid var(--light);
        & > div {
            display: flex;
            align-items: center;
        }
    }
    input {
        font-weight: 700;
    }
    & > div:nth-child(3) {
        display: flex;
        justify-content: center;
        border: 1px solid var(--grey);
        border-radius: 0.6rem;
        padding: 10px;
    }
`;

const ModalTitle = styled.div`
    width: 100%;
    font-size: 19px;
    line-height: 28px;
    text-align: left;
`;
const ModalClose = styled.div`
    position: absolute;
    top: 30px;
    right: 30px;
    font-size: 1.5rem;
    border: none;
    background-color: transparent;
    cursor: pointer;
    &:hover {
        filter: drop-shadow(0 0 1px var(--gold));
    }
`;

export default Login;
