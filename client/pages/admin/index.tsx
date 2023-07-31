import styledComp from 'styled-components';
import { Box, Grid, Paper } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { makeReducedString } from '../../module/tools';
import SideMenu from '@/components/Admin/SideMenu/SideMenu';
import ICO from '@/components/Admin/CRUD/ICO/ICO';
import Stake from '@/components/Admin/CRUD/Stake/Stake';
import TxAdmin from '@/components/Admin/CRUD/Transactions/Admin';
import User from '@/components/Admin/CRUD/Transactions/User';
import Overview from '@/components/Admin/Overview/Overview';
import Currency from '@/components/Admin/Currency/Currency';
import Warning from '@/components/Admin/CRUD/Warning/Warning';
import axios from 'axios';

const Admin = ({ web3, account }: { web3: any; account: string }) => {
    const [adminPassWord, setAdminPassword] = useState<string>('');
    // 여기, access는 쿠키를 우선 확인하여 정보 기본값으로 집어넣기
    const [access, setAccess] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [page, setPage] = useState<string>('Overview');

    const drawerWidth = 240;

    const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
        open?: boolean;
    }>(({ theme, open }) => ({
        flexGrow: 0,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `${drawerWidth}px`,
        ...(!open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 64,
        }),
    }));

    // 관리자 쿠키 인증
    const authentication = async (adminCookie: string) => {
        const { data } = await axios.post('https://server.efforthye.com/api/admin/authentication', {
            adminCookie,
        });
        const { status, text } = data;
        if (status == 201) {
            setAccess(true);
        }
    };

    useEffect(() => {
        // 전체 쿠키의 값을 잘라 객체로 저장한다.
        let cookies: Array<string> = document.cookie.split(' ');
        const cookieObj: { [key: string]: string } = {};
        cookies.forEach((cookie) => {
            if (cookie.includes('=')) {
                const [rawKey, rawValue] = cookie.split('=');
                const key = rawKey?.trim();
                const value = rawValue?.trim().replace(/;$/, ''); // 세미콜론 제거
                cookieObj[key] = value;
            }
            setAccess(true); // 임시
        });
        // 관리자 쿠키 인증
        const adminCookie = cookieObj['windex-admin'];
        // if (adminCookie) authentication(adminCookie);
        if (adminCookie) setAccess(true); // 임시
    }, []);

    if (!access) {
        return (
            <AdminLoginBox className={'fg-black'}>
                <div>관리자 {makeReducedString(account)} 계정 접근 확인</div>
                <h1 className="adminLoginTitle fg-orange">관리자 페이지 로그인</h1>
                <input
                    type="password"
                    onInput={(e) => setAdminPassword(e.currentTarget.value)}
                    placeholder="비밀번호 입력"
                />
                <button
                    className="bg-blue"
                    onClick={async (e) => {
                        try {
                            console.log({ path: window.location.pathname });
                            const path = window.location.pathname;
                            const { data } = await axios.post(
                                'https://server.efforthye.com/api/admin/login',
                                {
                                    account,
                                    password: adminPassWord,
                                    path,
                                },
                                {
                                    withCredentials: true, // 인증 정보를 포함하도록 설정(중요)
                                    headers: {
                                        SameSite: 'None', // SameSite 옵션 지정
                                        Secure: false, // HTTPS에서만 전송
                                        preflightContinue: true,
                                    },
                                }
                            );
                            const { status, text } = data;
                            switch (status) {
                                case 201:
                                    setAccess(true);
                                    alert(text);
                                    break;
                                case 401:
                                    setAccess(false);
                                    alert(text);
                                    break;
                            }
                        } catch (err) {
                            console.log(err);
                            setAccess(false);
                        }
                    }}
                >
                    확인
                </button>
            </AdminLoginBox>
        );
    } else {
        return (
            <AdminBox>
                <SideMenu open={open} setOpen={setOpen} setPage={setPage} page={page} />
                <Main open={open}>
                    {page == 'Overview' && <Overview />}
                    {page == 'Currency' && <Currency web3={web3} account={account} />}
                    {page == 'Stake' && <Stake web3={web3} account={account} />}
                    {page == 'ICO' && <ICO account={account} web3={web3} />}
                    {page == 'Admin' && <TxAdmin />}
                    {page == 'User' && <User />}
                    {page == 'Warning' && <Warning />}
                </Main>
            </AdminBox>
        );
    }
};

export default Admin;

const AdminLoginBox = styledComp(Box)`
    width: 100%;
    height: 100vh;
    display: flex;
    row-gap: 30px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & .adminLoginTitle {
        font-size: 2rem;
    }
    input {
        padding: 3px 10px;
    }
    button {
        padding: 10px 20px;
        cursor: pointer;
    }
`;

const AdminBox = styledComp.div`
    width: 100%;
    color: var(--darkgrey);
`;
