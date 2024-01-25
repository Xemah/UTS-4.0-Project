import { writable } from 'svelte/store';
import type { LocalUser } from '../app';

export const title = writable<string>('');
export const heading = writable<string>('');
export const user = writable<LocalUser | null>(null);
export const hydrated = writable<boolean>(false);