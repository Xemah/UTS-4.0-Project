import { fail } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import { parseFormData, validate } from '$lib/server/utils';

/** @type {import('./$types').Actions} */
export const actions = {
	edit: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401);
		}

		let profile = await prisma.profile.findFirst({
			where: {
				user: {
					id: locals.user.id,
				},
			},
		});

		if (!profile) {
			return fail(400);
		}

		const body = parseFormData(await request.formData());

		const validation = await validate(body, {
			name: ['string', 'minLength:3', 'maxLength:64'],
			avatar: ['string'],
			background: ['string'],
			bio: ['string', 'maxLength:64'],
			interests: ['string', 'maxLength:128'],
		});

		if (validation.error) {
			return fail(400, { message: validation.error });
		}

		const interests = body.interests.split(/,\s*/).filter((s) => s.trim() !== '');

		profile = await prisma.profile.update({
			where: {
				id: profile.id,
			},
			data: {
				name: body.name,
				avatar: body.avatar || null,
				background: body.background || null,
				bio: body.bio,
				interests: interests,
			},
		});

		return {
			message: 'Profile has been successfully updated.',
			data: profile,
		};
	},
};