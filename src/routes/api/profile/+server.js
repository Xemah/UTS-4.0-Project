import { error, json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ locals }) => {
	if (!locals.user) {
		return error(401);
	}

	const profile = await prisma.profile.findFirst({
		where: {
			userId: locals.user.id,
		},
		include: {
			user: {
				include: {
					_count: {
						select: {
							posts: true,
							followers: true,
							followings: true,
							notifications: {
								where: {
									isRead: false,
								},
							},
						},
					},
				},
			},
		},
	});

	return json(profile);
};