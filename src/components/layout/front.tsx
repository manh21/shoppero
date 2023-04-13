import Header from "../header2"
import Footers from "../footer";

interface FrontLayoutProps {
    children: React.ReactNode
}

export default function FrontLayout({children}: FrontLayoutProps) {
    return (
      <div className="container mx-auto">
          <Header/>
          <main>{children}</main>
          <Footers></Footers>
      </div>
    )
}