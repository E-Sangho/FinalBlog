import GithubIcon from "./githubIcon";
import HomeIcon from "./homeIcon";

export default function Header() {
	return (
		<div className="w-full grid grid-cols-3 bg-blue-500 opacity-70 h-16">
			<div className="col-span-1 px-4 flex items-center">
				<div className="w-12 h-12">
					<HomeIcon />
				</div>
			</div>
			<div className="col-span-1 flex items-center gap-8 justify-center text-white">
				<div className="">포스트</div>
				<div className="">시리즈</div>
				<div className="">질문하기</div>
			</div>
			<div className="col-span-1 flex items-center gap-8 flex-row-reverse px-4 text-white">
				<div className="w-8 h-8">
					<GithubIcon />
				</div>
				<div className="">회원가입</div>
				<div className="">로그인</div>
			</div>
		</div>
	);
}
