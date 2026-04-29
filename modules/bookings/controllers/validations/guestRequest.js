import * as yup from 'yup';

const validateCreateGuestRequest = (form) => {
	const formShape = {
		first_name: yup.string().required(),
		last_name: yup.string().required(),
		email: yup.string().email().required(),
		phone: yup.string().required(),
	};

	const schema = yup.object().shape(formShape);
	return schema.validate(form, { abortEarly: false, strict: true });
};

export { validateCreateGuestRequest };
