import styled from 'styled-components';
import { useAppDispatch } from '@/hooks/reduxHook';
import { modalClose } from '@/module/features/modalSlice';

const TransactionResult = ({ result }: { result: string }) => {
    const dispatch = useAppDispatch();
    const modalCloseFunction = () => {
        dispatch(modalClose());
    };

    return (
        <>
            {result == 'fail' ? (
                <>
                    <TransactionResultBox>
                        <div>
                            <p>해당 트랜잭션이 네트워크 상의 문제 혹은</p>
                            <p> 유저의 취소로 실패 했습니다.</p>
                        </div>
                    </TransactionResultBox>
                    <ModalBtnBox>
                        <div
                            onClick={() => {
                                modalCloseFunction();
                            }}
                        >
                            확인
                        </div>
                    </ModalBtnBox>
                </>
            ) : (
                <>
                    {' '}
                    <TransactionResultBox>
                        <div>
                            <p>해당 트랜잭션이 성공적으로 완료 되었습니다.</p>
                        </div>
                    </TransactionResultBox>
                    <ModalBtnBox>
                        <div
                            onClick={() => {
                                modalCloseFunction();
                            }}
                        >
                            확인
                        </div>
                    </ModalBtnBox>
                </>
            )}
        </>
    );
};

const TransactionResultBox = styled.div`
    width: 100%;
    p {
        font-size: 19px;
        color: var(--white);
        margin-bottom: 1rem;
    }
`;

const ModalBtnBox = styled.div`
    width: 113%;

    & > div {
        width: 100%;
        padding: 20px 0;
        text-align: center;
        border: 1px solid var(--grey);
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
        font-size: 15px;
        font-weight: 600;
        &:hover {
            color: var(--bg);
            background: linear-gradient(90deg, #ffd740 0%, #ffab00 100%);
            cursor: pointer;
        }
    }
`;

export default TransactionResult;
