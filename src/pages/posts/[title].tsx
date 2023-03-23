import CommentComponent from "@/components/Comment";
import Layout from "@/components/layout";
import MarkdownRenderer from "@/components/markdownRenderer";
import { useRouter } from "next/router";
import useSWR from "swr";
import useUser from "@/libs/client/useUser";
import { Category, Comment, Post, Tag, User } from "@prisma/client";
import { useForm } from "react-hook-form";
import useMutation from "@/libs/client/useMutation";
import useComments from "@/libs/client/useComments";
import { useEffect, useState } from "react";
import { concatClassName } from "@/libs/client/concatClassName";

interface PostWithUser extends Post {
	user: User;
	categories: Category[];
	tags: Tag[];
}

interface PostResponse {
	isAPISuccessful: boolean;
	post: PostWithUser;
	isLiked: boolean;
}

interface CommentWithUser extends Comment {
	author: User;
	comment: Comment;
}

interface CommentResponse {
	success: boolean;
	comments: CommentWithUser[];
}

interface CommentData {
	comment: string;
}

interface CommentWithUser extends Comment {
	author: User;
}

export interface CommentPostResponse {
	isAPISuccessful: boolean;
	comments: CommentWithUser[];
}

export default function ReadPost() {
	const router = useRouter();
	const { data, mutate: postMutate } = useSWR<PostResponse>(
		router.query.title ? `/api/posts/${router.query.title}` : null
	);
	const { data: commentSWRData, mutate: mutateComment } =
		useSWR<CommentPostResponse>(
			router.query.title ? `/api/comments/${router.query.title}` : null
		);
	const [isEditing, setIsEditing] = useState(false);
	const [updatedContent, setUpdatedContent] = useState(data?.post.content);
	const user = useUser({ toLoginPage: false });
	// const { data: commentSWRData, isLoading, mutate: mutateComment } = useComments(`${router.query.title}`);
	const [enter, { loading, data: commentData, error }] = useMutation(
		`/api/comments/${router.query.title}`,
		{
			onSuccess: mutateComment,
		}
	);
	const { register, handleSubmit, reset } = useForm<CommentData>();
	const onValid = (data: CommentData) => {
		if (loading) return;
		enter(data);
		reset();
	};

	useEffect(() => {
		if (!router.query.title) {
			return;
		}
	}, [router.query.title]);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleEditCancel = () => {
		setIsEditing(false);
		setUpdatedContent(data?.post.content);
	};

	const handleEditSave = async () => {
		try {
			const response = await fetch(`/api/posts/${data?.post.title}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					content: updatedContent,
				}),
			})
				.then((response) => response.json())
				.then((data) => {
					console.log(data);
					if (data.success) {
						setIsEditing(false);
						postMutate();
					}
				})
				.finally(() => {});
		} catch (error) {
			console.log(error);
		}
	};

	const [toggleFavorite] = useMutation(
		`/api/posts/${router.query.title}/favorite`,
		{}
	);

	const onFavoriteClick = () => {
		if (!data) return;

		toggleFavorite({});
		postMutate({ ...data, isLiked: !data.isLiked }, false);
	};
	return (
		<Layout>
			<div className="relative">
				<div className="w-full h-96 opacity-60 bg-black absolute"></div>
				{data?.post ? (
					<>
						<div className="w-full overflow-hidden h-96">
							{data?.post?.titleImage ? (
								<img
									src={`https://imagedelivery.net/eEBHudfAwjXH9a3QdqJsMA/${data?.post.titleImage}/public`}
									className="object-fill object-center h-96 mx-auto"
								/>
							) : null}
						</div>
						<div className="w-full h-96 absolute top-0 flex justify-center items-center text-4xl text-slate-100">
							{data?.post.title}
						</div>
						<div className="w-full h-96 absolute top-0 flex justify-end items-end text-xl text-slate-100 px-8 py-8">
							<ul>
								{data?.post.tags.map((tag) => (
									<li key={tag.name}>{tag.name}</li>
								))}
							</ul>
							<div>{data?.post.categories[0].name}</div>
							<div>{data?.post.updatedAt.toString()}</div>
							<button
								onClick={onFavoriteClick}
								className={concatClassName(
									"p-3 rounded-md flex items-center hover:bg-gray-100 justify-center ",
									data.isLiked
										? "text-red-500  hover:text-red-600"
										: "text-gray-400  hover:text-gray-500"
								)}
							>
								{data.isLiked ? (
									<svg
										className="w-6 h-6"
										fill="currentColor"
										viewBox="0 0 20 20"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
											clipRule="evenodd"
										></path>
									</svg>
								) : (
									<svg
										className="h-6 w-6 "
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
										/>
									</svg>
								)}
							</button>
							{user?.user && user?.user?.id === data.post.authorId ? (
								isEditing ? null : (
									<button
										className="px-4 py-1 bg-gray-300 rounded-2xl text-gray-50 mr-2"
										onClick={handleEdit}
									>
										수정
									</button>
								)
							) : null}
							{isEditing ? (
								<div className="flex justify-end mt-4">
									<button
										className="px-4 py-1 bg-gray-300 rounded-2xl text-gray-50 mr-2"
										onClick={handleEditCancel}
									>
										취소
									</button>
									<button
										className="px-4 py-1 bg-gray-300 rounded-2xl text-gray-50"
										onClick={handleEditSave}
									>
										저장
									</button>
								</div>
							) : null}
						</div>
						<div className="mx-16 my-32">
							{isEditing ? (
								<textarea
									value={updatedContent}
									onChange={(event) => setUpdatedContent(event.target.value)}
									className="w-full h-full rounded-md px-4 py-4 focus:outline-green-500"
								/>
							) : (
								<MarkdownRenderer
									text={data?.post.content ? data?.post.content : ""}
								/>
							)}
						</div>
					</>
				) : null}
			</div>
			<form
				onSubmit={handleSubmit(onValid)}
				className="mx-16 bg-gray-100 rounded-2xl"
			>
				<div className="px-4 py-4">
					<div className="flex items-center">
						{user?.user?.avatar ? (
							<img
								src={`https://imagedelivery.net/eEBHudfAwjXH9a3QdqJsMA/${user?.user.avatar}/public`}
								className="rounded-full w-8 h-8 mr-4"
							/>
						) : (
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
						)}
						{user?.user ? (
							<div className="text-gray-400">{user.user.username}</div>
						) : (
							<div className="text-gray-400">로그인 후 작성할 수 있습니다.</div>
						)}
					</div>
					<>
						<div className="flex flex-col px-4 py-4 w-full h-64 rounded-md">
							<textarea
								className="w-full h-full rounded-md px-4 py-4 focus:outline-green-500"
								{...register("comment", {
									required: true,
								})}
							></textarea>
						</div>
						{user?.user ? (
							<div className="flex flex-row-reverse pr-3">
								<button className="px-4 py-1 bg-gray-300 rounded-2xl text-gray-50">
									{loading ? "등록중" : "등록"}
								</button>
							</div>
						) : null}
					</>
				</div>
			</form>
			<div className="mx-16">
				{!commentSWRData ? (
					<div>Loading comments now...</div>
				) : (
					<>
						{commentSWRData ? (
							commentSWRData.comments.map((comment, index) => (
								<CommentComponent
									isReversed={
										user?.user ? user?.user.id === comment.authorId : false
									}
									comment={comment}
									key={index}
									user={user?.user ? { id: user?.user?.id } : null}
								/>
							))
						) : (
							<div>There is no comments on here.</div>
						)}
					</>
				)}
			</div>
		</Layout>
	);
}
