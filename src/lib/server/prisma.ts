import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

const prisma = new PrismaClient();

// .$extends({
// model: {
// 	// $allModels: {
// 	// 	async toPlainObject<T>(this: T): Promise<T> {
// 	// 		const plainObject = { };
// 	// 		Object.getOwnPropertyNames(this).forEach((key) => {
// 	// 			plainObject[key] = this[key];
// 	// 		});

// 	// 		return plainObject as T;
// 	// 	},
// 	// },
// },
// result: {
// 	user: {
// format: {
// 	needs: { },
// 	compute(user) {
// 		return () => {
// 			return populateUser(user);
// 		};
// 	},
// },
// 		test: {
// 			needs: {  },
// 			async compute() {
// 				return await new Promise((resolve) => {
// 					setTimeout(() => {
// 						resolve('TEST AFTER TIMEOUT');
// 					}, 2000);
// 				});
// 			},
// 		},
// 	},
// },
// });

export default prisma;