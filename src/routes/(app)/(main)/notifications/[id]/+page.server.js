import { error, redirect } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params, locals }) => {
	if (!locals.user) {
		return error(404);
	}

	const notificationId = parseInt(params.id) || 0;
	if (!notificationId) {
		return error(404);
	}

	const notification = await prisma.notification.findFirst({
		where: {
			id: notificationId,
			userId: locals.user.id,
		},
	});

	if (!notification) {
		return error(404);
	}

	await prisma.notification.update({
		where: {
			id: notification.id,
		},
		data: {
			isRead: true,
		},
	});

	return redirect(302, notification.link);
};