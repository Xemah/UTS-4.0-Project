import { type ClassValue, clsx } from 'clsx';
import sanitizeHtml from 'sanitize-html';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { twMerge } from 'tailwind-merge';
import { PUBLIC_S3_URL } from '$env/static/public';

export const cn = (...inputs: ClassValue[]): string => {
	return twMerge(clsx(inputs));
};

type FlyAndScaleParams = {
    y?: number;
    x?: number;
    start?: number;
    duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 },
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (
		valueA: number,
		scaleA: [number, number],
		scaleB: [number, number],
	) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (
		style: Record<string, number | string | undefined>,
	): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t,
			});
		},
		easing: cubicOut,
	};
};

export const getS3Url = (folder: string, file: string) => {
	return `${PUBLIC_S3_URL}/${folder}/${file}`;
};

export const deepMerge = (a: any, b: any) => {
	const mergedObject = { ...a };

	for (const key in b) {
		// eslint-disable-next-line no-prototype-builtins
		if (b.hasOwnProperty(key)) {
			if (isPlainObject(a[key]) && isPlainObject(b[key])) {
				mergedObject[key] = deepMerge(a[key], b[key]);
			} else {
				mergedObject[key] = b[key];
			}
		}
	}

	return mergedObject;
};

const isPlainObject = (item: any) => {
	return (item && typeof item === 'object' && !Array.isArray(item) && !(item instanceof Date));
};

export const sanitize = (content: string) => {
	let sanitizedContent = sanitizeHtml(content, {
		allowedTags: [],
		disallowedTagsMode: 'escape',
	});

	sanitizedContent = sanitizedContent.replace(/(?:\r\n|\r|\n)/g, '<br>');
	return sanitizedContent;
};