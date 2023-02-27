import bcrypt from "bcrypt";

interface IHashPassword {
	password: string;
}

interface IComparePassword {
	password: string;
	hash: string;
}

export function hashPassword({ password }: IHashPassword) {
	if (!process.env.BCRYPT_SALT) {
		return;
	}

	const salt = parseInt(process.env.BCRYPT_SALT);
	return bcrypt.hashSync(password, salt);
}

export function comparePassword({ password, hash }: IComparePassword) {
	if (process.env.BCRYPT_SALT) {
		return bcrypt.compareSync(password, hash);
	}
}
