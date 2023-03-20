import { concatClassName } from "@/libs/client/concatClassName";
import { Comment, User } from "@prisma/client";
import { useState } from "react";

interface CommentWithUser extends Comment {
	author: User;
}

interface CommentProps {
	isReversed: boolean;
	comment: CommentWithUser;
	user: { id: number } | null;
}

export default function CommentComponent({
	isReversed,
	comment,
	user,
}: CommentProps) {
	const [isDeleted, setIsDeleted] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [updatedContent, setUpdatedContent] = useState(comment.content);

	const handleDelete = async () => {
		try {
			const reponse = fetch("/api/comments", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(comment.id),
			});
			setIsDeleted(true);
		} catch (error) {
			console.log(error);
		}
	};

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleEditCancel = () => {
		setIsEditing(false);
	};

	const handleEditSave = async () => {
		try {
			comment.content = updatedContent;
			const response = await fetch("/api/comments", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: comment.id,
					content: updatedContent,
				}),
			});
			setIsEditing(false);
		} catch (error) {
			console.log(error);
		}
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setUpdatedContent(event.target.value);
	};

	if (isDeleted) {
		return null;
	}

	return (
		<div className="pl-4 py-4 ">
			<div
				className={concatClassName(
					"flex items-center",
					user ? (user.id === comment.authorId ? "flex-row-reverse" : "") : ""
				)}
			>
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
				<div className="mr-4">{comment.author.username}</div>
				<div className="text-sm text-gray-400">
					{comment.createdAt.toString()}
				</div>
			</div>
			<div className="pl-12">
				{isEditing ? (
					<>
						<textarea
							value={updatedContent}
							onChange={handleInputChange}
							className="w-full h-24 rounded-2xl bg-red-500 mb-2"
						/>
						<div className="flex flex-row-reverse gap-4">
							<button
								onClick={handleEditSave}
								className="px-4 py-1 bg-gray-300 rounded-2xl text-gray-50"
							>
								확인
							</button>
							<button
								onClick={handleEditCancel}
								className="px-4 py-1 bg-gray-300 rounded-2xl text-gray-50"
							>
								취소
							</button>
						</div>
					</>
				) : (
					<>
						<div className="w-full h-24 rounded-2xl bg-gray-100 mb-2">
							{comment.content}
						</div>
						<div className="flex flex-row-reverse gap-4">
							{/* <button className="px-4 py-1 bg-gray-300 rounded-2xl text-gray-50">
								댓글 달기
							</button> */}
							{user ? (
								user.id === comment.authorId ? (
									<>
										<button
											onClick={handleEdit}
											className="px-4 py-1 bg-gray-300 rounded-2xl text-gray-50"
										>
											수정
										</button>
										<button
											onClick={handleDelete}
											className="px-4 py-1 bg-gray-300 rounded-2xl text-gray-50"
										>
											삭제
										</button>
									</>
								) : null
							) : null}
						</div>
					</>
				)}
			</div>
		</div>
	);
}
