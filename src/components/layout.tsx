import { ReactNode } from "react";
import Footer from "./footer";
import Header from "./header";

interface LayoutProps {
	children: ReactNode;
}
export default function Layout({ children }: LayoutProps) {
	return (
		<div className="relative min-h-screen">
			<Header />
			<div className="my-20">{children}</div>
			<Footer />
		</div>
	);
}
