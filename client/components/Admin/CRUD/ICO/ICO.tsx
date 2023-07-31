import { useState, useEffect, forwardRef } from 'react';
import axios from 'axios';
import { Box, Grid, Paper } from '@mui/material';
import Button from '@mui/material/Button';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Tooltip from '@mui/material/Tooltip';
import CustomProgressBar from '../../Overview/ProgressBar';
import styled from 'styled-components';
import { getDate } from '@/module/tools';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';
const Clock = dynamic(() => import('react-live-clock'), { ssr: false });

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface IDate {
    day: number;
    hour: number;
    minute: number;
    second: number;
}

const ICO = ({ account, web3 }: { account: string; web3: any }) => {
    const [icoTarget, setICOTarget] = useState<number>(0);
    const [icoAmount, setICOAmount] = useState<number>(0);
    const [icoInvestor, setICOInvestor] = useState<number>(0);
    const [icoVendorHut, setICOVendorHut] = useState<number>(0);
    const [icoDeadLine, setICODeadLine] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [countDate, setCountDate] = useState<IDate>({
        day: 0,
        hour: 0,
        minute: 0,
        second: 0,
    });
    const [icoLoading, setIcoLoading] = useState<boolean>(false);

    const getICOData = async () => {
        try {
            const { data } = await axios.post('https://server.efforthye.com/api/contract/IcoAdminDisplay');
            const { data: userData } = await axios.post('https://server.efforthye.com/api/contract/IcoUserDisplay');
            setICODeadLine(userData.deadLine);
            setICOTarget(data.targetAmount);
            setICOAmount(data.nowAmount);
            setICOVendorHut(data.hutAmount);
            setICOInvestor(data.investors);
            return data;
        } catch (error) {
            return error;
        }
    };

    const goalClick = async () => {
        try {
            setIcoLoading(true);
            const { data } = await axios.post('https://server.efforthye.com/api/contract/reachedGoal', { account });
            if (web3.web3) {
                try {
                    const txData = await web3.web3.eth.sendTransaction(data);
                    handleClick('success');
                } catch (error) {
                    handleClick('error');
                }
            }
            setIcoLoading(false);
            return data;
        } catch (error) {
            console.error(error);
            setIcoLoading(false);
            handleClick('error');
            return error;
        }
    };

    const handleClick = (type: string, message?: string) => {
        if (type == 'success') {
            setOpen(true);
        } else if (type == 'error') {
            if (message) {
                setErrorMessage(message);
            }
            setErrorOpen(true);
        }
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorOpen(false);
        setOpen(false);
        setTimeout(() => {
            setErrorMessage('This is Error Message');
        }, 200);
    };

    useEffect(() => {
        getICOData();
    }, []);

    return (
        <>
            <Paper
                elevation={3}
                sx={{ padding: '20px 0px 20px 20px', fontSize: '2rem', fontWeight: '600', color: 'var(--blue)' }}
            >
                ICO
            </Paper>
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    This is a success message!
                </Alert>
            </Snackbar>
            <Snackbar open={errorOpen} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
            <Box sx={{ display: 'flex', columnGap: '10%' }}>
                <Paper
                    elevation={3}
                    sx={{
                        mt: '20px',
                        padding: '20px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        display: 'flex',
                        rowGap: '20px',
                        flexDirection: 'column',
                        mb: '20px',
                        width: '45%',
                    }}
                >
                    <Tooltip title={'현재까지 모은 Matic 모금액'} placement={'top'} arrow>
                        <Paper elevation={3} sx={{ height: '30px', display: 'flex', alignItems: 'center', pl: '15px' }}>
                            {(icoAmount * 100) / icoTarget} % 의 목표액 달성
                        </Paper>
                    </Tooltip>
                    <Tooltip title={'투자자 수'} placement={'top'} arrow>
                        <Paper elevation={3} sx={{ height: '30px', display: 'flex', alignItems: 'center', pl: '15px' }}>
                            {icoInvestor || 0} 명의 투자
                        </Paper>
                    </Tooltip>
                    <Tooltip title={'ICO에 남아있는 HUT 잔량'} placement={'top'} arrow>
                        <Paper elevation={3} sx={{ height: '30px', display: 'flex', alignItems: 'center', pl: '15px' }}>
                            ICO Vender : {icoVendorHut}
                        </Paper>
                    </Tooltip>
                </Paper>
                <Paper
                    elevation={3}
                    sx={{
                        mt: '20px',
                        padding: '20px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        display: 'flex',
                        rowGap: '20px',
                        flexDirection: 'column',
                        mb: '20px',
                        width: '45%',
                    }}
                >
                    <Box>Progress Bar</Box>
                    <CustomProgressBar value={icoAmount} goal={icoTarget} />
                    <ClockBox>
                        <div className="clockDiv">
                            <Clock
                                ticking={true}
                                onChange={(e: void | string) => {
                                    const DIFFTIME = (Number(icoDeadLine) * 1000 || 0) - Date.now();
                                    const DEADLINE = getDate(DIFFTIME);
                                    console.log(DEADLINE, DIFFTIME, icoDeadLine);
                                    if (DIFFTIME > 0) {
                                        setCountDate(() => ({
                                            day: DEADLINE.day,
                                            hour: DEADLINE.hour,
                                            minute: DEADLINE.minute,
                                            second: DEADLINE.second,
                                        }));
                                    }
                                }}
                            />
                        </div>
                        Now : <br />
                        {dayjs(Date.now()).format('YYYY-MM-DD HH:mm')}
                        <br />
                        <br />
                        Expired Date : <br />
                        {dayjs(Number(icoDeadLine) * 1000).format('YYYY MM DD HH:mm')}
                    </ClockBox>
                </Paper>
            </Box>
            {icoLoading ? (
                <Box
                    sx={{
                        height: '40px',
                        width: '100px',
                        display: 'flex',
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'red',
                        borderRadius: '5px',
                    }}
                >
                    Loading...
                </Box>
            ) : (
                <Button
                    sx={{ height: '40px' }}
                    variant="contained"
                    onClick={() => {
                        if (icoAmount >= icoTarget) goalClick();
                        else {
                            handleClick('error', 'ICO Error');
                        }
                    }}
                >
                    정산하기
                </Button>
            )}
        </>
    );
};

export default ICO;

const ClockBox = styled.div`
    width: 50%;
    display: flex;
    & > div {
        border: 1px solid var(--grey);
    }
    margin: 20px 0;
    .clockDiv {
        display: none;
    }
`;
