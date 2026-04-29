import moment from 'moment';
import * as yup from 'yup';

const isValidUtcDate = (value) =>
	moment.utc(value, 'YYYY-MM-DD', true).isValid();

const validateCreateBookingRequest = (form) => {
	const formShape = {
		guest_id: yup.number().integer().positive().required(),
		room_id: yup.number().integer().positive().required(),
		check_in_date: yup
			.string()
			.required()
			.test('valid-check-in-date', 'Invalid check-in date', isValidUtcDate),
		check_out_date: yup
			.string()
			.required()
			.test('valid-check-out-date', 'Invalid check-out date', isValidUtcDate)
			.test(
				'after-check-in-date',
				'Check-out date must be after check-in date',
				(value, context) => {
					if (!value || !context.parent.check_in_date) return false;
					const checkInDate = moment.utc(
						context.parent.check_in_date,
						'YYYY-MM-DD',
						true,
					);
					const checkOutDate = moment.utc(value, 'YYYY-MM-DD', true);

					return (
						checkInDate.isValid() &&
						checkOutDate.isValid() &&
						checkOutDate.isAfter(checkInDate, 'day')
					);
				},
			),
	};

	const schema = yup.object().shape(formShape);
	return schema.validate(form, { abortEarly: false, strict: true });
};

const validateEditBookingRequest = (form) => {
	const formShape = {
		status: yup
			.string()
			.oneOf(['pending', 'confirmed', 'cancelled'])
			.required(),
	};

	const schema = yup.object().shape(formShape);
	return schema.validate(form, { abortEarly: false, strict: true });
};

export { validateCreateBookingRequest, validateEditBookingRequest };
