import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withSession";
import { withIronSessionApiRoute } from "iron-session/next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { identifier, password, checkPassword, username, email } = req.body;
	if (password !== checkPassword) {
		return res.status(400).json({ error: "Passwords are different." });
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

	// If there is no user who is using identifier and username,
	// server allows user to create new User on database.

	const user = await client.user.create({
		data: {
			identifier,
			password,
			username,
			email,
		},
	});
	console.log(user);
	res.status(200).end();
}

// export default withIronSessionApiRoute(withHandler("POST", handler), {
// 	cookieName: "aaaaa",
// 	password: "asjkdfjsakldfjklasdfjlasjdflasdfjksadjflkajskdlfsasadkfj",
// });
export default withApiSession(withHandler("POST", handler));
