import { type TypeResponse } from '@dmitryrechkin/foundation-core';
import { type TransformerInterface } from '@dmitryrechkin/foundation-core';
import { type TypeCalendar, type TypeCalendarNames } from '@dmitryrechkin/calendar-core';
import { type TypeNylasCalendar } from '../Type/NylasCalendar';
import { type TypeNylasResponse } from '@dmitryrechkin/request-sender-nylas';
import { type RequestSenderInterface } from '@dmitryrechkin/request-sender-core';
import { ResponseHelper } from '@dmitryrechkin/foundation-core';
import { EnumErrorCode } from '../Type/ErrorCode';
import { FromNylasCalendarTransformer } from '../Transformer/FromNylasCalendarTransformer';
import { type GetCalendarsActionInterface } from '@dmitryrechkin/calendar-core';

export class GetCalendarsAction implements GetCalendarsActionInterface
{
	/**
	 * Constructor.
	 *
	 * @param {RequestSenderInterface} requestSender - The request sender to send the request to Nylas.
	 * @param {TransformerInterface<TypeNylasCalendar, TypeCalendar>} transformer - The transformer to convert Nylas calendar to custom calendar format.
	 */
	public constructor(
		private requestSender: RequestSenderInterface,
		private transformer: TransformerInterface<TypeNylasCalendar, TypeCalendar> = new FromNylasCalendarTransformer()
	) {}

	/**
	 * Fetches the list of calendars from Nylas and returns them.
	 *
	 * @param {TypeCalendarNames} payload - The list of calendar names to filter by (optional)
	 * @returns {Promise<TypeResponse<TypeCalendar[]>>} - The list of calendars
	 */
	public async execute(payload: TypeCalendarNames): Promise<TypeResponse<TypeCalendar[]>>
	{
		const { calendarNames } = payload;
		const path = '/calendars';

		console.log('Fetching calendars from PATH:', path);

		const response = await this.requestSender.send(path, { method: 'GET' });
		if (!response.ok)
		{
			console.error(`Failed to fetch calendars: ${response.statusText}`);
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

		const result = responseJson as TypeNylasResponse<TypeNylasCalendar[]>;
		const calendars = result.data?.map((calendar: TypeNylasCalendar) => this.transformer.transform(calendar))
			.filter((calendar: TypeCalendar | undefined) =>
				calendar !== undefined &&
					(calendarNames.length === 0 || calendarNames.includes(calendar.name))
			) as (TypeCalendar[] | undefined);

		if (!calendars)
		{
			console.error('Failed to transform calendars');
			return ResponseHelper.createErrorResponse(EnumErrorCode.TRANSFORMATION_ERROR, 'Failed to transform data');
		}

		return {
			success: true,
			data: calendars
		};
	}
}
