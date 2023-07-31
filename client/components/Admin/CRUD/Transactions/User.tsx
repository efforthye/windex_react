import { useState, useEffect } from 'react';
import axios from 'axios';
import ITransactionList from '@/interface/ITransactionList.inerface';
import { Box, Paper } from '@mui/material';
import TextField from '@mui/material/TextField';
import CustomTable from '../../Overview/Table';

const User = () => {
    const [userTxList, setUserTxList] = useState<Array<ITransactionList>>([]);
    const [userFilterText, setUserFilterText] = useState<string>('');

    const getUserTxFunc = async () => {
        try {
            const { data } = await axios.get('https://server.efforthye.com/api/admin/userTransactionList');
            setUserTxList([...data]);
            return data;
        } catch (error) {
            console.error(error);
            return error;
        }
    };

    useEffect(() => {
        getUserTxFunc();
    }, []);

    return (
        <div>
            <Box>
                <Paper
                    elevation={3}
                    sx={{ padding: '20px 0px 20px 20px', fontSize: '2rem', fontWeight: '600', color: 'var(--blue)' }}
                >
                    User Transactions
                </Paper>
                <TextField
                    sx={{ right: 0 }}
                    id="standard-search"
                    label={`type / hash / account`}
                    variant="standard"
                    type="text"
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setUserFilterText(e.target.value);
                    }}
                />
            </Box>
            <Box>
                <CustomTable
                    data={userTxList.filter((item) => {
                        if (
                            item.hash.toUpperCase().includes(userFilterText.toUpperCase()) ||
                            item.from.toUpperCase().includes(userFilterText.toUpperCase()) ||
                            item.to.toUpperCase().includes(userFilterText.toUpperCase()) ||
                            item.type.toUpperCase().includes(userFilterText.toUpperCase()) ||
                            item.status.includes(userFilterText)
                        )
                            return {
                                type: item.type,
                                from: item.from,
                                to: item.to,
                                status: item.status,
                                createdAt: item.createdAt,
                            };
                    })}
                />
            </Box>
        </div>
    );
};

export default User;
