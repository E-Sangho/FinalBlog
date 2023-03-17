import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const {
		query: { title },
		session: { user },
	} = req;
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
				category: true,
				tags: true,
			},
		});

		const isLiked = Boolean(
			await client.favorite.findFirst({
				where: {
					postId: post?.id,
					userId: user?.id,
				},
			})
		);

		res.json({
			success: true,
			post,
			isLiked,
		});
	}
}

export default withApiSession(
	withHandler({
		methods: ["GET"],
		handler: handler,
		isPrivate: false,
	})
);
