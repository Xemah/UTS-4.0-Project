import { randomBytes } from 'crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import type { User } from '@prisma/client';
import { fileTypeFromBuffer, type FileTypeResult } from 'file-type';
import { S3_ACCESS_KEY_ID, S3_FORCE_PATH_STYLE, S3_SECRET_ACCESS_KEY } from '$env/static/private';
import { PUBLIC_S3_BUCKET, PUBLIC_S3_ENDPOINT, PUBLIC_S3_REGION } from '$env/static/public';

const s3Client = new S3Client({
	endpoint: PUBLIC_S3_ENDPOINT,
	region: PUBLIC_S3_REGION,
	forcePathStyle: S3_FORCE_PATH_STYLE === 'true',
	credentials: {
		accessKeyId: S3_ACCESS_KEY_ID,
		secretAccessKey: S3_SECRET_ACCESS_KEY,
	},
});

const upload = async (buffer: Buffer, dir: string, filename: string) => {
	const { mime } = await fileTypeFromBuffer(buffer) as FileTypeResult;

	const command = new PutObjectCommand({
		Bucket: PUBLIC_S3_BUCKET,
		Key: `${dir}/${filename}`,
		Body: buffer,
		ContentType: mime,
		ACL: 'public-read',
	});

	await s3Client.send(command);

	return {
		filename,
	};
};

type ConfigObject = {
	dir: string;
	limit: number;
	types: string[];
	auth: (user: User & {[key: string]: any} | null, data?: any) => Promise<boolean>;
	upload: (buffer: Buffer, filename: string) => Promise<{ filename: string }>;
}

type UploadersConfig = {
	[key: string]: ConfigObject;
};

export const configs: UploadersConfig = {
	avatars: {
		dir: 'avatars',
		limit: 16 * 1024 * 1024,
		types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],

		auth: async function (user) {
			return Boolean(user);
		},

		upload: async function (buffer, filename) {
			const newFilename = `${randomBytes(16).toString('hex')}.${filename.split('.').pop()}`;
			return await upload(buffer, this.dir, newFilename);
		},
	},

	backgrounds: {
		dir: 'backgrounds',
		limit: 16 * 1024 * 1024,
		types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],

		auth: async function (user) {
			return Boolean(user);
		},

		upload: async function (buffer, filename) {
			const newFilename = `${randomBytes(16).toString('hex')}.${filename.split('.').pop()}`;
			return await upload(buffer, this.dir, newFilename);
		},
	},

	posts: {
		dir: 'posts',
		limit: 16 * 1024 * 1024,
		types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],

		auth: async function (user) {
			return Boolean(user);
		},

		upload: async function (buffer, filename) {
			const newFilename = `${randomBytes(16).toString('hex')}.${filename.split('.').pop()}`;
			return await upload(buffer, this.dir, newFilename);
		},
	},
};