import { redirect } from '@sveltejs/kit';

export const load = async () => {
	return redirect(300, '/');
};

export const actions = {
	default: ({ cookies }) => {
		cookies.set('token', '', {
			path: '/',
			expires: new Date(0),
		});

		return { message: 'You have been successfully signed out.' };
	},
};