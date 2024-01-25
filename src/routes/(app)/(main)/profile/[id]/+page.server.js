import { error, fail } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params, locals }) => {
	const profileId = parseInt(params.id) || 0;
	if (!profileId) {
		return error(404);
	}

	const profile = await prisma.profile.findFirst({
		where: {
			user: {
				id: profileId,
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
					followings: {
						include: {
							target: {
								include: {
									profile: true,
								},
							},
						},
					},
					blocks: {
						where: {
							targetId: locals.user?.id || 0,
						},
						include: {
							target: {
								include: {
									profile: true,
								},
							},
						},
					},
					blockedBy: {
						where: {
							userId: locals.user?.id || 0,
						},
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

	if (!profile) {
		return error(404);
	}

	const posts = await prisma.post.findMany({
		where: {
			authorId: profile.user.id,
			author: {
				blocks: {
					none: {
						targetId: locals.user?.id || 0,
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
		orderBy: {
			createdAt: 'desc',
		},
	});

	return {
		profile,
		posts,
	};
};

/** @type {import('./$types').Actions} */
export const actions = {
	follow: async ({ params, locals }) => {
		if (!locals.user) {
			return error(401);
		}

		const profileId = parseInt(params.id) || 0;
		if (!profileId) {
			return error(404);
		}

		if (profileId === locals.user.id) {
			return error(400);
		}

		let profile = await prisma.profile.findFirst({
			where: {
				user: {
					id: profileId,
					blocks: {
						none: {
							targetId: locals.user.id,
						},
					},

				},
			},
			include: {
				user: true,
			},
		});

		if (!profile) {
			return fail(400);
		}

		const follow = await prisma.follow.findFirst({
			where: {
				userId: locals.user.id,
				targetId: profile.user.id,
			},
		});

		if (!follow) {
			await prisma.follow.create({
				data: {
					userId: locals.user.id,
					targetId: profile.user.id,
				},
			});

			if (profile.user.id !== locals.user.id) {
				await prisma.notification.create({
					data: {
						userId: profile.user.id,
						link: `/profile/${profile.user.id}`,
						content: `${locals.user.profile.name} has followed you.`,
					},
				});
			}

		} else {
			await prisma.follow.delete({
				where: {
					id: follow.id,
				},
			});
		}

		profile = await prisma.profile.findFirst({
			where: {
				userId: profile.user.id,
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
			message: `User has been successfully ${follow ? 'unfollowed' : 'followed'}.`,
			data: profile,
		};
	},

	block: async ({ params, locals }) => {
		if (!locals.user) {
			return error(401);
		}

		const profileId = parseInt(params.id) || 0;
		if (!profileId) {
			return error(404);
		}

		let profile = await prisma.profile.findFirst({
			where: {
				user: {
					id: profileId,
				},
			},
			include: {
				user: true,
			},
		});

		if (!profile) {
			return fail(400);
		}

		const block = await prisma.block.findFirst({
			where: {
				userId: locals.user.id,
				targetId: profile.user.id,
			},
		});

		if (!block) {
			await prisma.block.create({
				data: {
					userId: locals.user.id,
					targetId: profile.user.id,
				},
			});
		} else {
			await prisma.block.delete({
				where: {
					id: block.id,
				},
			});
		}

		profile = await prisma.profile.findFirst({
			where: {
				userId: profile.user.id,
			},
			include: {
				user: {
					include: {
						blockedBy: {
							where: {
								userId: locals.user.id,
							},
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
			message: `User has been successfully ${block ? 'unblocked' : 'blocked'}.`,
			data: profile,
		};
	},
};