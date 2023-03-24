import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";
import { motion } from "framer-motion";
import { mutate } from "swr";
import { MenuItem } from "./MenuItem";

const variants = {
	open: {
		transition: { staggerChildren: 0.07, delayChildren: 0.2 },
	},
	closed: {
		transition: { staggerChildren: 0.05, staggerDirection: -1 },
	},
};

interface LogoutResult {
	isLogin: boolean;
}

export const Navigation = () => {
	const { user, isLoading } = useUser({ toLoginPage: false });
	const itemInfos = [
		{
			text: "포스트",
			url: "/posts",
		},
		{
			text: "시리즈(공사중)",
			url: "/series",
		},
		{
			text: "질문하기(공사중)",
			url: "/ask",
		},
		{
			text: user ? "프로필" : "회원가입",
			url: user ? "/user/profile" : "/register",
		},
		{
			text: user ? "로그아웃" : "로그인",
			url: user ? "/" : "/login",
		},
	];
	const [enter, { loading, data, error }] =
		useMutation<LogoutResult>("api/users/logout");
	const logoutClicked = () => {
		if (loading) return;
		enter("");
		mutate("/api/users/profile");
		window.location.replace("/");
	};
	return (
		<motion.ul variants={variants} className="p-6 absolute top-24 w-full">
			{itemInfos.map((info, index) => (
				<MenuItem info={info} i={index} key={index} />
			))}
		</motion.ul>
	);
};
