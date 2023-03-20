import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		const comments = await client.comment.findMany({
			include: {
				author: true,
			},
		});
		return res.json({
			success: true,
			comments,
		});
	}

	if (req.method === "DELETE") {
		const comment = await client.comment.delete({
			where: {
				id: req.body,
			},
		});

		return res.json({
			isAPISuccessful: true,
		});
	}

	if (req.method === "PUT") {
		const { id, content } = req.body;
		const comment = await client.comment.update({
			where: {
				id,
			},
			data: {
				content,
			},
		});

		return res.json({
			isAPISuccessful: true,
			comment,
		});
	}
}

export default withApiSession(
	withHandler({
		methods: ["GET", "DELETE", "PUT"],
		handler: handler,
		isPrivate: false,
	})
);
