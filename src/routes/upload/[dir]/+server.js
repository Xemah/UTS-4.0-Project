import { error, fail, json } from '@sveltejs/kit';
import { configs } from '$lib/server/storage';
import { parseFormData, validate } from '$lib/server/utils';

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ url, params, locals }) => {
	if (!(params.dir in configs)) {
		throw error(404);
	}

	const uploader = configs[params.dir];

	if (!await uploader.auth(locals.user)) {
		throw error(401);
	}

	const body = {
		name: url.searchParams.get('name'),
		size: url.searchParams.get('size'),
		type: url.searchParams.get('type'),
	};

	const validation = await validate(body, {
		name: ['required'],
		size: ['required', 'integer'],
		type: ['required'],
	});

	if (validation.error) {
		throw error(400, { message: validation.error });
	}

	const size = parseInt(body.size, 10) || Math.max();
	if (size >= uploader.limit) {
		throw error(400, { message: `Maximum ${uploader.limit / (1024 * 1024)} MB is allowed.` });
	}

	if (!uploader.types.includes(body.type)) {
		throw error(400, { message: 'Invalid file type.' });
	}

	return json(true);
};

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request, params, locals }) => {
	if (!(params.dir in configs)) {
		return fail(404);
	}

	const uploader = configs[params.dir];

	if (!await uploader.auth(locals.user)) {
		return fail(401);
	}

	const body = parseFormData(await request.formData());

	const validation = await validate(body, {
		file: ['required'],
	});

	if (validation.error) {
		return fail(404, { message: validation.error });
	}

	/** @type {File} */
	const file = body.file;

	if (file.size >= uploader.limit) {
		return fail(400, { message: `Maximum ${uploader.limit / (1024 * 1024)} MB is allowed.` });
	}

	if (!uploader.types.includes(file.type)) {
		return fail(400, { message: 'Invalid file type.' });
	}

	const buffer = Buffer.from(await file.arrayBuffer());
	const { filename, error: uploadErr } = await uploader.upload(buffer, file.name);

	if (uploadErr) {
		return fail(400, { message: 'An error occured while uploading the file.' });
	}

	return json({
		name: filename,
	});
};