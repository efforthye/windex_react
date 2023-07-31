import OverviewCard from '../Overview/OverviewCard';
import { Box, Grid, Paper } from '@mui/material';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useState, useEffect } from 'react';
import CurrencyVendorCard from './CurrencyVendorCard';
import CurrencyMintCard from './CurrencyMintCard';
import CurrencyFeeRate from './CurrencyFeeRate';
import CurrencyWithdrawCard from './CurrencyWithdrawCard';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { render } from '@/module/features/renderSlice';

const Currency = ({ web3, account }: { web3: any; account: string }) => {
    const [stakeVendorHut, setStakeVendorHut] = useState<number>(0);
    const [swapVendorHut, setSwapVendorHut] = useState<Array<number>>([0, 0]);
    const [totalSwapSupplyHut, setTotalSwapSupplyHut] = useState<number>(0);
    const [totalStake, setTotalStake] = useState<number>(0);
    const [totalRewards, setTotalRewards] = useState<number>(0);
    const [icoVendorHut, setICOVendorHut] = useState<number>(0);
    const [icoTarget, setICOTarget] = useState<number>(0);
    const [icoAmount, setICOAmount] = useState<number>(0);
    const [icoInvestor, setICOInvestor] = useState<number>(0);
    const [withdrawHUTInput, setWithdrawHUTInput] = useState<number>();
    const [withdrawMATICInput, setWithdrawMATICInput] = useState<number>();
    const isRendered = useAppSelector((state) => state.render);
    const dispatch = useAppDispatch();

    const renderFunction = () => {
        dispatch(render());
    };

    const getTotalStakedData = async () => {
        try {
            const { data } = await axios.post('https://server.efforthye.com/api/contract/adminSteakDisplay');
            setTotalStake(data.totalSteak);
            setTotalRewards(data.totalRewards);
            setStakeVendorHut(data.VendorHut);
        } catch (error) {
            return error;
        }
    };
    const getSwapHutAmount = async () => {
        try {
            const { data } = await axios.post('https://server.efforthye.com/api/contract/adminSwapDisplay');
            setSwapVendorHut([data.vendorHutAmount, data.vendorMaticAmount]);
            setTotalSwapSupplyHut(data.totalSupplyHut);
        } catch (error) {
            return error;
        }
    };

    const getICOHutAmount = async () => {
        try {
            const { data } = await axios.post('https://server.efforthye.com/api/contract/IcoAdminDisplay');
            setICOTarget(data.targetAmount);
            setICOAmount(data.nowAmount);
            setICOVendorHut(data.hutAmount);
            setICOInvestor(data.investors);
        } catch (error) {
            return error;
        }
    };

    useEffect(() => {
        getTotalStakedData();
        getSwapHutAmount();
        getICOHutAmount();
    }, [isRendered]);

    return (
        <CurrencyBox>
            <Paper sx={{ padding: '20px 0px 20px 20px', fontSize: '2rem', fontWeight: '600', color: 'var(--blue)' }}>
                Currency
            </Paper>
            <Divider />
            <Grid container gap={2} className={'topCardsContainer'}>
                <Grid marginY={2}>
                    <Paper className={'dataCard'}>
                        <CurrencyVendorCard
                            stakeVendorHut={stakeVendorHut}
                            swapVendorHut={swapVendorHut}
                            totalSwapSupplyHut={totalSwapSupplyHut}
                            icoVendorHut={icoVendorHut}
                        />
                    </Paper>
                </Grid>
                <Grid marginY={2}>
                    <Paper className={'dataCard'}>
                        <CurrencyMintCard web3={web3} account={account} renderFunction={renderFunction} />
                    </Paper>
                </Grid>
                <Grid marginY={2}>
                    <Paper className={'dataCard'}>
                        <OverviewCard title={'Swap'} />
                    </Paper>
                </Grid>
                <Grid marginY={2}>
                    <Paper className={'dataCard'}>
                        <CurrencyFeeRate web3={web3} account={account} />
                    </Paper>
                </Grid>
                <Grid marginY={2}>
                    <Paper className={'dataCard'}>
                        <CurrencyWithdrawCard
                            web3={web3}
                            account={account}
                            renderFunction={renderFunction}
                        ></CurrencyWithdrawCard>
                    </Paper>
                </Grid>
            </Grid>
        </CurrencyBox>
    );
};

export default Currency;

const CurrencyBox = styled(Box)`
    .topCardsContainer {
        display: grid;
        grid-template-columns: 1fr;

        @media screen and (min-width: 768px) {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    .dataCard {
        padding: 20px;
    }
`;
