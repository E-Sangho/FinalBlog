import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { LoginData } from "@/pages/login";
import { withApiSession } from "@/libs/server/withSession";
import { comparePassword, hashPassword } from "@/libs/server/bcrypt";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const {
		session: { user },
	} = req;

	if (!user) {
		return res.status(400).json({ isAPISuccessful: false, isLogin: false });
	}
	await req.session.destroy();
	return res.status(200).json({ isLogin: false });
}

export default withApiSession(
	withHandler({
		methods: ["POST"],
		handler: handler,
	})
);
