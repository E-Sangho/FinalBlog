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
			where: {
				title,
			},
		});

		console.log(post);

		console.log("no problems until here.");

		const comments = await client.comment.findMany({
			where: {
				postId: post?.id,
			},
		});

		console.log(comments);

		return res.json({
			isAPISuccessful: true,
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
			where: {
				title: title,
			},
		});

		if (!post) {
			return res.json({
				success: false,
			});
		}

		const comment = client.comment.create({
			data: {
				user: {
					connect: {
						id: user?.id,
					},
				},
				Post: {
					connect: {
						id: post.id,
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
