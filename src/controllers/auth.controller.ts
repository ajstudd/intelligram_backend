import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { RegisterUserPayload, LoginPayload, VerifyOtpPayload } from '../types';
import userService from '../services/user.service';

const login = async (
    req: Request<object, object, LoginPayload>,
    res: Response
) => {
    const { email = null, password = null, phone = null } = req.body;

    if (email && password) {
        const token = await authService.loginWithPassword(email, password);

        return res.status(200).json({
            message: 'Login successful!',
            token,
        });
    }
    return res.status(200).json({
        message: [
            `Otp has been sent to your`,
            email ? 'email.' : '',
            phone ? 'phone number.' : '',
        ].join(' '),
    });
};

const register = async (
    req: Request<object, object, RegisterUserPayload>,
    res: Response
) => {
    const { email = undefined, name, password, phone = undefined } = req.body;
    await userService.createUser({
        email,
        phone,
        name,
        password,
    });
    return res.status(200).json({
        message: `Registration successful!`,
    });
};

const me = async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.user!.id);
    return res.status(200).json({
        user,
    });
};

export default {
    login,
    register,
    me,
};
