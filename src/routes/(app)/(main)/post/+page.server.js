import { fail } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import { parseFormData, validate } from '$lib/server/utils';

/** @type {import('./$types').Actions} */
export const actions = {
	new: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401);
		}

		const body = parseFormData(await request.formData());

		const validation = await validate(body, {
			title: ['required', 'string', 'minLength:3', 'maxLength:64'],
			content: ['required', 'string', 'minLength:3', 'maxLength:4096'],
			image: ['string'],
			topics: ['string', 'maxLength:128'],
		});

		if (validation.error) {
			return fail(400, { message: validation.error });
		}

		const topics = body.topics.split(/,\s*/).filter((s) => s.trim() !== '');

		const post = await prisma.post.create({
			data: {
				title: body.title,
				content: body.content,
				image: body.image || undefined,
				topics: topics,
				authorId: locals.user.id,
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

		return {
			message: 'Post has been successfully created.',
			data: post,
		};
	},

	like: async ({ url, locals }) => {
		if (!locals.user) {
			return fail(401);
		}

		const postId = parseInt(url.searchParams.get('id')) || 0;
		if (!postId) {
			return fail(400);
		}

		let post = await prisma.post.findFirst({
			where: {
				id: postId,
			},
		});

		if (!post) {
			return fail(400);
		}

		const like = await prisma.postLike.findFirst({
			where: {
				postId: post.id,
				userId: locals.user.id,
			},
		});

		if (!like) {
			await prisma.postLike.create({
				data: {
					postId: post.id,
					userId: locals.user.id,
				},
			});

			if (post.authorId !== locals.user.id) {
				await prisma.notification.create({
					data: {
						content: `${locals.user.profile.name} has liked your post.`,
						link: `/post/${post.id}`,
						userId: post.authorId,
					},
				});
			}
		} else {
			await prisma.postLike.delete({
				where: {
					id: like.id,
				},
			});
		}

		post = await prisma.post.findFirst({
			where: {
				id: post.id,
			},
			include: {
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

		return {
			message: `Post has been successfully ${like ? 'unliked' : 'liked'}.`,
			data: post,
		};
	},

	edit: async ({ request, url, locals }) => {
		if (!locals.user) {
			return fail(401);
		}

		const postId = parseInt(url.searchParams.get('id')) || 0;
		if (!postId) {
			return fail(400);
		}

		let post = await prisma.post.findFirst({
			where: {
				id: postId,
				authorId: locals.user.id,
			},
		});

		if (!post) {
			return fail(400);
		}

		const body = parseFormData(await request.formData());

		const validation = await validate(body, {
			title: ['required', 'string', 'minLength:3', 'maxLength:64'],
			content: ['required', 'string', 'minLength:3', 'maxLength:4096'],
			image: ['string'],
			topics: ['string', 'maxLength:128'],
		});

		if (validation.error) {
			return fail(400, { message: validation.error });
		}

		const topics = body.topics.split(/,\s*/).filter((s) => s.trim() !== '');

		post = await prisma.post.update({
			where: {
				id: post.id,
			},
			data: {
				title: body.title,
				content: body.content,
				image: body.image || null,
				topics: topics,
			},
		});

		return {
			message: 'Post has been successfully edited.',
			data: post,
		};
	},

	delete: async ({ url, locals }) => {
		if (!locals.user) {
			return fail(401);
		}

		const postId = parseInt(url.searchParams.get('id')) || 0;
		if (!postId) {
			return fail(400);
		}

		let post = await prisma.post.findFirst({
			where: {
				id: postId,
				authorId: locals.user.id,
			},
		});

		if (!post) {
			return fail(400);
		}

		await prisma.post.delete({
			where: {
				id: post.id,
			},
		});

		return {
			message: 'Post has been successfully deleted.',
			data: post,
		};
	},
};