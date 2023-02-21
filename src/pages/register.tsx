import useMutation from "@/libs/client/useMutation";
import { useForm } from "react-hook-form";

interface RegisterData {
	identifier: string;
	password: string;
	checkPassword: string;
	username: string;
	email?: string;
}

export default function Register() {
	const [enter, { loading, data, error }] = useMutation("api/users/register");
	const { register, handleSubmit } = useForm<RegisterData>();
	const onValid = (data: RegisterData) => {
		if (loading) return;
		enter(data);
	};
	return (
		<div className="w-full h-screen">
			<div className="w-96 mx-auto text-center mt-32 mb-8 text-2xl">
				회원가입
			</div>
			<div className="w-96 border-t border-l border-r border-b border-gray-200 rounded-lg px-6 py-6 mx-auto">
				<form onSubmit={handleSubmit(onValid)}>
					<div className="flex flex-col mb-4">
						<label htmlFor="identifier" className="mb-2">
							아이디
						</label>
						<input
							id="identifier"
							className="px-2 py-2 flex-1 rounded-lg border border-gray-300 focus:outline-green-500 text-black"
							{...register("identifier", { required: true })}
						></input>
					</div>
					<div className="flex flex-col mb-4">
						<label htmlFor="password" className="mb-2">
							비밀번호
						</label>
						<input
							id="password"
							type="password"
							className="px-2 py-2 flex-1 rounded-lg border border-gray-300 focus:outline-green-500 text-black"
							{...register("password", { required: true })}
						></input>
					</div>
					<div className="flex flex-col mb-4">
						<label htmlFor="checkPassword" className="mb-2">
							비밀번호 확인
						</label>
						<input
							id="checkPassword"
							type="password"
							className="px-2 py-2 flex-1 rounded-lg border border-gray-300 focus:outline-green-500 text-black"
							{...register("checkPassword", { required: true })}
						></input>
					</div>
					<div className="flex flex-col mb-4">
						<label htmlFor="username" className="mb-2">
							사용자명
						</label>
						<input
							id="username"
							className="px-2 py-2 flex-1 rounded-lg border border-gray-300 focus:outline-green-500 text-black"
							{...register("username", { required: true })}
						></input>
					</div>
					<div className="flex flex-col mb-4">
						<label htmlFor="email" className="mb-2">
							이메일
						</label>
						<input
							id="email"
							type="email"
							className="px-2 py-2 flex-1 rounded-lg border border-gray-300 focus:outline-green-500 text-black"
							{...register("email")}
						></input>
					</div>
					<div className="mt-8">
						<button className="w-full bg-green-500 py-4 rounded-lg text-white">
							가입하기
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
