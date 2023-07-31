import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';

import { IAllClaimData, IClaimAbleTokenItem } from '@/interface/INftUpper.interface';
import { dateFormat } from '@/module/tools';
import { modalAsync } from '@/module/features/modalSlice';
import { getBalanceThunk } from '@/module/features/balanceSlice';
import { render } from '@/module/features/renderSlice';
import NftClaimable from '@/components/NftsUpper/NftClaimable';
import NftUpper from '@/components/NftsUpper/NftUpper';

const ClaimableItem = ({ web3, account }: { web3: any; account: string }) => {
    const [allClaimData, setAllClaimData] = useState<IAllClaimData>({ earnedReward: '0', claimsAmount: '0' });
    const [claimAbleToken, setClaimAbleToken] = useState<IClaimAbleTokenItem[] | undefined>();
    const dispatch = useAppDispatch();
    const getBalance = (_account: string) => dispatch(getBalanceThunk(_account));

    const batchClaimRequest = async () => {
        let status = '';
        try {
            if (!claimAbleToken?.length) return alert('수령 가능한 NFT가 존재하지 않습니다.');
            const { data } = await axios.post('https://server.efforthye.com/api/contract/batchClaim', { account });
            const batchClaimObj = await web3.web3.eth.sendTransaction(data.batchClaimObj);
            const { data: saveData } = await axios.post('https://server.efforthye.com/api/staking/batchClaimSave', {
                account,
                transaction: batchClaimObj,
                stakeList: claimAbleToken,
            });
            console.log('saveData', saveData);

            getBalance(account);
            status = 'success';
            dispatch(render());
        } catch (err) {
            status = 'fail';
            console.log(err);
        }
        getClaimData();
        return status;
    };
    const getClaimData = async () => {
        try {
            const { data } = await axios.post('https://server.efforthye.com/api/contract/userSteakDisplay', {
                account,
            });
            setAllClaimData((state) => (state = { earnedReward: data.earnedReward, claimsAmount: data.claimsAmount }));
            setClaimAbleToken((state) => (state = data.claimAbleData));
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        getClaimData();
    }, []);

    if (!claimAbleToken) {
        return (
            <MainDiv>
                <NftUpper />
            </MainDiv>
        );
    }

    return (
        <MainDiv>
            <NftUpper />
            <NftClaimable claimAbleToken={claimAbleToken} account={account} batchClaimRequest={batchClaimRequest} />
        </MainDiv>
    );
};

const MainDiv = styled.div`
    & > div {
        margin-bottom: 20px;
    }
`;

export default ClaimableItem;
