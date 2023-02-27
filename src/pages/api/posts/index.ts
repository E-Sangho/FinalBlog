import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const {
		session: { user },
		body: { title, category, tags, draft, uploadImage, contents },
	} = req;

	if (req.method === "GET") {
		const posts = await client.post.findMany({});
		return res.json({
			success: true,
			posts,
		});
		return res.json({
			success: true,
			posts,
		});
	}

	if (req.method === "POST") {
		const post = await client.post.create({
			data: {
				title,
				category,
				draft,
				titleImage: uploadImage ? uploadImage : "",
				contents,
				author: {
					connect: {
						id: user?.id,
					},
				},
			},
		});
		if (!post) {
			res.json({
				success: false,
			});
		}
		res.json({
			success: true,
			post,
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
