import { fail, redirect } from '@sveltejs/kit';
import { hash } from 'argon2';
import { ms } from 'convert';
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
			name: ['required', 'minLength:3', 'maxLength:64'],
			email: ['required', 'email', 'maxLength:64'],
			password: ['required', 'minLength:8', 'maxLength:64'],
			confirmPassword: ['required', 'same:password'],
		});

		if (validation.error) {
			return fail(400, { message: validation.error });
		}

		const accountWithSameEmail = await prisma.account.findFirst({
			where: {
				email: body.email,
			},
		});

		if (accountWithSameEmail) {
			return fail(400, { message: 'Email is already in use.' });
		}

		const user = await prisma.user.create({
			data: {
				account: {
					create: {
						email: body.email,
						password: await hash(body.password),
					},
				},
				profile: {
					create: {
						name: body.name,
					},
				},
			},
		});

		const authToken = jwt.sign({
			userId: user.id,
		}, JWT_SECRET, {
			expiresIn: '30d',
		});

		cookies.set('token', authToken, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev,
			maxAge: ms('30d') / 100,
		});

		return { message: 'You have been successfully signed up.' };
	},
};