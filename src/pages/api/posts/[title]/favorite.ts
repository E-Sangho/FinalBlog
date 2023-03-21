import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "POST") {
		const {
			query: { title },
			session: { user },
		} = req;
		if (typeof title !== "string") {
			return res.status(401);
		}

		const post = await client.post.findUnique({
			where: {
				title,
			},
		});

		const isFavoriteExists = await client.favorite.findFirst({
			where: {
				postId: post?.id,
				userId: user?.id,
			},
		});

		if (isFavoriteExists) {
			// delete favotire
			await client.favorite.delete({
				where: {
					id: isFavoriteExists.id,
				},
			});
			return res.json({
				isAPISuccessful: true,
			});
		} else {
			// create favotire
			await client.favorite.create({
				data: {
					user: {
						connect: {
							id: user?.id,
						},
					},
					post: {
						connect: {
							id: post?.id,
						},
					},
				},
			});
		}

		return res.json({ success: true });
	}
}

export default withApiSession(
	withHandler({
		methods: ["POST"],
		handler: handler,
		isPrivate: false,
	})
);
