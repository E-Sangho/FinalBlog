import Layout from "@/components/layout";
import LikeList from "@/components/LikeList";
import useUser from "@/libs/client/useUser";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Profile() {
	const { user } = useUser({ toLoginPage: true });

	return (
		<Layout>
			<div className="flex flex-col items-center space-y-8 py-8 px-4">
				<motion.div
					className="bg-white shadow-md rounded-lg p-6 w-full"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, ease: "easeInOut" }}
				>
					<div className="text-xl font-bold text-blue-600 mb-4">
						사용자 정보
					</div>
					<div className="flex items-center space-x-4">
						{user?.avatar ? (
							<img
								className="w-16 h-16 rounded-full object-cover"
								src={`https://imagedelivery.net/eEBHudfAwjXH9a3QdqJsMA/${user?.avatar}/avatar`}
							/>
						) : (
							<div className="w-16 h-16 rounded-full bg-blue-200">
								<svg
									className="w-full h-full"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						)}
						<div>
							<div className="text-lg font-semibold text-blue-600">이상호</div>
							<Link href="/user/edit">
								<button className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
									프로필 수정
								</button>
							</Link>
						</div>
					</div>
					<div className="mt-4">
						<div className="text-sm text-gray-600">istrangeho@gmail.com</div>
					</div>
					<div className="mt-2">
						<div className="text-sm">작성한 포스트 수: {user?.postCount}</div>
					</div>
					<div className="mt-2">
						<div className="text-sm">작성한 댓글 수: {user?.commentCount}</div>
					</div>
					<div className="mt-2">
						<div className="text-sm">좋아요 한 수: {user?.favoriteCount}</div>
					</div>
				</motion.div>
				<LikeList />
			</div>
		</Layout>
	);
}
