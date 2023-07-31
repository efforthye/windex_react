import axios from 'axios';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const CurrencyWithdrawCard = ({
    web3,
    account,
    renderFunction,
}: {
    web3: any;
    account: string;
    renderFunction: () => void;
}) => {
    const [withdrawHUTInput, setWithdrawHUTInput] = useState<number>();
    const [withdrawMATICInput, setWithdrawMATICInput] = useState<number>();

    const [hutLoading, setHutLoading] = useState<boolean>(false);
    const [maticLoading, setMaticLoading] = useState<boolean>(false);

    const LoadingCSS = {
        height: '50px',
        width: '120px',
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

    const withdrawHUT = async () => {
        console.log(withdrawHUTInput);
        if (web3.web3) {
            try {
                setHutLoading(true);
                const { data } = await axios.post('https://server.efforthye.com/api/contract/withdrawHutToken', {
                    amount: withdrawHUTInput,
                    account,
                });
                const withdrawHUT = await web3?.web3.eth.sendTransaction(data);
                console.log(withdrawHUT);
                const txData = {
                    amount: Number(withdrawHUTInput),
                    type: 'Token',
                    status: 'Success',
                    from: withdrawHUT.from,
                    to: withdrawHUT.to,
                    hash: withdrawHUT.transactionHash,
                    saveType: 'withdraw',
                };
                const { data: saveData } = await axios.post('https://server.efforthye.com/api/admin/tokenSave', {
                    ...txData,
                });
                renderFunction();
                setHutLoading(false);
                return saveData;
            } catch (error) {
                console.error(error);
                setHutLoading(false);
                return error;
            }
        }
    };

    useEffect(() => {
        console.log(withdrawHUTInput, withdrawMATICInput);
    }, [withdrawHUTInput, withdrawMATICInput]);

    const withdrawMatic = async () => {
        console.log(withdrawMATICInput);
        if (web3.web3) {
            try {
                setMaticLoading(true);
                const { data } = await axios.post('https://server.efforthye.com/api/contract/withdrawMatic', {
                    amount: withdrawMATICInput,
                    account,
                });
                const withdrawMatic = await web3?.web3.eth.sendTransaction(data);
                console.log(withdrawMatic);
                const txData = {
                    amount: Number(withdrawHUTInput),
                    type: 'Token',
                    status: 'Success',
                    from: withdrawMatic.from,
                    to: withdrawMatic.to,
                    hash: withdrawMatic.transactionHash,
                    saveType: 'withdraw',
                };
                const { data: saveData } = await axios.post('https://server.efforthye.com/api/admin/tokenSave', {
                    ...txData,
                });
                setMaticLoading(false);
                return saveData;
            } catch (error) {
                setMaticLoading(false);
                console.error(error);
                return error;
            }
        }
    };

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
                Withdraw
            </Paper>

            {/* <Tooltip title={'HUT 인출'} arrow placement={'top'}>
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
                        label="Withdraw HUT"
                        variant="outlined"
                        type="number"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setWithdrawHUTInput(parseInt(e.target.value));
                        }}
                    />
                    {hutLoading ? (
                        <Box sx={LoadingCSS}>ING...</Box>
                    ) : (
                        <Button
                            sx={{ height: '50px', width: '120px' }}
                            variant="contained"
                            onClick={() => {
                                withdrawHUT();
                            }}
                        >
                            withdraw
                        </Button>
                    )}
                </Paper>
            </Tooltip> */}
            <Tooltip title={'Matic 인출'} arrow placement={'top'}>
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
                        label="Withdraw Matic"
                        variant="outlined"
                        type="number"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setWithdrawMATICInput(parseInt(e.target.value));
                        }}
                    />
                    {maticLoading ? (
                        <Box sx={LoadingCSS}>ING...</Box>
                    ) : (
                        <Button
                            sx={{ height: '50px', width: '120px' }}
                            variant="contained"
                            onClick={() => {
                                withdrawMatic();
                            }}
                        >
                            withdraw
                        </Button>
                    )}
                </Paper>
            </Tooltip>
        </Box>
    );
};

export default CurrencyWithdrawCard;
