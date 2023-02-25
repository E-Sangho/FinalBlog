import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withSession";
import withHandler from "@/libs/server/withHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const profile = await client.user.findUnique({
		where: { id: req.session.user?.id },
	});
	res.json({
		ok: true,
		profile,
	});
}

export default withApiSession(
	withHandler({
		methods: ["GET"],
		handler,
	})
);
