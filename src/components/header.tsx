import HomeIcon from "./homeIcon";

export default function Header() {
	return (
		<div className="w-full grid grid-cols-3 bg-blue-500 opacity-50 h-16">
			<div className="col-span-1 px-4 flex items-center">
				<div className="w-12 h-12 col-span-1">
					<HomeIcon />
				</div>
			</div>
			<div className="col-span-1 flex items-center justify-center">
				<div className="">center</div>
			</div>
			<div className="col-span-1 flex items-center flex-row-reverse px-4">
				Menu
			</div>
		</div>
	);
}
