import Layout from "@/components/layout";
import LikeList from "@/components/LikeList";
import useUser from "@/libs/client/useUser";
import Link from "next/link";
export default function Profile() {
	const { user } = useUser({ toLoginPage: true });

	return (
		<Layout>
			<div className="px-4 py-4">
				<div className="rounded-xl border-green-500 border px-4 py-4">
					<div className="text-gray-400 font-bold text-sm mb-2">
						사용자 정보
					</div>
					<div className="flex border-b border-gray-300 pb-2">
						{user?.avatar ? (
							<img
								src={`https://imagedelivery.net/eEBHudfAwjXH9a3QdqJsMA/${user?.avatar}/avatar`}
								className="w-12 h-12 rounded-full border"
							/>
						) : (
							<div className="w-12 h-12 text-gray-50 rounded-full bg-gray-300 p-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									width="100%"
									height="100%"
								>
									<path
										fillRule="evenodd"
										d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						)}
						<div className="flex justify-between flex-1 pl-3 items-center">
							<div className="font-bold text-2xl">이상호</div>
							<Link href="/user/edit">
								<button className="border rounded-md text-xs font-bold text-gray-400 bg-gray-50 block h-8 px-2">
									프로필 수정
								</button>
							</Link>
						</div>
					</div>
					<div className="flex items-center border-b border-gray-300 pb-2 pt-2">
						<div className="w-6 h-6 text-gray-300 mr-7">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								width="100%"
								height="100%"
							>
								<path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
								<path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
							</svg>
						</div>
						<div className="flex flex-1 justify-between items-center">
							<div className="text-gray-400 text-sm">istrangeho@gmail.com</div>
						</div>
					</div>
					<div className="flex items-center pb-2 pt-2">
						<div className="w-6 h-6 text-gray-300 mr-7">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								width="100%"
								height="100%"
							>
								<path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
								<path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
							</svg>
						</div>
						<div>작성한 댓글 수: 0</div>
					</div>
					<div className="flex items-center pb-2 pt-2">
						<div className="w-6 h-6 text-gray-300 mr-7">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								height="100%"
								width="100%"
							>
								<path
									fillRule="evenodd"
									d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<div>작성한 댓글 수: 0</div>
					</div>
					<div className="flex items-center pt-2">
						<div className="w-6 h-6 text-gray-300 mr-7">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								height="100%"
								width="100%"
							>
								<path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
							</svg>
						</div>
						<div>작성한 댓글 수: 0</div>
					</div>
				</div>
				<LikeList />
			</div>
		</Layout>
	);
}
