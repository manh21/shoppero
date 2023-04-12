import Header from "../header"

interface FrontLayoutProps {
    children: React.ReactNode
}

export default function FrontLayout({children}: FrontLayoutProps) {
    return (
      <>
        <Header />
        <main>{children}</main>
      </>
    )
}