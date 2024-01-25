import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import prisma from '$lib/server/prisma';

export async function handle({ event, resolve }) {
	event.locals.user = null;

	const token = event.cookies.get('token');
	if (!token) {
		return await resolve(event);
	}

	try {
		const tokenDecoded = jwt.verify(token, JWT_SECRET);
		const userId = tokenDecoded?.userId;

		if (userId) {
			const user = await prisma.user.findFirst({
				where: {
					id: userId,
				},
				include: {
					profile: true,
					account: {
						select: {
							email: true,
						},
					},
				},
			});

			event.locals.user = user;
		}
	} catch (err) { }

	return await resolve(event);
}