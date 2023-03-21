import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withSession";
import withHandler from "@/libs/server/withHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const {
		session: { user },
	} = req;

	const favorites = await client.favorite.findMany({
		where: {
			userId: user?.id,
		},
		include: {
			post: {
				include: {
					_count: {
						select: {
							favorites: true,
						},
					},
				},
			},
		},
	});

	console.log(favorites);

	return res.json({
		isAPISuccessful: true,
		favorites,
	});
}

export default withApiSession(
	withHandler({
		methods: ["GET"],
		handler,
	})
);
