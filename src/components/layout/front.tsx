interface FrontLayoutProps {
    children: React.ReactNode
}

export default function FrontLayout({children}: FrontLayoutProps) {
    return (
      <>
        <main>{children}</main>
      </>
    )
}