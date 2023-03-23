import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, AnimatePresence, useCycle } from "framer-motion";
import { mutate } from "swr";
import GithubIcon from "./githubIcon";
import { MenuToggle } from "./MenuToggle";
import { Navigation } from "./Navigation";

interface LogoutResult {
	isLogin: boolean;
}

const menuVariants = {
	open: {
		transition: { staggerChildren: 0.07, delayChildren: 0.2 },
	},
	closed: {
		transition: { staggerChildren: 0.05, staggerDirection: -1 },
	},
};

const sidebar = {
	open: (height = 1000) => ({
		clipPath: `circle(${height * 2 + 200}px at 280px 280px)`,
		transition: {
			type: "spring",
			stiffness: 20,
			restDelta: 2,
			backgroundColor: { duration: 0.5 },
			opacity: { duration: 0.5 },
		},
		opacity: 1,
		backgroundColor: "#3B82F6",
	}),
	closed: {
		clipPath: "circle(24px at 284px 30px)",
		transition: {
			delay: 0.1,
			type: "spring",
			stiffness: 400,
			damping: 40,
			backgroundColor: { duration: 0.5 },
			opacity: { duration: 0.5 },
		},
		opacity: 0.3,
		backgroundColor: "#9CA3AF",
	},
};

export default function Header() {
	const [toggleMenu, setToggleMenu] = useState(false);
	const [isOpen, toggleOpen] = useCycle(false, true);
	const containerRef = useRef(null);

	const { user, isLoading } = useUser({ toLoginPage: false });
	const [enter, { loading, data, error }] =
		useMutation<LogoutResult>("api/users/logout");
	const logoutClicked = () => {
		if (loading) return;
		enter("");
		mutate("/api/users/profile");
		window.location.replace("/");
	};
	const toggleButtonClick = () => {
		setToggleMenu(!toggleMenu);
	};

	return (
		<div className="w-full grid grid-cols-3 opacity-100 h-16">
			{isLoading ? null : (
				<>
					<div className="col-span-1 px-4 flex items-center">
						<Link href={"/"}>
							<div className="w-12 h-12 flex items-center text-orange-500">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="2"
									stroke="currentColor"
									className="w-6 h-6"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
									/>
								</svg>
							</div>
						</Link>
					</div>
					<div className="col-span-1"></div>
					{/* <div className="col-span-1 flex items-center gap-8 flex-row-reverse px-4 text-white">
						<MenuToggle toggle={() => toggleOpen} />
					</div> */}
					<motion.nav
						className="absolute top-0 right-0 bottom-0 w-80"
						initial={false}
						animate={isOpen ? "open" : "closed"}
					>
						<motion.div
							className="absolute top-0 right-0 bottom-0 w-80"
							variants={sidebar}
						/>
						<Navigation />
						<MenuToggle toggle={() => toggleOpen()} />
					</motion.nav>
				</>
			)}
		</div>
	);
}
