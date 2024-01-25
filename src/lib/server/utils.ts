import { Validator } from 'node-input-validator';
import { parseFormData as _parseFormData } from 'parse-nested-form-data';

export const validate = async (
	data: Record<string, any>,
	rules: Record<string, any>[],
	customMessages: Record<string, any> = {},
) => {
	if (data instanceof FormData) {
		data = Object.fromEntries(data);
	}

	customMessages = Object.assign({
		required: 'The :attribute field is required.',
	}, customMessages);

	const validation = new Validator(data, rules, customMessages);
	await validation.check();

	const errors: {
		message: string;
		rule: string;
	}[] = validation.errors;

	return {
		inputs: validation.inputs,
		errors,
		error: Object.values(errors)[0]?.message,
	};
};

export const parseFormData = (formData: FormData): Record<string, any> => {
	const normalizedFormData = new FormData();

	for (const [path, value] of formData.entries()) {
		if (!(/^[\w]+\[\d*\]$/.test(path))) {
			normalizedFormData.delete(path);
			normalizedFormData.delete(path.startsWith('+') ? path.slice(1) : `+${path}`);
			normalizedFormData.delete(path.startsWith('-') ? path.slice(1) : `-${path}`);
			normalizedFormData.delete(path.startsWith('&') ? path.slice(1) : `&${path}`);
		}

		normalizedFormData.append(path, value);
	}

	return _parseFormData(normalizedFormData);
};