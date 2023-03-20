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
import { useEffect } from "react";

interface PostWithUser extends Post {
	user: User;
	categories: Category[];
	tags: Tag[];
}

interface PostResponse {
	success: boolean;
	post: PostWithUser;
	isLiked: boolean;
}

interface CommentWithUser extends Comment {
	user: User;
	comment: Comment;
}

interface CommentResponse {
	success: boolean;
	comments: CommentWithUser[];
}

interface CommentData {
	comment: string;
}

export default function ReadPost() {
	const router = useRouter();
	const { data } = useSWR<PostResponse>(
		router.query.title ? `/api/posts/${router.query.title}` : null
	);
	const user = useUser({ toLoginPage: false });
	const [enter, { loading, data: commentData, error }] = useMutation(
		`/api/comments/${router.query.title}`
	);
	const { comments, isLoading, mutate } = useComments(`${router.query.title}`);
	const { register, handleSubmit } = useForm<CommentData>();
	const onValid = (data: CommentData) => {
		if (loading) return;
		enter(data);
	};
	useEffect(() => {
		if (!router.query.title) {
			return;
		}
	}, [router.query.title]);
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
						</div>
						<div className="mx-16 my-32">
							<MarkdownRenderer
								text={data?.post.content ? data?.post.content : ""}
							/>
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
									등록
								</button>
							</div>
						) : null}
					</>
				</div>
			</form>
			<div className="mx-16">
				{isLoading ? (
					<div>Loading comments now...</div>
				) : (
					<>
						{comments ? (
							comments.map((comment, index) => (
								<CommentComponent
									isReversed={false}
									comment={comment}
									key={index}
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
