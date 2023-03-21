import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
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
					categories: true,
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

	if (req.method === "PUT") {
		const {
			query: { title },
			session: { user },
			body: { content },
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
					categories: true,
					tags: true,
				},
			});

			if (!user || post?.authorId !== user.id) {
				return res.json({
					isAPISuccessful: false,
				});
			}
			const updatePost = await client.post.update({
				where: {
					id: post.id,
				},
				data: {
					content: content,
				},
			});

			if (!updatePost) {
				return res.json({
					isAPISuccessful: false,
				});
			}

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
}

export default withApiSession(
	withHandler({
		methods: ["GET", "PUT"],
		handler: handler,
		isPrivate: false,
	})
);
