import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withSession";
import withHandler from "@/libs/server/withHandler";
import { hashPassword } from "@/libs/server/bcrypt";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		const profile = await client.user.findUnique({
			where: { id: req.session.user?.id },
			select: {
				username: true,
				email: true,
				avatar: true,
				id: true,
			},
		});
		if (profile) {
			res.json({
				isAPISuccessful: true,
				profile,
			});
		} else {
			res.json({
				isAPISuccessful: false,
				error: "You are not loged in.",
			});
		}
	}

	if (req.method === "POST") {
		const {
			session: { user },
			body: { username, email, avatar },
		} = req;
		console.log("here???");
		console.log(avatar);
		// // check password
		// if (password !== checkPassword) {
		// 	return res.status(400).json({ error: "Passwords are different." });
		// }
		// // check whether conditions on register page are met.
		// if (
		// 	password.length < 14 ||
		// 	checkPassword.length < 14 ||
		// 	username.length < 4 ||
		// 	username.length > 16 ||
		// 	(email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i))
		// ) {
		// 	return res.status(400).json({
		// 		error:
		// 			"Your registraion information doesn't satisfy recommended condition",
		// 	});
		// }

		// check username exists or not
		const usernameExists = await client.user.findUnique({
			where: {
				username,
			},
		});

		if (usernameExists && usernameExists.id !== user?.id) {
			return res
				.status(400)
				.json({ error: "The username you selected already exists." });
		}

		// // encrypt password using bcrypt
		// const hash = hashPassword({ password });
		// if (!hash) {
		// 	return res.status(400).json({
		// 		error: "Something wrong when encrypt password. Plesse try again",
		// 	});
		// }

		await client.user.update({
			where: {
				id: user?.id,
			},
			data: {
				username,
				email,
				avatar,
			},
		});

		res.json({ isAPISuccessful: true });
	}
}

export default withApiSession(
	withHandler({
		methods: ["GET", "POST"],
		handler,
	})
);
