import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withSession";
import { hashPassword } from "@/libs/server/bcrypt";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { identifier, password, checkPassword, username, email } = req.body;
	if (password !== checkPassword) {
		return res.status(400).json({ error: "Passwords are different." });
	}
	// check whether conditions on register page are met.
	if (
		identifier.length < 6 ||
		identifier.length > 12 ||
		password.length < 14 ||
		checkPassword.length < 14 ||
		username.length < 4 ||
		username.length > 16 ||
		(email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i))
	) {
		return res.status(400).json({
			error:
				"Your registraion information doesn't satisfy recommended condition",
		});
	}
	// check identifier exists or not
	const identifierExists = await client.user.findUnique({
		where: {
			identifier,
		},
	});

	if (identifierExists) {
		return res.status(400).json({ error: "The id already exists." });
	}

	// check username exists or not
	const usernameExists = await client.user.findUnique({
		where: {
			username,
		},
	});

	if (usernameExists) {
		return res
			.status(400)
			.json({ error: "The username you selected already exists." });
	}

	// encrypt password using bcrypt
	const hash = hashPassword({ password });
	if (!hash) {
		return res.status(400).json({
			error: "Something wrong when encrypt password. Plesse try again",
		});
	}

	// If there is no user who is using identifier and username,
	// server allows user to create new User on database.

	await client.user.create({
		data: {
			identifier,
			password: hash,
			username,
			email,
		},
	});
	res.status(200).json({
		isAPISuccessful: true,
	});
}

// export default withIronSessionApiRoute(withHandler("POST", handler), {
// 	cookieName: "aaaaa",
// 	password: "asjkdfjsakldfjklasdfjlasjdflasdfjksadjflkajskdlfsasadkfj",
// });
export default withApiSession(
	withHandler({
		methods: ["POST"],
		handler: handler,
		isPrivate: false,
	})
);
