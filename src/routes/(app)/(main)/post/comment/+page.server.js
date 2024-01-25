import { fail } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import { parseFormData, validate } from '$lib/server/utils';

/** @type {import('./$types').Actions} */
export const actions = {
	new: async ({ request, url, locals }) => {
		if (!locals.user) {
			return fail(401);
		}

		const postId = parseInt(url.searchParams.get('post')) || 0;
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

		const body = parseFormData(await request.formData());

		const validation = await validate(body, {
			content: ['required', 'string', 'minLength:3', 'maxLength:4096'],
		});

		if (validation.error) {
			return fail(400, { message: validation.error });
		}

		const comment = await prisma.postComment.create({
			data: {
				content: body.content,
				postId: post.id,
				authorId: locals.user.id,
			},
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
		});

		if (post.authorId !== locals.user.id) {
			await prisma.notification.create({
				data: {
					content: `${locals.user.profile.name} has commented on your post.`,
					link: `/post/${post.id}`,
					userId: post.authorId,
				},
			});
		}

		return {
			message: 'Comment has been successfully created.',
			data: comment,
		};
	},

	edit: async ({ request, url, locals }) => {
		if (!locals.user) {
			return fail(401);
		}

		const commentId = parseInt(url.searchParams.get('id')) || 0;
		if (!commentId) {
			return fail(400);
		}

		let comment = await prisma.postComment.findFirst({
			where: {
				id: commentId,
				authorId: locals.user.id,
			},
		});

		if (!comment) {
			return fail(400);
		}

		const body = parseFormData(await request.formData());

		const validation = await validate(body, {
			content: ['required', 'string', 'minLength:3', 'maxLength:4096'],
		});

		if (validation.error) {
			return fail(400, { message: validation.error });
		}

		comment = await prisma.postComment.update({
			where: {
				id: comment.id,
			},
			data: {
				content: body.content,
			},
		});

		return {
			message: 'Comment has been successfully edited.',
			data: comment,
		};
	},

	delete: async ({ url, locals }) => {
		if (!locals.user) {
			return fail(401);
		}

		const commentId = parseInt(url.searchParams.get('id')) || 0;
		if (!commentId) {
			return fail(400);
		}

		let comment = await prisma.postComment.findFirst({
			where: {
				id: commentId,
				authorId: locals.user.id,
			},
		});

		if (!comment) {
			return fail(400);
		}

		await prisma.postComment.delete({
			where: {
				id: comment.id,
			},
		});

		return {
			message: 'Comment has been successfully deleted.',
			data: comment,
		};
	},
};