import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import AdminLayout from '@/components/layout/admin';
import FrontLayout from '@/components/layout/front';
import { SessionProvider } from 'next-auth/react';

export default function App({ Component, pageProps, router }: AppProps) {
  const getLayout =
      router.pathname.includes('/admin') ? ((page: any) => <AdminLayout children={page} />)
      : ((page: any) => <FrontLayout children={page} />);

  return (
      <>
        <SessionProvider session={pageProps.session}>
          {getLayout(<Component {...pageProps} />)}
        </SessionProvider>
      </>
  );
}
