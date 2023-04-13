import prisma from "@/lib/prisma";
import {
    Alert,
    Button,
    Checkbox,
    Label,
    Modal,
    TextInput,
} from "flowbite-react";
import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
} from "next";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { GiGlassBall, GiPostStamp } from "react-icons/gi";
import { MdEditSquare } from "react-icons/md";
import { HiInformationCircle } from "react-icons/hi";
import Image from "next/image";
import Head from "next/head";

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: "/signin",
                permanent: false,
            },
        };
    }

    if (session.user.userType !== "admin") {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    // Get customer data from database
    const customer = await prisma.user.findMany({
        where: {
            userType: "customer",
        },
        select: {
            id: true,
            name: true,
            email: true,
            username: true,
            active: true,
            userType: true,
            image: true,
        },
    });

    return {
        props: {
            session,
            customer,
        },
    };
}

export default function Customer({
    session,
    customer,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [modalData, setModalData] = useState({} as any);
    const [modalEditData, setModalEditData] = useState({} as any);
    const [customerData, setCustomerData] = useState(customer);
    const [showAlert, setShowAlert] = useState(false)
    const [alertData, setAlertData] = useState({
        title: 'Alert!',
        message: 'Something went wrong!',
    })
    const [image, setImage] = useState('');
    const [createObjectURL, setCreateObjectURL] = useState('');

    const uploadToClient = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0];
        
            setImage(i);
            setCreateObjectURL(URL.createObjectURL(i));
        }
    };

    const getData = async () => {
        // Get customer data from api
        const res = await fetch("/api/customer");
        const response = await res.json();

        if (response.status == "success") {
            setCustomerData(response.data);
        }
    };

    const approveCustomer = async (id: string) => {
        const res = await fetch("/api/customer/approve", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: id,
            }),
        });
        if (res.status == 200) {
            getData();
        }
    };

    const showEdit = async (id: string) => {
        setShowAlert(false);
        const res = await fetch("/api/customer?id=" + id);
        if (res.status != 200) return;
        const response = await res.json();

        if (response.status == "success" && response.data) {
            setModalEditData(response.data);
            setShowModalEdit(true);
        }
    }

    const showDetail = async (id: string) => {
        const res = await fetch("/api/customer?id=" + id);
        if (res.status != 200) return;
        const response = await res.json();

        if (response.status == "success" && response.data) {
            setModalData(response.data);
            setShowModal(true);
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
        body.append("customerId", event.target.customerId.value);
        body.append("status", event.target.status.checked);
        
        if(password && (password !== confirm)) {
            setShowAlert(true)
            setAlertData({
                title: 'Alert!',
                message: 'Passwords do not match!',
            })
            return
        }

        const endpoint = '/api/customer/update'
        const options = {
            method: 'POST',
            body,
        }

        const response = await fetch(endpoint, options)
        const result = await response.json()
        
        if(result.status === 'success') {
            setShowModalEdit(false)
        } else {
            setShowAlert(true)
            setAlertData({
                title: 'Error!',
                message: result.statusText,
            })
        }

        getData();
    }

    useEffect(() => {
        console.log(customerData);
    }, [customerData]);

    return (
        <>
            <Head>
                <title>Customer - Dashboard</title>
            </Head>
            <div className="p-4">
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Username
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {customerData.map((customer) => (
                                    <tr
                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                        key={customer.id}
                                    >
                                        <th
                                            scope="row"
                                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                        >
                                            {customer.name}
                                        </th>
                                        <td className="px-6 py-4">
                                            {customer.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            {customer.username}
                                        </td>
                                        <td className="px-6 py-4">
                                            {customer.active
                                                ? "Active"
                                                : "Not Active"}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button.Group>
                                                <Button
                                                    color="gray"
                                                    onClick={() =>
                                                        showDetail(customer.id)
                                                    }
                                                >
                                                    <GiGlassBall className="mr-3 h-4 w-4" />
                                                    Details
                                                </Button>
                                                <Button color="gray" onClick={() => showEdit(customer.id)}>
                                                    <MdEditSquare className="mr-3 h-4 w-4" />
                                                    Edit
                                                </Button>
                                                {!customer.active ? (
                                                    <Button
                                                        color="gray"
                                                        onClick={() =>
                                                            approveCustomer(
                                                                customer.id
                                                            )
                                                        }
                                                    >
                                                        <GiPostStamp className="mr-3 h-4 w-4" />
                                                        Approve
                                                    </Button>
                                                ) : (
                                                    <></>
                                                )}
                                            </Button.Group>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <Modal.Header>Customer Detail</Modal.Header>
                <Modal.Body>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email2" value="Email" />
                        </div>
                        <TextInput
                            id="email2"
                            placeholder="name@company.com"
                            required={true}
                            value={modalData.email ?? ''}
                            disabled={true}
                            readOnly={true}
                        />
                    </div>
                    <div className="mt-5">
                        <div className="mb-2 block">
                            <Label htmlFor="name2" value="Name" />
                        </div>
                        <TextInput
                            id="name2"
                            placeholder="name@company.com"
                            required={true}
                            value={modalData.name ?? ''}
                            disabled={true}
                            readOnly={true}
                        />
                    </div>
                    <div className="mt-5">
                        <div className="mb-2 block">
                            <Label htmlFor="username2" value="Username" />
                        </div>
                        <TextInput
                            id="username2"
                            placeholder="name@company.com"
                            required={true}
                            value={modalData.username ?? ''}
                            disabled={true}
                            readOnly={true}
                        />
                    </div>
                    <div className="mt-5">
                        <div className="mb-2 block">
                            <Label htmlFor="Image2" value="Selfie Image" />
                        </div>
                        {modalData.image && (
                            <Image
                                width="200"
                                height="200"
                                className="w-auto h-52 max-w-xl rounded-lg shadow-xl dark:shadow-gray-800"
                                src={`/userfiles/avatar/${modalData.image}`}
                                alt="image description"
                            />
                        )}
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={showModalEdit} popup={true} onClose={() => setShowModalEdit(false)}>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6 px-6 pb-4">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                            Edit Customer
                        </h3>
                        <form onSubmit={handleSubmit}>
                        <input name="customerId" type="hidden" defaultValue={modalEditData.id} />
                        {(showAlert && <Alert
                            color="failure"
                            icon={HiInformationCircle}
                            onDismiss={function onDismiss(){setShowAlert(false)}}
                        >
                            <span>
                                <span className="font-medium">
                                {alertData.title}
                                </span>
                                {' '}{alertData.message ?? ''}
                            </span>
                        </Alert>)}
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="email" value="Email" />
                            </div>
                            <TextInput
                                id="email"
                                name="email"
                                placeholder="name@company.com"
                                required={true}
                                defaultValue={modalEditData.email ?? ''}
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="name" value="Name" />
                            </div>
                            <TextInput
                                id="name"
                                name="name"
                                placeholder="Tony Stark"
                                required={true}
                                defaultValue={modalEditData.name ?? ''}
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="username" value="Username" />
                            </div>
                            <TextInput
                                name="username"
                                id="username"
                                placeholder="Tony Stark"
                                required={true}
                                defaultValue={modalEditData.username ?? ''}
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="status" value="Status" />
                            </div>
                            <Checkbox id="status" name="status" defaultChecked={modalEditData.active} onChange={console.log}/>
                            <Label htmlFor="status">
                               {' '} Active
                            </Label>
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="password"
                                    value="Password"
                                />
                            </div>
                            <TextInput
                                id="password"
                                name="password"
                                type="password"
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="confirm"
                                    value="Confirm Password"
                                />
                            </div>
                            <TextInput
                                id="confirm"
                                name="confirm"
                                type="password"
                            />
                        </div>
                        <div className="mt-5">
                            <div className="mb-2 block">
                                <Label htmlFor="Image" value="Selfie Image" />
                            </div>
                            <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="user_avatar_help" 
                                id="user_avatar" 
                                type="file"
                                accept="image/*"
                                name="user_avatar"
                                onChange={uploadToClient}
                            />
                            {(createObjectURL && <img className="w-auto h-52 max-w-xl rounded-lg shadow-xl dark:shadow-gray-800" src={createObjectURL} alt="image description"/>)}
                            {modalEditData.image && !createObjectURL ? (
                                <Image
                                    width="200"
                                    height="200"
                                    className="mt-4 w-auto h-52 max-w-xl rounded-lg shadow-xl dark:shadow-gray-800"
                                    src={`/userfiles/avatar/${modalEditData.image}`}
                                    alt="image description"
                                />) : (<></>)}
                        </div>
                        <div className="w-full mt-4">
                            <Button type="submit">Save</Button>
                        </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}