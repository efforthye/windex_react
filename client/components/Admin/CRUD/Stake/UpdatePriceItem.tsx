import { Box, Grid, Paper } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import axios from 'axios';

const UpdatePriceItem = ({
    name,
    price,
    setIsListUpdate,
    id,
    handleClick,
}: {
    name: string;
    price: number;
    setIsListUpdate: Dispatch<SetStateAction<boolean>>;
    id: string;
    handleClick: (type: string) => void;
}) => {
    const [inputAmount, setInputAmount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const updateStakePriceFunc = async () => {
        if (!inputAmount) return;
        try {
            setIsLoading(true);
            const updateStakePrice = await axios.post('https://server.efforthye.com/api/admin/updateStakePrice', {
                id: id,
                price: inputAmount,
            });
            setIsListUpdate((state) => !state);
            handleClick('success');
            setInputAmount(0);
            setIsLoading(false);
            return updateStakePrice;
        } catch (error) {
            setInputAmount(0);
            setIsLoading(false);
            handleClick('error');
            return error;
        }
    };

    return (
        <>
            <Box>
                <TextField
                    sx={{ right: 0 }}
                    id="standard-search"
                    label={`${name} : ${price} HUT`}
                    variant="standard"
                    type="number"
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setInputAmount(+e.target.value);
                    }}
                    value={inputAmount}
                />
            </Box>
            <Box>
                {isLoading ? (
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
                        Loading
                    </Box>
                ) : (
                    <Button
                        sx={{ height: '40px', width: '100px' }}
                        variant="contained"
                        onClick={() => {
                            updateStakePriceFunc();
                        }}
                    >
                        update
                    </Button>
                )}
            </Box>
        </>
    );
};

export default UpdatePriceItem;
