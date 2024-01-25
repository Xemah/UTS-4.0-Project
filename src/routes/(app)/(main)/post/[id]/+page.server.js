import { error } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params, locals }) => {
	const postId = parseInt(params.id) || 0;
	if (!postId) {
		return error(404);
	}

	const post = await prisma.post.findFirst({
		where: {
			id: postId,
			author: {
				blocks: {
					none: {
						targetId: locals.user.id,
					},
				},
			},
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
	});

	if (!post) {
		return error(404);
	}

	return {
		post,
	};
};