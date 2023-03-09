import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		const comments = await client.comment.findMany({});
		return res.json({
			success: true,
			comments,
		});
	}

	if (req.method === "POST") {
		const {
			session: { user },
			body: { content },
		} = req;

		const comment = client.comment.create({
			data: {
				user: {
					connect: {
						id: user?.id,
					},
				},
				content,
			},
		});

		res.json({
			success: true,
			comment,
		});
	}
}

export default withApiSession(
	withHandler({
		methods: ["GET", "POST"],
		handler: handler,
		isPrivate: false,
	})
);
