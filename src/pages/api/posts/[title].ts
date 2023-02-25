import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { title } = req.query;
	if (typeof title === "string") {
		const post = await client.post.findUnique({
			where: {
				title,
			},
			include: {
				author: {
					select: {
						username: true,
						avatar: true,
					},
				},
			},
		});
		res.json({
			success: true,
			post,
		});
	}
}

export default withHandler({
	methods: ["GET"],
	handler: handler,
	isPrivate: false,
});
