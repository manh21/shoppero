import { Alert } from "flowbite-react";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getSession, getCsrfToken } from 'next-auth/react';
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiInformationCircle } from "react-icons/hi";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const session = await getSession({ req: ctx.req });

    if (session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    return {
        props: {
            session: session,
            csrfToken: await getCsrfToken(ctx),
        }
    }
};

export default function Signup({csrfToken}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [showAlert, setShowAlert] = useState(false)
    const [alertData, setAlertData] = useState({
        title: 'Alert!',
        message: 'Something went wrong!',
    })
    const [image, setImage] = useState('');
    const [createObjectURL, setCreateObjectURL] = useState('');

    useEffect(() => {
    }, []);

    const uploadToClient = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0];
        
            setImage(i);
            setCreateObjectURL(URL.createObjectURL(i));
        }
    };
    
    // Handle form submission.
    const handleSubmit = async (event: any) => {
        // Stop the form from submitting and refreshing the page.
        event.preventDefault();

        const body = new FormData();
        const password = event.target.password.value;
        const confirm = event.target.confirm.value;

        body.append("file", image);
        body.append("username", event.target.username.value);
        body.append("password", event.target.password.value);
        body.append("confirm", event.target.confirm.value);
        body.append("email", event.target.email.value);
        body.append("name", event.target.name.value);
        body.append("csrfToken", event.target.csrfToken.value);

        if(password !== confirm) {
            setShowAlert(true)
            setAlertData({
                title: 'Alert!',
                message: 'Passwords do not match!',
            })
            return
        }

        const endpoint = '/api/auth/signup'
        const options = {
            method: 'POST',
            body,
        }

        const response = await fetch(endpoint, options)
        const result = await response.json()
        
        if(result.status === 'success') {
            window.location.href = '/signin'
        } else {
            setShowAlert(true)
            setAlertData({
                title: 'Error!',
                message: result.statusText,
            })
        }
    }

    return (
        <>
        <Head>
            <title>Shopper - SignUp</title>
        </Head>
        <section className="bg-gray-50 dark:bg-gray-900 p-20">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Create an account
                        </h1>
                        {(showAlert && <Alert
                            color="failure"
                            icon={HiInformationCircle}
                            onDismiss={function onDismiss(){setShowAlert(false)}}
                        >
                            <span>
                                <span className="font-medium">
                                {alertData.title}
                                </span>
                                {' '}{alertData.message}
                            </span>
                        </Alert>)}
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
                            </div>
                            <div>
                                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                                <input type="username" name="username" id="username" placeholder="shooper" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </div>
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                <input type="name" name="name" id="name" placeholder="Tony Stark" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </div>
                            <div>
                                <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                                <input type="password" name="confirm" id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                            </div>
                            <div>
                                
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="user_avatar">Upload selfie</label>
                                <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="user_avatar_help" 
                                    id="user_avatar" 
                                    type="file"
                                    accept="image/*"
                                    name="user_avatar"
                                    onChange={uploadToClient}
                                />
                                {(createObjectURL && <img className="w-auto h-52 max-w-xl rounded-lg shadow-xl dark:shadow-gray-800" src={createObjectURL} alt="image description"/>)}
                                <div className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="user_avatar_help">A profile picture is useful to confirm your are logged into your account</div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                                </div>
                            </div>
                            <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create an account</button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Already have an account? <Link href="/api/auth/signin" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
        </>
    )
}
