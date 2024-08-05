import { Request, Response } from "express";
import {
	IUser,
	IUserBeforeSignUp,
	AuthSuccessRes,
	VerifyTokenRes,
} from "../types";
import { getRandomColor } from "../functions";
import JWT from "jsonwebtoken";

const { User } = require("../models");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
require("dotenv").config();

const { JWT_SECRET_KEY } = process.env;

const registration = async (req: Request, res: Response) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const errorArray = errors.array();
			const errorsString = errorArray.map((err) => err.msg).join("\n");
			return res.json({
				success: false,
				message: "Error during validation fields: " + errorsString,
			});
		}

		const { firstName, lastName, email, password } = req.body;

		const candidate = await User.findOne({ email });

		if (candidate) {
			return res.json({
				success: false,
				message: "User with this email already signed up.",
			});
		}
		const hashPassword = bcrypt.hashSync(password, 7);

		const userDataBeforeSignUp: IUserBeforeSignUp = {
			firstName,
			lastName,
			email,
			password: hashPassword,
			avatars: [],
			dateOfBirth: "",
			friends: [],
			backgroundColors: [getRandomColor(), getRandomColor()],
		};
		const user = new User(userDataBeforeSignUp);
		await user.save();

		const token = JWT.sign({ _id: user._id.toString() }, JWT_SECRET_KEY, {
			expiresIn: "24h",
		});

		const userFromDB: IUser = await User.findOne({ email }, { password: 0 });

		const successResponse: AuthSuccessRes = {
			success: true,
			data: userFromDB,
			token,
		};

		return res.json(successResponse);
	} catch (e: any) {
		console.error("Error during signing up: ", e.message);
		return res.json({
			success: false,
			message: "Catched error during signing up, please, try again.",
		});
	}
};
const login = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const errorArray = errors.array();
		const errorsString = errorArray.map((err) => err.msg).join("\n");
		return res.json({
			success: false,
			message: "Error during validation fields: " + errorsString,
		});
	}

	const { email, password } = req.body;

	const user: IUser = await User.findOne({ email });
	if (!user) {
		return res.json({
			success: false,
			message: "User with this email wasn't found",
		});
	}

	const validPassword = bcrypt.compareSync(password, user.password);
	if (!validPassword) {
		return res.json({ success: false, message: "Password is incorrect." });
	}

	const token = JWT.sign({ _id: user._id.toString() }, JWT_SECRET_KEY, {
		expiresIn: "24h",
	});

	const userWithoutPass: IUser = {
		_id: user._id,
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
		dateOfBirth: user.dateOfBirth,
		friends: user.friends,
		backgroundColors: user.backgroundColors,
		avatars: user.avatars,
	};

	const successResponse: AuthSuccessRes = {
		success: true,
		data: userWithoutPass,
		token,
	};
	return res.json(successResponse);
};

const verifyJWTToken = async (req: Request, res: Response) => {
	try {
		const { token } = req.body;
		const decoded = JWT.verify(token, JWT_SECRET_KEY);
		if (!decoded) {
			const unsuccessfulResponse: VerifyTokenRes = {
				success: true,
				verifyed: false,
			};
			return res.json(unsuccessfulResponse);
		}
		const successfulResponse: VerifyTokenRes = {
			success: true,
			verifyed: true,
		};
		return res.json(successfulResponse);
	} catch (e) {
		console.error(`verifyJWTToken: Error during verifying token: ${e.message}`);
		const unsuccessfulResponse: VerifyTokenRes = {
			success: false,
			verifyed: false,
		};
		return res.json(unsuccessfulResponse);
	}
};

module.exports = { registration, login, verifyJWTToken };
