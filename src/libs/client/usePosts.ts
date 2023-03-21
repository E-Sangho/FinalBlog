import { Post } from "@prisma/client";
import useSWR from "swr";

interface PostResponse {
	isAPISuccessful: boolean;
	posts: Post[];
}

export default function usePosts(title?: string) {
	const url = title ? `/api/posts/${title}` : "/api/posts";
	const { data, error, mutate } = useSWR<PostResponse>(url, {
		shouldRetryOnError: false,
	});

	return { posts: data?.posts, isLoading: !data && !error, mutate };
}
