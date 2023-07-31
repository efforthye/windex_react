import styled from 'styled-components';
import axios from 'axios';
import { useEffect, useState } from 'react';

import BatchContentsCard from '@/components/BatchCard/BatchContentsCard';
import IBatchContents from '@/interface/IBatch.interface';
import NftUpper from '@/components/NftsUpper/NftUpper';

const BatchPage = ({ web3, account }: { web3: any; account: string }) => {
    const [myNFTData, setMyNFTData] = useState<[obj: IBatchContents] | undefined>();
    const getNFTData = async () => {
        try {
            const data = await axios.post('https://server.efforthye.com/api/nft/myNFTs', { account });
            setMyNFTData((state) => (state = data.data));
            return data.data;
        } catch (error) {
            return error;
        }
    };
    const [durationData, setDurationData] = useState<number[]>([]);
    const getDurationData = async () => {
        try {
            const { data } = await axios.get('https://server.efforthye.com/api/admin/durationOnly');
            setDurationData((state) => (state = data.sort((a: number, b: number) => a - b)));
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (account) {
            getNFTData();
            getDurationData();
            console.log(durationData);
        }
    }, [account]);

    if (!myNFTData) {
        return (
            <>
                <MainBox>
                    <NftUpper />
                </MainBox>
            </>
        );
    }

    return (
        <>
            <MainBox>
                <NftUpper />
                <BatchContentsCard data={myNFTData} account={account} web3={web3} durationData={durationData} />
            </MainBox>
        </>
    );
};

export default BatchPage;

const NFTsBox = styled.div`
    margin: 0 10%;
    width: 100%;
    display: flex;
    justify-content: center;
`;
const MainBox = styled.div`
    width: 100%;
    & > div {
        margin-bottom: 20px;
    }
`;
