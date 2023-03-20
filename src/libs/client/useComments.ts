import { Comment, Post, User } from "@prisma/client";
import { useRouter } from "next/router";
import useSWR from "swr";

export interface PostResponse {
	isAPISuccessful: boolean;
	comments: Comment[];
}

export default function useComments(title: string) {
	const router = useRouter();
	const { data, error, mutate } = useSWR<PostResponse>(
		router.query.title ? `/api/comments/${title}` : null,
		{
			shouldRetryOnError: false,
		}
	);

	return { comments: data?.comments, isLoading: !data && !error, mutate };
}
