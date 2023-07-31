import { useState, useEffect, forwardRef, useRef } from 'react';
import axios from 'axios';
import { Box, Grid, Paper } from '@mui/material';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { setSlipageNotice, setSlipageSetting, setUnStake } from '@/module/features/textSlice';

const Warning = () => {
    const [slipageNoticeTextInput, setSlipageNoticeTextInput] = useState<Array<string>>([]);
    const [slipageSettingTextInput, setSlipageSettingTextInput] = useState<string>();
    const [unStakeTextInput, setUnStakeTextInput] = useState<Array<string>>([]);
    const warningTextAreas0 = useRef<HTMLTextAreaElement>(null);
    const warningTextAreas1 = useRef<HTMLTextAreaElement>(null);
    const warningTextAreas2 = useRef<HTMLTextAreaElement>(null);
    const warningText = useAppSelector((state) => state.text);
    const dispatch = useAppDispatch();
    const titleArray = ['Slipage Notice', 'Slipage Setting', 'UnStake'];
    const warningArray = ['Slipage 경고문 설정', 'Slipage 안내문 설정', 'UnStake 경고문 설정'];
    const warningTextAreaArray = [warningTextAreas0, warningTextAreas1, warningTextAreas2];
    const warningTextArray = [warningText.slipageNotice, warningText.slipageSetting, warningText.unStake];

    const getModalText = async () => {
        try {
            const {
                data: { slipageNotice, slipageSetting, unstakeNotice },
            } = await axios.get('https://server.efforthye.com/api/admin/getModalText');
            console.log(slipageNotice, slipageSetting, unstakeNotice);
            dispatch(setSlipageNotice(slipageNotice));
            dispatch(setSlipageSetting(slipageSetting));
            dispatch(setUnStake(unstakeNotice));
            return;
        } catch (error) {
            return error;
        }
    };

    const updateWarningText = async (_index: number) => {
        switch (_index) {
            case 0: {
                try {
                    const { data } = await axios.post('https://server.efforthye.com/api/admin/updateModalText', {
                        slipageNotice: slipageNoticeTextInput,
                    });
                    dispatch(setSlipageNotice(slipageNoticeTextInput));
                    if (warningTextAreas0.current) {
                        warningTextAreas0.current.value = '';
                    }
                    return data;
                } catch (error) {
                    return error;
                }
            }
            case 1: {
                try {
                    const { data } = await axios.post('https://server.efforthye.com/api/admin/updateModalText', {
                        slipageSetting: slipageSettingTextInput,
                    });
                    dispatch(setSlipageNotice(slipageSettingTextInput));
                    if (warningTextAreas1.current) {
                        warningTextAreas1.current.value = '';
                    }
                    return data;
                } catch (error) {
                    return error;
                }
            }
            case 2: {
                try {
                    const { data } = await axios.post('https://server.efforthye.com/api/admin/updateModalText', {
                        unStake: unStakeTextInput,
                    });
                    dispatch(setUnStake(unStakeTextInput));
                    if (warningTextAreas2.current) {
                        warningTextAreas2.current.value = '';
                    }
                    return data;
                } catch (error) {
                    return error;
                }
            }
        }
    };

    useEffect(() => {
        getModalText();
    }, []);

    return (
        <>
            <Paper
                elevation={3}
                sx={{ padding: '20px 0px 20px 20px', fontSize: '2rem', fontWeight: '600', color: 'var(--blue)' }}
            >
                Text Editor
            </Paper>

            <Box sx={{ display: 'flex', columnGap: '10%', '.textArea': { width: '100%', height: '80%' } }}>
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
                        width: '100%',
                    }}
                >
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
                            elevation={3}
                            sx={{
                                justifyContent: 'space-between',
                                display: 'flex',
                                alignItems: 'center',
                                pl: '15px',
                                padding: '20px 20px',
                            }}
                        >
                            <Box>각각의 TextArea에서 줄바꿈을 기준으로 string배열이 저장되게 됩니다.</Box>
                        </Paper>
                        {titleArray.map((curTitle, index) => {
                            return (
                                <Tooltip
                                    title={warningArray[index]}
                                    arrow
                                    placement={'top'}
                                    key={`${curTitle}-${index}`}
                                >
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            justifyContent: 'space-between',
                                            display: 'flex',
                                            alignItems: 'center',
                                            pl: '15px',
                                            padding: '20px 20px',
                                        }}
                                    >
                                        <Box sx={{ width: '70%', height: '120px' }}>
                                            <Box sx={{ mb: '10px' }}>{curTitle}</Box>
                                            <textarea
                                                className="textArea"
                                                onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                                    const text = e.target.value;
                                                    switch (index) {
                                                        case 0:
                                                            {
                                                                const lines = text
                                                                    .split('\n')
                                                                    .filter((item) => item != '');
                                                                setSlipageNoticeTextInput(lines);
                                                            }
                                                            break;
                                                        case 1:
                                                            {
                                                                const lines = text
                                                                    .split('\n')
                                                                    .filter((item) => item != '');
                                                                setSlipageSettingTextInput(lines.join(' '));
                                                            }
                                                            break;
                                                        case 2:
                                                            {
                                                                const lines = text
                                                                    .split('\n')
                                                                    .filter((item) => item != '');
                                                                setUnStakeTextInput(lines);
                                                            }
                                                            break;
                                                        default:
                                                            {
                                                                const lines = text
                                                                    .split('\n')
                                                                    .filter((item) => item != '');
                                                                setSlipageNoticeTextInput(lines);
                                                            }
                                                            break;
                                                    }
                                                }}
                                                ref={warningTextAreaArray[index]}
                                            ></textarea>
                                        </Box>
                                        <Box sx={{ width: '50%' }}>
                                            {warningTextArray[index]
                                                .toString()
                                                .split(',')
                                                .map((item, index) => {
                                                    return <div key={`${warningText}-${index}`}>{item}</div>;
                                                })}
                                        </Box>
                                        <Button
                                            sx={{ height: '50px' }}
                                            variant="contained"
                                            onClick={() => {
                                                updateWarningText(0);
                                            }}
                                        >
                                            Update
                                        </Button>
                                    </Paper>
                                </Tooltip>
                            );
                        })}
                    </Box>
                </Paper>
            </Box>
        </>
    );
};

export default Warning;
