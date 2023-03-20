import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		const {
			query: { title },
		} = req;
		if (typeof title !== "string") {
			return res.json({
				isAPISuccessful: false,
			});
		}

		const post = await client.post.findUnique({
			where: { title: title },
			include: {
				comments: {
					include: {
						author: true,
					},
				},
			},
		});

		const comments = post?.comments;

		if (!comments) {
			return res.json({
				isAPISuccessful: false,
			});
		}

		return res.json({
			isAPISuccessful: true,
			comments,
		});
	}

	if (req.method === "POST") {
		const {
			session: { user },
			query: { title },
			body: { comment: content },
		} = req;

		if (!user) {
			return res.json({
				success: false,
			});
		}

		if (typeof title !== "string") {
			return res.json({
				success: false,
			});
		}

		const post = await client.post.findUnique({
			where: { title },
			select: { id: true },
		});

		if (!post) {
			return res.json({
				success: false,
			});
		}

		const newComment = await client.comment.create({
			data: {
				content,
				author: { connect: { id: user.id } },
				post: { connect: { id: post.id } },
			},
		});

		res.json({
			success: true,
			newComment,
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
