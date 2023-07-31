import styled from 'styled-components';
import { modalAsync } from '@/module/features/modalSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { IAllClaimData, IClaimAbleTokenItem } from '@/interface/INftUpper.interface';
import { dateFormat } from '@/module/tools';
import Link from 'next/link';

const NftClaimable = ({
    claimAbleToken,
    account,
    batchClaimRequest,
}: {
    claimAbleToken: Array<IClaimAbleTokenItem> | undefined;
    account: string;
    batchClaimRequest: () => Promise<string | void>;
}) => {
    const dispatch = useAppDispatch();
    const modal = useAppSelector((state) => state.modal);

    return (
        <>
            {claimAbleToken == undefined || claimAbleToken.length == 0 ? (
                <DataUndefinedDiv>
                    <div>
                        <div>현재 예치된 NFT 들이 존재하지 않습니다</div>
                        <div>
                            <Link href={'/staking'}>NFT 스테이킹 하기</Link>
                        </div>
                    </div>
                </DataUndefinedDiv>
            ) : (
                <UnderStyleDiv>
                    <div>
                        <div>
                            <div>NFT</div>
                            <div>예치 일</div>
                            <div>예치량</div>
                            <div>보상 가격</div>
                        </div>
                        {claimAbleToken ? (
                            claimAbleToken.map((item, index) => {
                                let newtime = dateFormat(+item.startTime);
                                return (
                                    <div key={`token-map${index}`}>
                                        <div>{item.tokenId}</div>
                                        <div>{newtime}</div>
                                        <div>{item.amount} EA</div>
                                        <div>
                                            {item.reward} <p className="winStyle-fontGradient fg-gold ac-orange">HUT</p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <></>
                        )}
                        <div
                            onClick={() => {
                                if (account)
                                    dispatch(
                                        modalAsync({
                                            ...modal,
                                            promiseFunc: batchClaimRequest(),
                                        })
                                    );
                            }}
                        >
                            모두 수령하기
                        </div>
                    </div>{' '}
                </UnderStyleDiv>
            )}
        </>
    );
};

const UnderStyleDiv = styled.div`
    text-align: center;
    & > div {
        width: 100%;
        margin: auto;
        border: 1px solid var(--light);
        border-radius: 10px;
        & > div {
            display: flex;
            justify-content: space-between;
            padding: 10px 20px;
            border-bottom: 1px solid var(--light);
            & > div {
                width: 33%;
                text-align: left;
            }
            & > div:last-child {
                width: 20%;
                text-align: right;
            }
        }
        & > div:last-child {
            display: flex;
            justify-content: center;
            padding: 10px 20px;
            border-bottom: none;

            & > div {
                width: 33%;
                text-align: left;
            }
            & > div:last-child {
                width: 20%;
                text-align: right;
            }
            :hover {
                color: var(--gold);
                cursor: pointer;
                background: linear-gradient(
                    180deg,
                    var(--gold) 0%,
                    var(--gold) 40%,
                    var(--light) 50%,
                    var(--gold) 57%,
                    var(--orangelight) 100%
                );
                background-clip: text;
                -webkit-text-fill-color: transparent;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }
    }
`;
const DataUndefinedDiv = styled.div`
    margin-top: 20%;
    & > div {
        font-size: 20px;
        width: fit-content;
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 50px;
        padding: 10px 0;

        margin: auto;
        padding: 20px;
        & > div:last-child {
            border: 1px solid var(--grey);
            border-radius: 20px;
            padding: 20px;
            a {
                text-decoration: none;
                color: var(--light);

                :hover {
                    color: var(--light);
                    cursor: pointer;
                    background: linear-gradient(
                        -30deg,
                        var(--gold) 0%,
                        var(--gold) 40%,
                        var(--light) 50%,
                        var(--gold) 57%,
                        var(--orangelight) 100%
                    );
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }
        }
    }
`;

export default NftClaimable;
