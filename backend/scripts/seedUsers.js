const prisma = require('../database/prisma');
const { hashPassword } = require('../services/authService');

require('@dotenvx/dotenvx').config();

const usersToSeed = [
    {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        fullName: 'Admin',
        role: 'admin',
        mustChangePassword: true,
    },
    {
        email: process.env.DEV_EMAIL,
        password: process.env.DEV_PASSWORD,
        fullName: 'Developer',
        role: 'developer',
        mustChangePassword: false,
    },
];

async function seedUsers() {
    for (const user of usersToSeed) {
        const existingUser = await prisma.users.findUnique({
            where: { email: user.email.toLowerCase() },
        });

        if (existingUser) {
            console.log(`User already exists: ${user.email}`);
            continue;
        }

        const passwordHash = await hashPassword(user.password);

        await prisma.users.create({
            data: {
                email: user.email.toLowerCase(),
                full_name: user.fullName,
                password_hash: passwordHash,
                role: user.role,
                must_change_password: user.mustChangePassword,
            },
        });

        console.log(`Created ${user.role} user: ${user.email}`);
    }
}

seedUsers()
    .catch((error) => {
        console.error('Failed to seed users:', error.message);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
});