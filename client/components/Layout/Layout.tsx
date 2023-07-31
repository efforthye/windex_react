import { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';
import Modal from '../modal/Modal';
import axios from 'axios';
import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/reduxHook';
import { setSlipageNotice, setSlipageSetting, setUnStake } from '@/module/features/textSlice';

type Props = {
    children: ReactNode;
    web3: any;
    account: string | undefined;
    modalText: any;
};

const Layout = ({ children, web3, account, modalText }: Props) => {
    const dispatch = useAppDispatch();

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
    useEffect(() => {
        getModalText();
    }, []);

    return (
        <div style={{ overflow: 'hidden' }}>
            <Modal modalText={modalText} />
            <header>
                <Header account={account}></Header>
            </header>

            <main>{children}</main>

            <footer>
                <Footer></Footer>
            </footer>
        </div>
    );
};

export async function getServerSideProps() {
    try {
        const { data } = await axios.get('https://server.efforthye.com/api/admin/getModalText');
        return {
            props: {
                modalText: data,
            },
        };
    } catch (error) {
        return {
            props: {
                modalText: null,
            },
        };
    }
}

export default Layout;
