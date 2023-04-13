import Product from "@/components/product";
import { Carousel } from "flowbite-react";
import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
} from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const session = await getSession({ req: ctx.req });

    return {
        props: {
            session: session,
        },
    };
};

export default function Home({
    session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <div>
            <Head>
                <title>Shopper</title>
            </Head>

            <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
                <Carousel>
                    <img
                        src="https://flowbite.com/docs/images/carousel/carousel-1.svg"
                        alt="..."
                    />
                    <img
                        src="https://flowbite.com/docs/images/carousel/carousel-2.svg"
                        alt="..."
                    />
                    <img
                        src="https://flowbite.com/docs/images/carousel/carousel-3.svg"
                        alt="..."
                    />
                    <img
                        src="https://flowbite.com/docs/images/carousel/carousel-4.svg"
                        alt="..."
                    />
                    <img
                        src="https://flowbite.com/docs/images/carousel/carousel-5.svg"
                        alt="..."
                    />
                </Carousel>
            </div>

            <div className="m-10">
                <h2 className="text-4xl font-extrabold dark:text-white mb-10">
                    Featured Product
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Product
                        id={1}
                        name="Product 1"
                        image="prod-1.jpg"
                        price={200}
                    />
                    <Product
                        id={1}
                        name="Product 1"
                        image="prod-2.jpg"
                        price={200}
                    />
                    <Product
                        id={1}
                        name="Product 1"
                        image="prod-3.jpg"
                        price={200}
                    />
                    <Product
                        id={1}
                        name="Product 1"
                        image="prod-4.jpg"
                        price={200}
                    />
                    <Product
                        id={1}
                        name="Product 1"
                        image="prod-5.jpg"
                        price={200}
                    />
                </div>
            </div>
        </div>
    );
}
