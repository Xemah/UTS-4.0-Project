import { redirect } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/sign-in');
	}

	const interests = locals.user.profile.interests;

	const posts = await prisma.post.findMany({
		where: {
			author: {
				blocks: {
					none: {
						targetId: locals.user.id,
					},
				},
			},
			OR: [
				{
					authorId: locals.user.id,
				},
				{
					author: {
						followers: {
							some: {
								userId: locals.user.id,
							},
						},
					},
				},
				{
					OR: interests.length > 0 ? interests.map((interest) => ({
						topics: {
							array_contains: interest,
						},
					})) : undefined,
				},
			],
		},
		include: {
			author: {
				include: {
					profile: true,
				},
			},
			comments: {
				include: {
					author: {
						include: {
							profile: true,
						},
					},
					replies: {
						include: {
							author: {
								include: {
									profile: true,
								},
							},
						},
					},
				},
			},
			likes: {
				include: {
					user: {
						include: {
							profile: true,
						},
					},
				},
			},
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	const recommendationIds = await prisma.$queryRaw`SELECT "id" FROM "User" WHERE "id" <> ${locals.user.id} ORDER BY random() LIMIT 5`;

	const recommendations = await prisma.profile.findMany({
		where: {
			user: {
				id: {
					in: recommendationIds.map(({ id }) => id),
				},
				blocks: {
					none: {
						targetId: locals.user.id,
					},
				},
			},
		},
		include: {
			user: {
				include: {
					followers: {
						include: {
							user: {
								include: {
									profile: true,
								},
							},
						},
					},
				},
			},
		},
	});

	return {
		posts,
		recommendations,
	};
};