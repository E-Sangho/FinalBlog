import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { LoginData } from "@/pages/login";
import { withApiSession } from "@/libs/server/withSession";
import { comparePassword, hashPassword } from "@/libs/server/bcrypt";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { id, password }: LoginData = req.body;

	const user = await client.user.findFirst({
		where: {
			identifier: id,
		},
	});

	if (!user) {
		return res.status(400).json({
			error: "User information is missing. Please check your ID and password.",
		});
	}

	const hash = user?.password;

	if (!comparePassword({ password, hash })) {
		return res.status(400).json({
			error: "Please check your id and password again",
		});
	}

	req.session.user = {
		id: +user.identifier,
	};
	await req.session.save();
	return res.status(200).json({ isLogin: true });
}

export default withApiSession(
	withHandler({
		methods: ["POST"],
		handler: handler,
		isPrivate: false,
	})
);
