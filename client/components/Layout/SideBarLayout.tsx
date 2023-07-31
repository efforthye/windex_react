import { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';
import Modal from '../modal/Modal';
import axios from 'axios';
import SideBar from '../Menu/SideBar';
import styled from 'styled-components';
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

            <LayoutMain>
                <SideBar />
                {children}
            </LayoutMain>

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

const LayoutMain = styled.main`
    display: flex;
    padding: 0 10%;
    height: inherit;
    & > div:first-child {
        height: inherit;
        width: 25%;
    }
    & > main:nth-child(2) {
        width: 75%;
    }
    & > div:last-child {
        width: 75%;
    }
`;
