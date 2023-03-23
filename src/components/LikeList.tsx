import { Post, User } from "@prisma/client";
import useSWR from "swr";
import { motion } from "framer-motion";

interface Record {
	id: number;
	post: Post;
}
interface PostListResponse {
	[key: string]: Record[];
}

export default function LikeList() {
	const { data } = useSWR<PostListResponse>(`/api/users/favorite`);
	return data ? (
		<>
			{data.favorites.map((favorite, index) => (
				<motion.div
					key={favorite.post.id}
					className="bg-white shadow-md rounded-lg p-4 mb-4 w-full"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, ease: "easeInOut", delay: index * 0.1 }}
				>
					<a
						href={`/posts/${favorite.post.title}`}
						className="font-semibold text-lg text-blue-600 hover:text-blue-800"
					>
						<div>{favorite.post.title}</div>
					</a>
					<div className="text-sm text-gray-600 mt-2">
						{favorite.post.createdAt.toString().substring(0, 10)}
					</div>
					<div className="text-sm text-gray-800 mt-2">
						Views: {favorite.post.view}
					</div>
				</motion.div>
			))}
		</>
	) : null;
}
