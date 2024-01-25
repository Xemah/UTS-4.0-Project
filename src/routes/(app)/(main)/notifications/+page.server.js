import { redirect } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/sign-in');
	}

	const notifications = await prisma.notification.findMany({
		where: {
			userId: locals.user.id,
		},
		orderBy: [
			{
				isRead: 'asc',
			},
			{
				createdAt: 'desc',
			},
		],
	});

	return {
		notifications,
	};
};