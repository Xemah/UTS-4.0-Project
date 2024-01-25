<script lang="ts">
	import axios from 'axios';
	import { createEventDispatcher } from 'svelte';
	import { toast } from 'svelte-sonner';

	const dipatch = createEventDispatcher();

	type $$Props = {
		name: string;
		endpoint: string;
		value?: string | string[];
		accept?: string;
		multiple?: boolean;
		renderInput?: boolean;
	};

	export let name: $$Props['name'];
	export let endpoint: $$Props['endpoint'];
	export let value: $$Props['value'] = undefined;
	export let accept: $$Props['accept'] = undefined;
	export let multiple: $$Props['multiple'] = false;
	export let renderInput: $$Props['renderInput'] = true;

	let input: HTMLInputElement;
	let files: FileList | null;

	type FileResult = {
		status: 'uploading' | 'uploaded';
		name: string;
	}

	let data: FileResult[] = [];
	if (value) {
		if (multiple && Array.isArray(value)) {
			data = value.filter(Boolean).map((file) => ({
				status: 'uploaded',
				name: file,
			}));
		} else {
			data = [{
				status: 'uploaded',
				name: value as string,
			}];
		}
	}

	let isBusy = false;

	const process = async () => {
		if (!files || files.length === 0) {
			return;
		}

		if (!multiple && isBusy) {
			return;
		}

		isBusy = true;

		if (multiple) {
			for (let i = 0; i < files.length; i++) {
				const file = files.item(i) as File;

				const idx = data.length;
				data[idx] = {
					status: 'uploading',
					name: file.name,
				};

				const { name, error } = await upload(file);
				if (error) {
					data.splice(idx, 1);
					data = data;
					dipatch('error', { file, error });
				} else {
					data[idx].status = 'uploaded';
					data[idx].name = name;
					dipatch('upload', { file, name });
				}
			}

		} else {
			const oldValue = data.length > 0 ? data[0].name : null;
			const file = files.item(0) as File;

			data = [{
				status: 'uploading',
				name: file.name,
			}];

			const { name, error } = await upload(file);
			if (error) {
				data = oldValue ? [{
					status: 'uploaded',
					name: oldValue,
				}] : [];
				dipatch('error', { file, error });

			} else {
				data[0].status = 'uploaded';
				data[0].name = name;
				dipatch('upload', { file, name });
			}
		}

		isBusy = false;
		files = null;
		input.value = '';
	};

	const upload = async (file: File) => {
		let res = await axios.get(endpoint, {
			params: {
				name: file.name,
				size: file.size,
				type: file.type,
			},
			validateStatus: null,
		});

		if (res.status < 200 || res.status > 299) {
			const error = res?.data?.message || 'An error occured while uploading the file.';
			toast.error(`Could not upload ${file.name}: ${error}`);
			return { error };
		}

		const formData = new FormData();
		formData.append('file', file);

		res = await axios.post(endpoint, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			validateStatus: null,
		});

		if (res.status < 200 || res.status > 299) {
			const error = res?.data?.message || 'An error occured while uploading the file.';
			toast.error(`Could not upload ${file.name}: ${error}`);
			return { error };
		}

		return { name: res.data.name };
	};

	const select = () => {
		input.click();
	};

	const remove = (idx = null) => {
		if (!multiple || idx === null) {
			data = [];
			dipatch('remove');
		} else {
			data.splice(idx, 1);
			data = data;
			dipatch('remove');
		}
	};
</script>

<slot
	select={select}
	remove={remove}
	files={data}
	busy={isBusy}
/>

<input
	type="file"
	class="hidden"
	multiple={multiple}
	accept={accept}
	bind:this={input}
	bind:files
	on:change={process}
/>

{#if renderInput}
	{#if multiple}
		{#each data as file}
			<input
				type="hidden"
				name={`${name}[]`}
				value={file.name}
			/>
		{/each}
	{:else}
		{#if data.length > 0}
			<input
				type="hidden"
				name={name}
				value={data[0]?.name || undefined}
			/>
		{/if}
	{/if}
{/if}