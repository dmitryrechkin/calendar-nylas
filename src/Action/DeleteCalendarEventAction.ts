import { type TypeResponse, ResponseHelper } from '@dmitryrechkin/foundation-core';
import { type RequestSenderInterface } from '@dmitryrechkin/request-sender-core';
import { EnumErrorCode } from '../Type/ErrorCode';
import { type TypeCalendarEventId } from '@dmitryrechkin/calendar-core';
import { type DeleteCalendarEventActionInterface } from '@dmitryrechkin/calendar-core';

export class DeleteCalendarEventAction implements DeleteCalendarEventActionInterface
{
	/**
	 * Constructor.
	 *
	 * @param {RequestSenderInterface} requestSender - The request sender to send the request to Nylas.
	 */
	public constructor(private requestSender: RequestSenderInterface) {}

	/**
	 * Deletes a calendar event in Nylas.
	 *
	 * @param {TypeCalendarEventId} paylaod - The event and calendar ID of the event to be deleted.
	 * @returns {Promise<TypeResponse<undefined>>} - A response indicating the success or failure of the deletion.
	 */
	public async execute(payload: TypeCalendarEventId): Promise<TypeResponse<undefined>>
	{
		const { eventId, calendarId } = payload;

		if (!eventId || !calendarId)
		{
			console.error('Event ID or Calendar ID is missing');
			return ResponseHelper.createErrorResponse(EnumErrorCode.VALIDATION_ERROR, 'Event ID and Calendar ID are required');
		}

		const path = `/events/${eventId}?calendar_id=${calendarId}`;

		console.log('Deleting event at PATH:', path);

		const response = await this.requestSender.send(path, { method: 'DELETE' });

		if (!response.ok)
		{
			console.error(`Failed to delete event: ${response.statusText}`);
			return ResponseHelper.createErrorResponse(EnumErrorCode.REQUEST_FAILED, response.statusText);
		}

		console.log(`Successfully deleted event with ID: ${eventId}`);

		return {
			success: true
		};
	}
}
