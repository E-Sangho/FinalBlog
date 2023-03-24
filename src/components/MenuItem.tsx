import { motion } from "framer-motion";

const variants = {
	open: {
		y: 0,
		opacity: 1,
		transition: {
			y: { stiffness: 1000, velocity: -100 },
		},
	},
	closed: {
		y: 50,
		opacity: 0,
		transition: {
			y: { stiffness: 1000 },
		},
	},
};

const colors = ["#FF008C", "#D309E1", "#9C1AFF", "#7700FF", "#4400FF"];

interface IMenuItem {
	info: {
		text: string;
		url: string;
	};
	i: number;
}

export const MenuItem = ({ info, i }: IMenuItem) => {
	const { text, url } = info;
	const style = { border: `2px solid ${colors[i]}` };
	return (
		<motion.li
			variants={variants}
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.95 }}
			className="flex mb-8 cursor-pointer w-full items-center"
		>
			<div className="w-4 h-4 rounded-full mr-6" style={style} />
			<a href={`${url}`}>
				<div
					className="rounded-md w-44 h-10 flex-1 font-mabinogi flex items-center pl-2"
					style={style}
				>
					{text}
				</div>
			</a>
		</motion.li>
	);
};
