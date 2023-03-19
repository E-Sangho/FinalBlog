import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { IronSession } from "iron-session";

interface IRequest {
	session: IronSession;
	body: {
		title: string;
		categories: string;
		tags: string;
		draft: boolean;
		titleImage: string;
		content: string;
	};
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		const posts = await client.post.findMany({});

		return res.json({
			isAPISuccessful: true,
			posts,
		});
	}

	if (req.method === "POST") {
		const {
			session: { user },
			body: { title, categories, tags, draft, titleImage, content },
		}: IRequest = req;

		const categoryList = categories.split(",");
		const tagList = tags.split(",");

		const categoryPromises = categoryList.map((categoryName) => {
			return client.category.upsert({
				where: {
					name: categoryName,
				},
				update: {},
				create: {
					name: categoryName,
				},
			});
		});

		const tagPromises = tagList.map((tagName) => {
			return client.category.upsert({
				where: {
					name: tagName,
				},
				update: {},
				create: {
					name: tagName,
				},
			});
		});

		const newCategories = await Promise.all(categoryPromises);
		const newTags = await Promise.all(tagPromises);

		const newPost = await client.post.create({
			data: {
				title: "Test Title",
				categories: {
					connect: newCategories.map((category) => ({ id: category.id })),
				},
				tags: {
					connect: newTags.map((tag) => ({ id: tag.id })),
				},
			},
		});

		// const tag = tags
		// 	.split(",")
		// 	.map((e: string) => e.trim())
		// 	.map((e: string) => {
		// 		let tag = {
		// 			tag: e,
		// 		};
		// 		return tag;
		// 	});

		// const post = await client.post.create({
		// 	data: {
		// 		title: title.replaceAll(" ", "_"),
		// 		categories: {
		// 			create: [{ categories: category }],
		// 		},
		// 		draft,
		// 		tags: {
		// 			create: tag,
		// 		},
		// 		titleImage: titleImage ? titleImage : "",
		// 		contents,
		// 		author: {
		// 			connect: {
		// 				id: user?.id,
		// 			},
		// 		},
		// 	},
		// });

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
