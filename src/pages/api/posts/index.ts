import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		const {
			session: { user },
			body: { title, category, tags, draft, titleImage, contents },
		} = req;

		const posts = await client.post.findMany({});
		return res.json({
			success: true,
			posts,
		});
	}

	if (req.method === "POST") {
		const {
			session: { user },
			body: { title, category, tags, draft, titleImage, contents },
		} = req;

		const tag = tags
			.split(",")
			.map((e: string) => e.trim())
			.map((e: string) => {
				let tag = {
					tag: e,
				};
				return tag;
			});

		const post = await client.post.create({
			data: {
				title: title.replace(" ", "_"),
				category: {
					create: [{ category }],
				},
				draft,
				tags: {
					create: tag,
				},
				titleImage: titleImage ? titleImage : "",
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
