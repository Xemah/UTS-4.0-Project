import { error, fail } from '@sveltejs/kit';
import { hash, verify } from 'argon2';
import prisma from '$lib/server/prisma';
import { parseFormData, validate } from '$lib/server/utils';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	if (!locals.user) {
		return error(401);
	}
};

/** @type {import('./$types').Actions} */
export const actions = {
	changeEmail: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401);
		}

		const body = parseFormData(await request.formData());

		const validation = await validate(body, {
			newEmail: ['required', 'email', 'maxLength:64'],
			confirmNewEmail: ['required', 'same:newEmail'],
			currentPassword: ['required'],
		});

		if (validation.error) {
			return fail(400, { message: validation.error });
		}

		const account = await prisma.account.findFirst({
			where: {
				userId: locals.user.id,
			},
		});

		if (account.email === body.newEmail) {
			return fail(400, { message: 'New email cannot be same as old one.' });
		}

		const accountWithSameEmail = await prisma.account.findFirst({
			where: {
				email: body.newEmail,
			},
		});

		if (accountWithSameEmail) {
			return fail(400, { message: 'Email is already in use.' });
		}

		const isPasswordValid = await verify(account.password, body.currentPassword);
		if (!isPasswordValid) {
			return fail(400, { message: 'Current password is invalid.' });
		}

		await prisma.account.update({
			where: {
				id: account.id,
			},
			data: {
				email: body.newEmail,
			},
		});

		return { message: 'Email has been successfully updated.' };
	},

	changePassword: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401);
		}

		const body = parseFormData(await request.formData());

		const validation = await validate(body, {
			newPassword: ['required', 'minLength:3', 'maxLength:64'],
			confirmNewPassword: ['required', 'same:newPassword'],
			currentPassword: ['required'],
		});

		if (validation.error) {
			return fail(400, { message: validation.error });
		}

		const account = await prisma.account.findFirst({
			where: {
				userId: locals.user.id,
			},
		});

		const isPasswordValid = await verify(account.password, body.currentPassword);
		if (!isPasswordValid) {
			return fail(400, { message: 'Current password is invalid.' });
		}

		if (body.newPassword === body.currentPassword) {
			return fail(302, { message: 'New password cannot be same as old one.' });
		}

		await prisma.account.update({
			where: {
				id: account.id,
			},
			data: {
				password: await hash(body.newPassword),
			},
		});

		return { message: 'Password has been successfully updated.' };
	},
};