/* eslint-disable @typescript-eslint/no-var-requires */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

function generatePasswordHash(plainTextPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(plainTextPassword, 10, function (err, hash) {
            if (err) {
                return reject(err);
            }
            return resolve(hash);
        });
    });
}

async function main() {
    // User Admin
    // Generate password hash
    const password = await generatePasswordHash('admin');
    const userAdmin = await prisma.user.create({
        data: {
            username: 'admin',
            password: password,
            name: 'Admin',
            email: 'admin@admin.com',
            userType: "admin",
            active: true,
            image: "avatar.png",
        }
    });
    userAdmin.plaintextpassword = 'admin';
    console.log(userAdmin);

    // Users Customer
    // Generate password hash
    const passwordGuest = await generatePasswordHash('shopper');
    const userGuest = await prisma.user.create({
        data: {
            username: 'shopper',
            password: passwordGuest,
            name: 'Shooper',
            email: 'shooper@shopper.com',
            userType: "customer",
            active: true,
            image: "avatar.png",
        }
    });
    userGuest.plaintextpassword = 'shopper';
    console.log(userGuest);

    await prisma.product.createMany({
        data: [
            {
                name: 'Product 1',
                description: 'Product 1 description',
                price: 100000,
                stock: 10,
                image: 'prod-1.jpg',
                active: true,
            },
            {
                name: 'Product 2',
                description: 'Product21 description',
                price: 120000,
                stock: 50,
                image: 'prod-2.jpg',
                active: true,
            },
            {
                name: 'Product 3',
                description: 'Product 3 description',
                price: 300000,
                stock: 10,
                image: 'prod-3.jpg',
                active: false,
            },
            {
                name: 'Product 4',
                description: 'Product 4 description',
                price: 400000,
                stock: 0,
                image: 'prod-4.jpg',
                active: true,
            },
            {
                name: 'Product 5',
                description: 'Product 5 description',
                price: 100000,
                stock: 10,
                image: 'prod-5.jpg',
                active: true,
            },
        ]
    });

    await prisma.banner.createMany({
        data: [
            {
                name: 'Banner 1',
                description: 'Banner 1 description',
                image: 'banner-1.jpg',
                active: true,
            },
            {
                name: 'Banner 2',
                description: 'Banner 2 description',
                image: 'banner-2.jpg',
                active: true,
            },
            {
                name: 'Banner 3',
                description: 'Banner 3 description',
                image: 'banner-3.jpg',
                active: true,
            },
            {
                name: 'Banner 4',
                description: 'Banner 4 description',
                image: 'banner-4.jpg',
                active: true,
            },
        ]
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });