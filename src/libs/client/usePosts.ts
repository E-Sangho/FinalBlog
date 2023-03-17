import { Post, User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

interface PostResponse {
	isAPISuccessful: boolean;
	posts: Post[];
}

export default function usePosts() {
	const { data, error, mutate } = useSWR<PostResponse>("/api/posts", {
		shouldRetryOnError: false,
	});

	return { posts: data?.posts, isLoading: !data && !error, mutate };
}
