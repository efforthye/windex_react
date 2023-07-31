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

const CurrencyMintCard = ({
    web3,
    account,
    renderFunction,
}: {
    web3: any;
    account: string;
    renderFunction: () => void;
}) => {
    const [makeSwapInput, setMakeSwapInput] = useState<number>();
    const [makeStakeInput, setMakeStakeInput] = useState<number>();
    const [makeICOInput, setMakeICOInput] = useState<number>();
    const [swapLoading, setSwapLoading] = useState<boolean>(false);
    const [stakeLoading, setStakeLoading] = useState<boolean>(false);
    const [icoLoading, setICOLoading] = useState<boolean>(false);

    const LoadingCSS = {
        height: '50px',
        width: '80px',
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

    const makeSwapHUT = async (): Promise<any> => {
        try {
            if (!makeSwapInput) return;
            console.log(makeSwapInput, web3.account);
            setSwapLoading(true);
            const { data } = await axios.post('https://server.efforthye.com/api/contract/mintVendor', {
                amount: makeSwapInput,
                account: web3.account,
            });
            console.log('data', data);
            if (web3.web3) {
                const makeHUT = await web3?.web3.eth.sendTransaction(data);

                console.log('makeHUT', makeHUT);
                const txData = {
                    amount: makeSwapInput,
                    type: 'Token',
                    status: 'Success',
                    from: makeHUT.from,
                    to: makeHUT.to,
                    hash: makeHUT.transactionHash,
                    saveType: 'mint',
                };
                try {
                    const { data } = await axios.post('https://server.efforthye.com/api/admin/tokenSave', {
                        ...txData,
                    });
                    setSwapLoading(false);
                    renderFunction();
                    return data;
                } catch (error) {
                    setSwapLoading(false);
                    console.error(error);
                    return error;
                }
            }
        } catch (error) {
            setSwapLoading(false);
            return error;
        }
    };

    const makeStakeHUT = async (): Promise<any> => {
        try {
            if (!makeStakeInput) return;
            setStakeLoading(true);
            const { data } = await axios.post('https://server.efforthye.com/api/contract/mintStaking', {
                amount: makeStakeInput,
                account: web3.account,
            });
            console.log('data', data);
            if (web3.web3) {
                const makeHUT = await web3?.web3.eth.sendTransaction(data);

                console.log('makeHUT', makeHUT);
                const txData = {
                    amount: makeStakeInput,
                    type: 'Token',
                    status: 'Success',
                    from: makeHUT.from,
                    to: makeHUT.to,
                    hash: makeHUT.transactionHash,
                    saveType: 'mint',
                };
                try {
                    const { data } = await axios.post('https://server.efforthye.com/api/admin/tokenSave', {
                        ...txData,
                    });
                    setStakeLoading(false);
                    renderFunction();
                    return data;
                } catch (error) {
                    setStakeLoading(false);
                    console.error(error);
                    return error;
                }
            }
        } catch (error) {
            setStakeLoading(false);
            return error;
        }
    };

    const makeICOHUT = async (): Promise<any> => {
        try {
            if (!makeICOInput) return;
            setICOLoading(true);
            const { data } = await axios.post('https://server.efforthye.com/api/contract/mintICO', {
                amount: makeICOInput,
                account: web3.account,
            });
            console.log('data', data);
            if (web3.web3) {
                const makeHUT = await web3?.web3.eth.sendTransaction(data);

                console.log('makeHUT', makeHUT);
                const txData = {
                    amount: makeICOInput,
                    type: 'Token',
                    status: 'Success',
                    from: makeHUT.from,
                    to: makeHUT.to,
                    hash: makeHUT.transactionHash,
                    saveType: 'mint',
                };
                try {
                    const { data } = await axios.post('https://server.efforthye.com/api/admin/tokenSave', {
                        ...txData,
                    });
                    setICOLoading(false);
                    renderFunction();
                    return data;
                } catch (error) {
                    setICOLoading(false);
                    console.error(error);
                    return error;
                }
            }
        } catch (error) {
            setICOLoading(false);
            return error;
        }
    };

    useEffect(() => {
        console.log(makeICOInput);
    }, [makeICOInput]);

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
                Mint Currency
            </Paper>

            <Tooltip title={'현재 모인 금액'} arrow placement={'top'}>
                <Paper
                    elevation={3}
                    sx={{
                        justifyContent: 'space-between',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        pl: '15px',
                        padding: '40px 20px',
                    }}
                >
                    <TextField
                        id="outlined-basic"
                        label="Swap_HUT Vendor"
                        variant="outlined"
                        type="number"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setMakeSwapInput(parseInt(e.target.value));
                        }}
                    />
                    {swapLoading ? (
                        <Box sx={LoadingCSS}>Minting</Box>
                    ) : (
                        <Button
                            sx={{ height: '50px', width: '80px' }}
                            variant="contained"
                            onClick={() => {
                                makeSwapHUT();
                            }}
                        >
                            Mint
                        </Button>
                    )}
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
                        label="Stake Vendor"
                        variant="outlined"
                        type="number"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setMakeStakeInput(parseInt(e.target.value));
                        }}
                    />
                    {stakeLoading ? (
                        <Box sx={LoadingCSS}>Minting</Box>
                    ) : (
                        <Button
                            sx={{ height: '50px', width: '80px' }}
                            variant="contained"
                            onClick={() => {
                                makeStakeHUT();
                            }}
                        >
                            Mint
                        </Button>
                    )}
                </Paper>
            </Tooltip>

            <Tooltip title={'ICO Vendor의 HUT잔고량'} arrow placement={'top'}>
                <Paper
                    elevation={3}
                    sx={{
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        pl: '15px',
                        padding: '40px 20px',
                        justifyContent: 'space-between',
                    }}
                >
                    <TextField
                        id="outlined-basic"
                        label="ICO Vendor"
                        variant="outlined"
                        type="number"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setMakeICOInput(parseInt(e.target.value));
                        }}
                    />
                    {icoLoading ? (
                        <Box sx={LoadingCSS}>Minting</Box>
                    ) : (
                        <Button
                            sx={{ height: '50px', width: '80px' }}
                            variant="contained"
                            onClick={() => {
                                makeICOHUT();
                            }}
                        >
                            Mint
                        </Button>
                    )}
                </Paper>
            </Tooltip>
        </Box>
    );
};

export default CurrencyMintCard;
