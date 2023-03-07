import Layout from "@/components/layout";
import useMutation from "@/libs/client/useMutation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useUser from "@/libs/client/useUser";
import { useRouter } from "next/router";

interface IEditProfile {
	avatar?: FileList;
	username: string;
	email: string;
}

interface EditProfileResponse {
	isAPISuccessful: boolean;
	error?: string;
}

export default function EditProfile() {
	const router = useRouter();
	const { user } = useUser({ toLoginPage: true });
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm<IEditProfile>();
	const [avatarPreview, setAvatarPreview] = useState("");
	const [editProfile, { data, loading }] =
		useMutation<EditProfileResponse>("/api/users/profile");
	const avatar = watch("avatar");
	useEffect(() => {
		if (user) {
			setValue("username", user ? user.username : "");
			setValue("email", user?.email ? user.email : "");
			setAvatarPreview(
				user?.avatar
					? `https://imagedelivery.net/eEBHudfAwjXH9a3QdqJsMA/${user?.avatar}/avatar
			`
					: avatarPreview
			);
		}
	}, [user, setValue]);
	useEffect(() => {
		if (avatar && avatar.length > 0) {
			const file = avatar[0];
			setAvatarPreview(URL.createObjectURL(file));
		}
	}, [avatar]);
	const onValid = async ({ username, email, avatar }: IEditProfile) => {
		if (loading) return;
		if (avatar && avatar.length > 0 && user?.username) {
			const cloudflareRequest = await fetch(`/api/files`);
			const { uploadURL } = await cloudflareRequest.json();
			const form = new FormData();
			form.append("file", avatar[0], user.username);
			// @ts-ignore
			const response = await fetch(uploadURL, {
				method: "POST",
				body: form,
			});
			const {
				result: { id },
			} = await response.json();
			const res = editProfile({
				username,
				email,
				avatar: id,
			});
		} else {
			editProfile({
				username,
				email,
			});
		}
		router.push("/user/profile");
	};
	return (
		<Layout>
			<div className="px-4 py-4">
				<form
					onSubmit={handleSubmit(onValid)}
					className="rounded-xl border-green-500 border px-4 py-4"
				>
					<div className="text-gray-400 font-bold text-sm mb-2">
						사용자 정보 수정
					</div>
					<div className="flex pb-2 w-full">
						<label className="mx-auto">
							{avatarPreview ? (
								<img
									src={avatarPreview}
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
							<input
								id="avatar"
								className="hidden"
								type="file"
								accept="image/*"
								{...register("avatar")}
							></input>
						</label>
					</div>
					<div className="flex items-center pb-2 pt-2">
						<div className="ml-3 w-6 h-6 text-gray-300 mr-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								width="100%"
								height="100%"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
								/>
							</svg>
						</div>
						<div className="flex flex-1 justify-between items-center">
							<input
								id="username"
								placeholder="사용자 이름을 입력해주세요"
								className="ml-2 px-2 py-2 flex-1 rounded-lg border border-gray-300 focus:outline-green-500 text-black"
								{...register("username", {
									required: "사용자명은 필수 입력 항목입니다.",
									minLength: {
										value: 4,
										message: "사용자명은 4글자 이상이어야 합니다.",
									},
									maxLength: {
										value: 16,
										message: "사용자명은 16글자 이하여야 합니다..",
									},
								})}
							></input>
						</div>
					</div>
					<div className="flex items-center pb-2 pt-2">
						<div className="ml-3 w-6 h-6 text-gray-300 mr-4">
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
							<input
								id="email"
								placeholder="이메일을 입력해주세요"
								type="email"
								className="ml-2 px-2 py-2 flex-1 rounded-lg border border-gray-300 focus:outline-green-500 text-black"
								{...register("email", {
									pattern: {
										value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
										message: "이메일 형식이 아닙니다.",
									},
								})}
							></input>
						</div>
					</div>
					{/* <div className="flex items-center pb-2 pt-2">
						<div className="ml-3 w-6 h-6 text-gray-300 mr-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								width="100%"
								height="100%"
							>
								<path
									fillRule="evenodd"
									d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<div className="flex flex-1 justify-end items-center">
							<input
								id="password"
								type="password"
								placeholder="비밀번호 (14자이상)"
								className="ml-2 px-2 py-2 flex-1 rounded-lg border border-gray-300 focus:outline-green-500 text-black"
								{...register("password", {
									required: "비밀번호는 필수 응답 항목입니다.",
									minLength: {
										value: 14,
										message: "비밀번호는 14자 이상이어야 합니다.",
									},
								})}
							></input>
						</div>
					</div>
					<div className="flex items-center pb-2 pt-2">
						<div className="ml-3 w-6 h-6 text-gray-300 mr-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								width="100%"
								height="100%"
							>
								<path
									fillRule="evenodd"
									d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<div className="flex flex-1 justify-end items-center">
							<input
								id="checkPassword"
								type="password"
								placeholder="비밀번호 (14자이상)"
								className="ml-2 px-2 py-2 flex-1 rounded-lg border border-gray-300 focus:outline-green-500 text-black"
								{...register("checkPassword", {
									required: "비밀번호를 검증해주세요.",
									minLength: {
										value: 14,
										message: "비밀번호 검증은 최소 14자 이상이어야 합니다.",
									},
									validate: {
										differentPassword: (_, values) =>
											values.password === values.checkPassword ||
											"비밀번호가 서로 다릅니다.",
									},
								})}
							></input>
						</div>
					</div> */}
					<button className="my-4 mb-2 mx-auto block bg-green-500 py-2 px-4 rounded-lg text-white">
						프로필 저장
					</button>
					{data?.error ? (
						<div className="mx-auto text-center text-lg mb-8 text-red-500">
							{data?.error}
						</div>
					) : null}
					<div className="flex flex-col items-center">
						<span className="text-red-400 px-2 py-1">
							{errors?.username?.message}
						</span>
						<span className="text-red-400 px-2 py-1">
							{errors?.email?.message}
						</span>
					</div>
				</form>
			</div>
		</Layout>
	);
}
