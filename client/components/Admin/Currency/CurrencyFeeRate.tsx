import axios from 'axios';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const CurrencyFeeRate = ({ web3, account }: { web3: any; account: string }) => {
    const [feeRateInput, setFeeRateInput] = useState<number>();
    const [feeLoading, setFeeLoading] = useState<boolean>(false);
    const [feeRate, setFeeRate] = useState<number>(0);

    const LoadingCSS = {
        height: '50px',
        width: '100px',
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        borderRadius: '5px',
        color: 'white',
        fontWeight: '600',
        fontSize: '0.8rem',
    };

    const setFeeRateFunc = async () => {
        if (!feeRateInput || feeRateInput > 100 || feeRateInput <= 0) return;
        try {
            setFeeLoading(true);
            const { data } = await axios.post('https://server.efforthye.com/api/contract/setFeeRate', {
                rate: feeRateInput,
                account,
            });
            console.log(data);
            if (web3.web3) {
                try {
                    const feeRate = await web3?.web3.eth.sendTransaction(data);
                    const txData = {
                        amount: Number(feeRateInput),
                        type: 'FeeRate',
                        status: 'Success',
                        from: feeRate.from,
                        to: feeRate.to,
                        hash: feeRate.transactionHash,
                        saveType: 'feeRate',
                    };
                    // const {data : saveData} = await axios.post('https://server.efforthye.com/api/admin/tokenSave', {...txData});
                    setFeeRateInput(0);
                    setFeeLoading(false);
                    return feeRate;
                } catch (error) {
                    setFeeLoading(false);
                    console.error(error);
                    return error;
                }
            }
        } catch (error) {
            setFeeLoading(false);
        }
    };

    const getFeeRate = async () => {
        try {
            const { data } = await axios.post('https://server.efforthye.com/api/contract/getFeeRate');
            console.log(data);
            setFeeRate(data);
            return data;
        } catch (error) {
            console.error(error);
            return error;
        }
    };

    useEffect(() => {
        getFeeRate();
    }, [feeLoading]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'wrap',
                '& > :not(style)': {
                    m: 1,
                },
            }}
        >
            <Paper
                className={'header'}
                sx={{
                    width: '100%',
                    marginBottom: '50px',
                    padding: '20px 0',
                    fontSize: '1.5rem',
                    pl: '20px',
                }}
            >
                FeeRate
            </Paper>
            <Tooltip title={'투자 목표 금액'} arrow placement={'top'}>
                <Paper
                    elevation={3}
                    sx={{
                        justifyContent: 'space-between',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        pl: '15px',
                        padding: '20px',
                    }}
                >
                    FeeRate : {feeRate}
                </Paper>
            </Tooltip>
            <Tooltip title={'투자 목표 금액'} arrow placement={'top'}>
                <Paper
                    elevation={3}
                    sx={{
                        justifyContent: 'space-between',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        pl: '15px',
                        padding: '48px 20px',
                    }}
                >
                    <TextField
                        id="outlined-basic"
                        label="Fee Amount"
                        variant="outlined"
                        type="number"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setFeeRateInput(parseInt(e.target.value));
                        }}
                    />
                    {feeLoading ? (
                        <Box sx={LoadingCSS}>SETTING</Box>
                    ) : (
                        <Button
                            sx={{ height: '50px', width: '100px' }}
                            variant="contained"
                            onClick={() => {
                                setFeeRateFunc();
                            }}
                        >
                            Set
                        </Button>
                    )}
                </Paper>
            </Tooltip>
        </Box>
    );
};

export default CurrencyFeeRate;
