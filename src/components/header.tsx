import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useCycle } from "framer-motion";
import { MenuToggle } from "./MenuToggle";
import { Navigation } from "./Navigation";

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
		opacity: 0.9,
		backgroundColor: "#FDFDFD",
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
	const [isOpen, toggleOpen] = useCycle(false, true);

	return (
		<div className="w-full grid grid-cols-3 opacity-100 h-16 fixed top-0 left-0 right-0 z-20">
			<>
				<div className="col-span-1 px-4 flex items-center">
					<Link href={"/"}>
						<div className="w-12 h-12 flex items-center text-orange-500">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="2"
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
								/>
							</svg>
						</div>
					</Link>
				</div>
				<div className="col-span-1"></div>
				<motion.nav
					className="absolute top-0 right-0 bottom-0 w-80"
					initial={false}
					animate={isOpen ? "open" : "closed"}
				>
					<motion.div
						className="absolute top-0 right-0 bottom-0 w-80 h-screen"
						variants={sidebar}
					/>
					<Navigation />
					<MenuToggle toggle={() => toggleOpen()} />
				</motion.nav>
			</>
		</div>
	);
}
