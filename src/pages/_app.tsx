import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import AdminLayout from '@/components/layout/admin';
import FrontLayout from '@/components/layout/front';

export default function App({ Component, pageProps, router }: AppProps) {
  const getLayout =
      router.pathname.includes('/admin') ? ((page: any) => <AdminLayout children={page} />)
      : ((page: any) => <FrontLayout children={page} />);

  return (
      <>
          {getLayout(<Component {...pageProps} />)}
      </>
  );
}
