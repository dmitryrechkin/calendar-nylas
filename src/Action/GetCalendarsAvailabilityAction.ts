import { type TypeResponse } from '@dmitryrechkin/foundation-core';
import { type TransformerInterface } from '@dmitryrechkin/foundation-core';
import { type TypeCalendarAvailability, type TypeCalendarAvailabilityInfo } from '@dmitryrechkin/calendar-core';
import { type TypeNylasCalendarAvailability, type TypeNylasCalendarAvailabilityInfo } from '../Type/NylasCalendarAvailability';
import { type RequestSenderInterface } from '@dmitryrechkin/request-sender-core';
import { ResponseHelper } from '@dmitryrechkin/foundation-core';
import { EnumErrorCode } from '../Type/ErrorCode';
import { ToNylasCalendarAvailabilityTransformer } from '../Transformer/ToNylasCalendarAvailabilityTransformer';
import { FromNylasCalendarAvailabilityInfoTransformer } from '../Transformer/FromNylasCalendarAvailabilityInfoTransformer';
import { type GetCalendarsAvailabilityActionInterface } from '@dmitryrechkin/calendar-core';
import type { TypeNylasResponse } from '@dmitryrechkin/request-sender-nylas';

export class GetCalendarsAvailabilityAction implements GetCalendarsAvailabilityActionInterface
{
	/**
	 * Constructor.
	 *
	 * @param {RequestSenderInterface} requestSender - The request sender to send the request to Nylas.
	 * @param {TransformerInterface<TypeCalendarAvailability, TypeNylasCalendarAvailability>} toNylasTransformer - The transformer to convert custom calendar availability to Nylas calendar availability format.
	 * @param {TransformerInterface<TypeNylasCalendarAvailabilityInfo, TypeCalendarAvailabilityInfo>} fromNylasTransformer - The transformer to convert Nylas calendar availability info to custom calendar availability info format.
	 */
	public constructor(
		private requestSender: RequestSenderInterface,
		private toNylasTransformer: TransformerInterface<TypeCalendarAvailability, TypeNylasCalendarAvailability> = new ToNylasCalendarAvailabilityTransformer(),
		private fromNylasTransformer: TransformerInterface<TypeNylasCalendarAvailabilityInfo, TypeCalendarAvailabilityInfo> = new FromNylasCalendarAvailabilityInfoTransformer()
	) {}

	/**
	 * Fetches the list of available time slots from Nylas for the given calendar availability.
	 *
	 * @param {TypeCalendarAvailability} payload - The calendar availability object
	 * @returns {Promise<TypeResponse<TypeCalendar[]>>} - The list of calendars
	 */
	public async execute(payload: TypeCalendarAvailability): Promise<TypeResponse<TypeCalendarAvailabilityInfo>>
	{
		const nylasInput = this.toNylasTransformer.transform(payload);
		if (!nylasInput)
		{
			console.error('Failed to transform data to Nylas format');
			return ResponseHelper.createErrorResponse(EnumErrorCode.VALIDATION_ERROR, 'Invalid input');
		}

		const path = '/calendars/availability';

		console.log('Fetching calendars availability from PATH:', path);
		console.log('Checking calendars availability:', nylasInput);

		const response = await this.requestSender.send(path, { method: 'POST', body: JSON.stringify(nylasInput) }, false);
		if (!response.ok)
		{
			console.error(`Failed to fetch calendars availability: ${response.statusText}`);
			return ResponseHelper.createErrorResponse(EnumErrorCode.REQUEST_FAILED, response.statusText);
		}

		const responseJson = await response.json().catch((error) =>
		{
			console.error('Failed to parse response:', error);
			return undefined;
		});
		if (!responseJson)
		{
			console.error('Failed to parse response');
			return ResponseHelper.createErrorResponse(EnumErrorCode.PARSE_ERROR, 'Failed to parse response');
		}

		console.log('Response:', JSON.stringify(responseJson, null, 2));

		const result = responseJson as TypeNylasResponse<TypeNylasCalendarAvailabilityInfo>;
		const data = this.fromNylasTransformer.transform(result.data);
		if (!data)
		{
			console.error('Failed to transform response from Nylas format');
			return ResponseHelper.createErrorResponse(EnumErrorCode.TRANSFORMATION_ERROR, 'Failed to transform data');
		}

		console.log('Calendars availability:', JSON.stringify(result, null, 2));

		return {
			success: true,
			data
		};
	}
}
