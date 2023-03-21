import { Post, User } from "@prisma/client";
import useSWR from "swr";

interface Record {
	id: number;
	post: Post;
}
interface PostListResponse {
	[key: string]: Record[];
}

export default function LikeList() {
	const { data } = useSWR<PostListResponse>(`/api/users/favorite`);
	console.log(data);
	return data ? (
		<>
			{data.favorites.map((favorite) => (
				<div>
					<div>{favorite.post.title}</div>
					<div>{favorite.post.createdAt.toString()}</div>
					<div>{favorite.post.view}</div>
				</div>
			))}
		</>
	) : null;
}
