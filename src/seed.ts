import userService from './services/user.service';

export const seedAdminUser = async () => {
    try {
        const user = await userService.getUserByEmail('admin@hyathi.com');
        if (user) {
            await userService.deleteUserById(user.id);
            throw new Error('Admin user already exists!');
        }
    } catch (err) {
        if (!process.env.TEST_ADMIN_EMAIL || !process.env.TEST_ADMIN_PASSWORD) {
            return;
        }
        await userService.createUser({
            email: process.env.TEST_ADMIN_EMAIL,
            name: 'Admin',
            password: process.env.TEST_ADMIN_PASSWORD,
            role: 'ADMIN',
        });

        console.log('Admin user seeded!');
        console.log(
            [
                `Email: ${process.env.TEST_ADMIN_EMAIL}`,
                `Password: ${process.env.TEST_ADMIN_PASSWORD}`,
            ].join('\n')
        );
    }
};
