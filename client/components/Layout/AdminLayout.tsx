import { ReactNode } from 'react';
import { CssBaseline } from '@mui/material';
import styled from '@emotion/styled';

type Props = {
    children: ReactNode;
    web3: any;
    account: string | undefined;
};

const AdminLayout = ({ children, web3, account }: Props) => {
    return (
        <AdminBox>
            <CssBaseline />
            <main>{children}</main>
        </AdminBox>
    );
};

export default AdminLayout;

const AdminBox = styled.div`
    background-color: white;
    pointer-events: auto !important;
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
    user-select: text !important;
`;
