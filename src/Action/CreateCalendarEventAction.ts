import { type TransformerInterface } from '@dmitryrechkin/foundation-core';
import { type TypeResponse } from '@dmitryrechkin/foundation-core';
import { type TypeCalendarEvent } from '@dmitryrechkin/calendar-core';
import { FromNylasCalendarEventTransformer } from '../Transformer/FromNylasCalendarEventTransformer';
import { ToNylasCalendarEventTransformer } from '../Transformer/ToNylasCalendarEventTransformer';
import { type TypeNylasCalendarEvent } from '../Type/NylasCalendarEvent';
import { type TypeNylasResponse } from '@dmitryrechkin/request-sender-nylas';
import { type RequestSenderInterface } from '@dmitryrechkin/request-sender-core';
import { ResponseHelper } from '@dmitryrechkin/foundation-core';
import { EnumErrorCode } from '../Type/ErrorCode';
import { type CreateCalendarEventActionInterface } from '@dmitryrechkin/calendar-core';

export class CreateCalendarEventAction implements CreateCalendarEventActionInterface
{
	/**
	 * Constructor.
	 *
	 * @param {RequestSenderInterface} requestSender - The request sender to send the request to Nylas.
	 * @param {TransformerInterface<TypeCalendarEvent, TypeNylasCalendarEvent>} toNylasTransformer - The transformer to convert custom event to Nylas event format.
	 * @param {TransformerInterface<TypeNylasCalendarEvent, TypeCalendarEvent>} fromNylasTransformer - The transformer to convert Nylas event response back to custom event format.
	 */
	public constructor(
		// change it to use client
		private requestSender: RequestSenderInterface,
		private toNylasTransformer: TransformerInterface<TypeCalendarEvent, TypeNylasCalendarEvent> = new ToNylasCalendarEventTransformer(),
		private fromNylasTransformer: TransformerInterface<TypeNylasCalendarEvent, TypeCalendarEvent> = new FromNylasCalendarEventTransformer()
	) {}

	/**
	 * Creates a calendar event in Nylas and returns the updated event.
	 *
	 * @param {TypeCalendarEvent} calendarEvent - The custom calendar event object
	 * @returns {Promise<TypeCalendarEvent>} - The updated custom calendar event object with the new ID and details from Nylas
	 */
	public async execute(calendarEvent: TypeCalendarEvent): Promise<TypeResponse<TypeCalendarEvent>>
	{
		const nylasEvent = this.toNylasTransformer.transform(calendarEvent);
		if (!nylasEvent)
		{
			console.error('Failed to transform event to Nylas format');
			return ResponseHelper.createErrorResponse(EnumErrorCode.VALIDATION_ERROR, 'Invalid input');
		}

		const path = `/events?calendar_id=${nylasEvent.calendar_id}`;

		console.log('Creating event at PATH:', path);
		console.log('Creating event:', JSON.stringify(nylasEvent, null, 2));

		const response = await this.requestSender.send(path, {method: 'POST', body: JSON.stringify(nylasEvent)});
		if (!response.ok)
		{
			console.error(`Failed to create event: ${response.statusText}`);
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

		const result = responseJson as TypeNylasResponse<TypeNylasCalendarEvent>;
		const data = this.fromNylasTransformer.transform(result.data) as TypeCalendarEvent;
		if (!data)
		{
			console.error('Failed to transform event from Nylas format');
			return ResponseHelper.createErrorResponse(EnumErrorCode.TRANSFORMATION_ERROR, 'Failed to transform data');
		}

		console.log('Created event:', JSON.stringify(result, null, 2));

		return {
			success: true,
			data
		};
	}
}
