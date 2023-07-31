import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const NftUpper = () => {
    const router = useRouter();
    const [curRouter, setCurRouter] = useState<string>('');
    useEffect(() => {
        const urlName = router.route.replaceAll('/', '');
        if (urlName === 'stakingbatchStake') {
            setCurRouter('batch');
        } else if (urlName === 'stakingclaimableItem') {
            setCurRouter('allClaim');
        } else {
            setCurRouter('');
        }
    }, [router]);
    return (
        <NftsUpperDiv>
            <UpperStyleDiv>
                <div className={` ${curRouter === 'batch' ? 'winStyle-fontGradient fg-gold ac-orange' : ''}`}>
                    <Link href={'/staking/batchStake'}>일괄 스테이킹</Link>
                </div>
                <div className={` ${curRouter === 'allClaim' ? 'winStyle-fontGradient fg-gold ac-orange' : ''}`}>
                    <Link href={'/staking/claimableItem'}>예치 현황</Link>
                </div>
            </UpperStyleDiv>
        </NftsUpperDiv>
    );
};

const NftsUpperDiv = styled.div`
    & > div:first-child {
        width: 100%;
    }
    & > div:last-child {
        width: 100%;
    }
`;

const UpperStyleDiv = styled.div`
    display: flex;
    justify-content: end;
    column-gap: 1%;
    & > div {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        border: 1px solid var(--grey);
        border-radius: 10px;
        height: fit-content;

        & > a {
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
`;

export default NftUpper;
