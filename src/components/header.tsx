import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";
import Link from "next/link";

import { mutate } from "swr";
import GithubIcon from "./githubIcon";
import HomeIcon from "./homeIcon";

interface LogoutResult {
	isLogin: boolean;
}

export default function Header() {
	const { user, isLoading } = useUser({ toLoginPage: false });
	const [enter, { loading, data, error }] =
		useMutation<LogoutResult>("api/users/logout");
	const logoutClicked = () => {
		if (loading) return;
		enter("");
		mutate("/api/users/profile");
		window.location.replace("/");
	};
	return (
		<div className="w-full grid grid-cols-3 bg-blue-500 opacity-70 h-16">
			{isLoading ? null : (
				<>
					<div className="col-span-1 px-4 flex items-center">
						<Link href={"/"}>
							<div className="w-12 h-12">
								<HomeIcon />
							</div>
						</Link>
					</div>
					<div className="col-span-1 flex items-center gap-8 justify-center text-white">
						<Link href={"/posts"}>
							<div className="">포스트</div>
						</Link>
						<div className="">시리즈</div>
						<div className="">질문하기</div>
					</div>

					<div className="col-span-1 flex items-center gap-8 flex-row-reverse px-4 text-white">
						<a href="https://github.com/E-Sangho">
							<div className="w-8 h-8">
								<GithubIcon />
							</div>
						</a>
						{user ? (
							<Link href="/user/profile">
								<div>프로필</div>
							</Link>
						) : (
							<Link href={"/register"}>
								<div className="">회원가입</div>
							</Link>
						)}
						{user ? (
							<button onClick={logoutClicked}>로그아웃</button>
						) : (
							<Link href={"/login"}>
								<div className="">로그인</div>
							</Link>
						)}
					</div>
				</>
			)}
		</div>
	);
}
