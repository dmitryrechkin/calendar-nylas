import type { TypeResponse } from '@dmitryrechkin/foundation-core';
import type { TransformerInterface } from '@dmitryrechkin/foundation-core';
import type {  TypeCalendarAvailabilityTimeSlot } from '@dmitryrechkin/calendar-core';
import type { TypeNylasCalendarEvent } from '../Type/NylasCalendarEvent';
import type { TypeNylasResponse } from '@dmitryrechkin/request-sender-nylas';
import type { RequestSenderInterface } from '@dmitryrechkin/request-sender-core';
import { ResponseHelper } from '@dmitryrechkin/foundation-core';
import { EnumErrorCode } from '../Type/ErrorCode';
import { FromNylasCalendarEventTransformer } from '../Transformer/FromNylasCalendarEventTransformer';
import { type GetCalendarEventsActionInterface } from '@dmitryrechkin/calendar-core';
import type { TypeCalendarEvent } from '@dmitryrechkin/calendar-core';

export class GetCalendarEventsAction implements GetCalendarEventsActionInterface
{
	/**
	 * Constructor.
	 *
	 * @param {RequestSenderInterface} requestSender - The request sender to send the request to Nylas.
	 * @param {TransformerInterface<TypeNylasCalendarEvent, TypeCalendarEvent>} transformer - The transformer to convert Nylas event to custom event format.
	 */
	public constructor(
		private requestSender: RequestSenderInterface,
		private transformer: TransformerInterface<TypeNylasCalendarEvent, TypeCalendarEvent> = new FromNylasCalendarEventTransformer()
	) {}

	/**
	 * Fetches the list of events from Nylas for a specific calendar within a given time range.
	 *
	 * @param {TypeCalendarAvailabilityTimeSlot} calendarTimeSlot - The time slot to fetch events for
	 * @returns {Promise<TypeResponse<TypeCalendarEvent[]>>} - The list of calendar events
	 */
	public async execute(calendarTimeSlot: TypeCalendarAvailabilityTimeSlot): Promise<TypeResponse<TypeCalendarEvent[]>>
	{
		if (!calendarTimeSlot.calendarId || !calendarTimeSlot.startTime || !calendarTimeSlot.endTime)
		{
			console.error('Calendar ID, Start Time, or End Time is missing');
			return ResponseHelper.createErrorResponse(EnumErrorCode.VALIDATION_ERROR, 'Calendar ID, Start Time, and End Time are required');
		}

		const path = `/events?calendar_id=${calendarTimeSlot.calendarId}&start=${calendarTimeSlot.startTime}&end=${calendarTimeSlot.endTime}`;

		console.log('Fetching events from PATH:', path);

		const response = await this.requestSender.send(path, { method: 'GET' });
		if (!response.ok)
		{
			console.error(`Failed to fetch events: ${response.statusText}`, response);
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

		const result = responseJson as TypeNylasResponse<TypeNylasCalendarEvent[]>;
		const events = result.data?.map(event => this.transformer.transform(event))
			.filter(event => event !== undefined) as TypeCalendarEvent[];

		if (!events.length)
		{
			console.error('No events found or failed to transform events');
			return ResponseHelper.createErrorResponse(EnumErrorCode.TRANSFORMATION_ERROR, 'Failed to transform data');
		}

		return {
			success: true,
			data: events
		};
	}
}
