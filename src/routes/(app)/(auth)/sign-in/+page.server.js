import { fail, redirect } from '@sveltejs/kit';
import { verify } from 'argon2';
import jwt from 'jsonwebtoken';
import { dev } from '$app/environment';
import { JWT_SECRET } from '$env/static/private';
import prisma from '$lib/server/prisma';
import { parseFormData, validate } from '$lib/server/utils';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	if (locals.user) {
		return redirect(302, '/');
	}
};

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, locals, cookies }) => {
		if (locals.user) {
			return fail(400);
		}

		const body = parseFormData(await request.formData());

		const validation = await validate(body, {
			email: ['required', 'email', 'maxLength:64'],
			password: ['required'],
		});

		if (validation.error) {
			return fail(400, { message: validation.error });
		}

		const account = await prisma.account.findFirst({
			where: {
				email: body.email,
			},
		});

		if (!account) {
			return fail(400, { message: 'Invalid email or password.' });
		}

		const isPasswordValid = await verify(account.password, body.password);
		if (!isPasswordValid) {
			return fail(400, { message: 'Invalid email or password.' });
		}

		const authToken = jwt.sign({
			userId: account.userId,
		}, JWT_SECRET, {
			expiresIn: '24h',
		});

		cookies.set('token', authToken, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev,
			maxAge: 60 * 60 * 24 * 30,
		});

		return { message: 'You have been successfully signed in.' };
	},
};