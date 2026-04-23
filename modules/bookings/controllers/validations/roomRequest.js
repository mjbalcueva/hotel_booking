import * as yup from 'yup';

const validateCreateRoomRequest = (form) => {
	const formShape = {
		room_number: yup.string().required(),
		room_type: yup.string().required(),
		price_per_night: yup.number().required().positive(),
	};

	const schema = yup.object().shape(formShape);
	return schema.validate(form, { abortEarly: false, strict: true });
};

const validateEditRoomRequest = (form) => {
	const formShape = {
		room_number: yup.string(),
		room_type: yup.string(),
		price_per_night: yup.number().positive(),
	};

	const schema = yup.object().shape(formShape);
	return schema.validate(form, { abortEarly: false, strict: true });
};

export { validateCreateRoomRequest, validateEditRoomRequest };
