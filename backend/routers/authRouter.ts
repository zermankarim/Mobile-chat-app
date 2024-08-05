import { router } from "../router";

const controller = require("../controllers/auth");
const { check } = require("express-validator");

router.post(
	"/createUserWithEmailPassAndNames",
	[
		check("firstName", "First name must be filled in.").notEmpty(),
		check("lastName", "Last name must be filled in.").notEmpty(),
		check("email", "Email is incorrect.").isEmail(),
		check("password", "Password more than 6 symbols.").isLength({
			min: 6,
		}),
	],
	controller.registration
);
router.post(
	"/signInWithEmailAndPassword",
	[
		check("email", "Email is incorrect.").isEmail(),
		check("password", "Password more than 6 symbols").isLength({
			min: 6,
		}),
	],
	controller.login
);

router.post("/verifyJWTToken", controller.verifyJWTToken);

module.exports = router;
