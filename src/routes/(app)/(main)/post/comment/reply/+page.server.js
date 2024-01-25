import { fail } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import { parseFormData, validate } from '$lib/server/utils';

/** @type {import('./$types').Actions} */
export const actions = {
	new: async ({ request, url, locals }) => {
		if (!locals.user) {
			return fail(401);
		}

		const commentId = parseInt(url.searchParams.get('comment')) || 0;
		if (!commentId) {
			return fail(400);
		}

		let comment = await prisma.postComment.findFirst({
			where: {
				id: commentId,
			},
			include: {
				post: true,
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

		const reply = await prisma.postCommentReply.create({
			data: {
				content: body.content,
				commentId: comment.id,
				authorId: locals.user.id,
			},
			include: {
				author: {
					include: {
						profile: true,
					},
				},
			},
		});

		if (comment.authorId !== locals.user.id) {
			await prisma.notification.create({
				data: {
					content: `${locals.user.profile.name} has replied to your comment.`,
					link: `/post/${comment.postId}`,
					userId: comment.authorId,
				},
			});
		}

		return {
			message: 'Reply has been successfully created.',
			data: reply,
		};
	},

	edit: async ({ request, url, locals }) => {
		if (!locals.user) {
			return fail(401);
		}

		const replyId = parseInt(url.searchParams.get('id')) || 0;
		if (!replyId) {
			return fail(400);
		}

		let reply = await prisma.postCommentReply.findFirst({
			where: {
				id: replyId,
				authorId: locals.user.id,
			},
		});

		if (!reply) {
			return fail(400);
		}

		const body = parseFormData(await request.formData());

		const validation = await validate(body, {
			content: ['required', 'string', 'minLength:3', 'maxLength:4096'],
		});

		if (validation.error) {
			return fail(400, { message: validation.error });
		}

		reply = await prisma.postCommentReply.update({
			where: {
				id: reply.id,
			},
			data: {
				content: body.content,
			},
		});

		return {
			message: 'Reply has been successfully edited.',
			data: reply,
		};
	},

	delete: async ({ url, locals }) => {
		if (!locals.user) {
			return fail(401);
		}

		const replyId = parseInt(url.searchParams.get('id')) || 0;
		if (!replyId) {
			return fail(400);
		}

		let reply = await prisma.postCommentReply.findFirst({
			where: {
				id: replyId,
				authorId: locals.user.id,
			},
		});

		if (!reply) {
			return fail(400);
		}

		await prisma.postCommentReply.delete({
			where: {
				id: reply.id,
			},
		});

		return {
			message: 'Reply has been successfully deleted.',
			data: reply,
		};
	},
};