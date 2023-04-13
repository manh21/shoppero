import { useRouter } from "next/router";
import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";


export default function Header() {
    const router = useRouter();
    const isActive: (pathname: string) => boolean = (pathname) =>
        router.pathname === pathname;

    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "loading") {
            return;
        }
    }, [session, status]);

    return session ? (
        <>
            <Navbar fluid={true} rounded={true}>
                <Navbar.Brand href="/">
                    <span className="self-center whitespace-nowrap text-xl font-semibold text-black dark:text-white">
                        Shopper
                    </span>
                </Navbar.Brand>
                <div className="flex md:order-2">
                    <Dropdown
                        arrowIcon={false}
                        inline={true}
                        label={
                            <Image
                                alt="User settings"
                                src={`/userfiles/avatar/${session.user?.image}`}
                                width={40}
                                height={40}
                                className="!rounded-full rounded w-10 h-10 rounded"
                            />
                        }
                    >
                        <Dropdown.Header>
                            <span className="block text-sm">{session.user.name}</span>
                            <span className="block truncate text-sm font-medium">
                                {session.user.email}
                            </span>
                        </Dropdown.Header>
                        {( session.user.userType == 'admin' && <Dropdown.Item onClick={() => window.location.href = '/admin'}>Dashboard</Dropdown.Item>)}
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={() => signOut()}>Sign out</Dropdown.Item>
                    </Dropdown>
                    <Navbar.Toggle />
                </div>
                <Navbar.Collapse>
                    <Navbar.Link href="/" active={isActive("/")}>
                        Home
                    </Navbar.Link>
                    {( session.user.userType == 'admin' && <Navbar.Link href="/admin">Dashboard</Navbar.Link>)}
                    <Navbar.Link href="/product">Product</Navbar.Link>
                </Navbar.Collapse>
            </Navbar>
        </>
    ) : (
        <>
            <Navbar fluid={true} rounded={true}>
                <Navbar.Brand href="/">
                    <span className="self-center whitespace-nowrap text-xl font-semibold text-black dark:text-white">
                        Shopper
                    </span>
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Navbar.Link href="/" active={isActive("/")}>
                        Home
                    </Navbar.Link>
                    <Navbar.Link href="/product" active={isActive("/product")}>Product</Navbar.Link>
                </Navbar.Collapse>
                <Button href="/signin">Sign In</Button>
            </Navbar>
        </>
    );
}
