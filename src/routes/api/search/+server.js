import { error, json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ url }) => {
	const query = url.searchParams.get('query');
	if (!query || query.trim() === '') {
		return error(400);
	}

	const profiles = await prisma.profile.findMany({
		where: {
			name: {
				contains: query,
			},
		},
		include: {
			user: true,
		},
		take: 5,
	});

	return json(profiles);
};