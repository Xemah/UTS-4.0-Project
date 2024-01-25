import { error } from '@sveltejs/kit';
import { event } from 'sveltekit-sse';
import prisma from '$lib/server/prisma';

function delay(milliseconds){
	return new Promise(function run(r){
		setTimeout(r, milliseconds);
	});
}

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ locals }) => {
	if (!locals.user) {
		return error(401);
	}

	let requestTime = new Date();
	let lastNotificationId = 0;

	return event(async function run(emit) {
		// eslint-disable-next-line no-constant-condition
		while (true) {
			const notifications = await prisma.notification.findMany({
				where: {
					id: {
						gt: lastNotificationId,
					},
					createdAt: {
						gte: requestTime,
					},
					isRead: false,
					userId: locals.user.id,
				},
			});

			if (notifications.length > 0) {
				lastNotificationId = notifications[notifications.length - 1].id;
				emit(JSON.stringify(notifications));
			}

			await delay(3000);
		}
	}).toResponse();
};