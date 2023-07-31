import type { AppProps } from 'next/app';
import WinStyle, { lightTheme, darkTheme } from '@/styles/winStyle';
import '../styles/fontImport.css';
import { ThemeProvider } from 'styled-components';
import { useEffect, useState } from 'react';
import SeoIndex from '@/components/seoIndex';
import Layout from '@/components/Layout/Layout';
import AdminLayout from '@/components/Layout/AdminLayout';
import SideBarLayout from '@/components/Layout/SideBarLayout';
import { wrapper } from '@/module/store';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useWeb3 } from '@/hooks/useWeb3';

const queryClient = new QueryClient();

const App = ({ Component, pageProps, router }: AppProps) => {
    const [isLightTheme, setIsLightTheme] = useState<boolean>(false);
    const web3 = useWeb3();

    useEffect(() => {
        if (!web3.account) {
            web3.logIn();
            return;
        }

        if (router.pathname === '/admin' && web3.account !== '0x68776746d0d9f615b3ed0dfa970c73c45458a4a3') {
            router.push('/');
        }
    }, [router.pathname, web3.account]);

    let LayoutComponent;

    switch (router.pathname) {
        case '/':
        case '/staking':
        case '/staking/batchStake':
        case '/staking/claimableItem':
            LayoutComponent = SideBarLayout;
            break;
        case '/admin':
            LayoutComponent = AdminLayout;
            break;
        default:
            LayoutComponent = Layout;
            break;
    }
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={isLightTheme ? lightTheme : darkTheme}>
                <SeoIndex title="Epsilon Studio" />
                <WinStyle />
                <LayoutComponent web3={web3} account={web3.account} modalText={''}>
                    <Component {...pageProps} setTheme={setIsLightTheme} web3={web3} account={web3.account} />
                </LayoutComponent>
                <ReactQueryDevtools initialIsOpen={false} />
            </ThemeProvider>
        </QueryClientProvider>
    );
};

export default wrapper.withRedux(App);
