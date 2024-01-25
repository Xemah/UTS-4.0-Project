import type { Prisma } from '@prisma/client';

export type LocalUser = Prisma.UserGetPayload<{
	include: {
		profile: true,
		account: {
			select: {
				email: true,
			},
		},
	},
}>

declare global {
	namespace App {
		interface Locals {
			user: LocalUser | null;
		}
		// interface Error {}
		// interface PageData {}
		// interface Platform {}
	}
}