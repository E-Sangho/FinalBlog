import { PostResponse } from "@/libs/client/useComments";
import { Comment } from "@prisma/client";
import { useState } from "react";
import { KeyedMutator } from "swr";

interface CommentProps {
	isReversed: boolean;
	comment: Comment;
}

export default function CommentComponent({
	isReversed,
	comment,
}: CommentProps) {
	const [isDeleted, setIsDeleted] = useState(false);

	const handleDelete = async () => {
		try {
			const reponse = fetch("/api/comments", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(comment.id),
			});
		} catch (error) {
			console.log(error);
		}
	};

	if (isDeleted) {
		return null;
	}

	return (
		<div className="pl-4 py-4 ">
			<div className="flex items-center">
				<div className="rounded-full bg-gray-300 w-8 h-8 text-gray-200 px-2 py-2 mr-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 448 512"
						fill="currentColor"
						width="100%"
						height="100%"
					>
						<path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z" />
					</svg>
				</div>
				<div className="mr-4">{comment.authorId}</div>
				<div className="text-sm text-gray-400">
					{comment.createdAt.toString()}
				</div>
			</div>
			<div className="pl-12">
				<div className="w-full h-24 rounded-2xl bg-gray-100 mb-2">
					{comment.content}
				</div>
				<div className="flex flex-row-reverse gap-4">
					<button className="px-4 py-1 bg-gray-300 rounded-2xl text-gray-50">
						댓글 달기
					</button>
					<button className="px-4 py-1 bg-gray-300 rounded-2xl text-gray-50">
						수정
					</button>
					<button
						onClick={handleDelete}
						className="px-4 py-1 bg-gray-300 rounded-2xl text-gray-50"
					>
						삭제
					</button>
				</div>
			</div>
		</div>
	);
}
