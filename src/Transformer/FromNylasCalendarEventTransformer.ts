import { type TransformerInterface } from '@dmitryrechkin/foundation-core';
import {
	type TypeNylasCalendarEvent,
	type TypeNylasCalendarEventParticipant,
	type TypeNylasCalendarEventResource,
	type TypeNylasCalendarEventReminderOverride,
	type TypeNylasCalendarEventReminder
} from '../Type/NylasCalendarEvent';

import {
	type TypeCalendarEvent,
	type TypeCalendarEventParticipant,
	type TypeCalendarEventResource,
	type TypeCalendarEventReminderOverride,
	type TypeCalendarEventReminder
} from '@dmitryrechkin/calendar-core';

export class FromNylasCalendarEventTransformer implements TransformerInterface<TypeNylasCalendarEvent, TypeCalendarEvent>
{
	/**
	 * Transforms input of type TypeNylasCalendarEvent to TypeCalendarEvent.
	 *
	 * @param {TypeNylasCalendarEvent | undefined} input - The Nylas calendar event to transform.
	 * @returns {TypeCalendarEvent | undefined} - The transformed calendar event.
	 */
	public transform(input: TypeNylasCalendarEvent | undefined): TypeCalendarEvent | undefined
	{
		if (!input?.id)
		{
			return undefined;
		}

		return {
			id: input.id,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			calendarId: input.calendar_id,
			busy: input.busy,
			capacity: input.capacity,
			conferencing: this.transformConferencing(input.conferencing),
			description: input.description,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			hideParticipants: input.hide_participants,
			location: input.location,
			metadata: input.metadata,
			participants: input.participants?.map(this.transformParticipant).filter(participant => participant !== undefined),
			resources: input.resources?.map(this.transformResource).filter(resource => resource !== undefined),
			recurrence: input.recurrence,
			reminders: this.transformReminders(input.reminders),
			title: input.title,
			visibility: input.visibility,
			when: this.transformWhen(input.when)
		};
	}

	/**
	 * Transforms a Nylas calendar event participant to a calendar event participant.
	 *
	 * @param {TypeNylasCalendarEventParticipant | undefined} input - The Nylas calendar event participant to transform.
	 * @returns {TypeCalendarEventParticipant | undefined} - The transformed calendar event participant.
	 */
	private transformParticipant(input: TypeNylasCalendarEventParticipant | undefined): TypeCalendarEventParticipant | undefined
	{
		if (!input || (!input.email && !input.name))
		{
			return undefined;
		}

		return {
			comment: input.comment,
			email: input.email,
			name: input.name,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			phoneNumber: input.phone_number
		};
	}

	/**
	 * Transforms a Nylas calendar event resource to a calendar event resource.
	 *
	 * @param {TypeNylasCalendarEventResource | undefined} input - The Nylas calendar event resource to transform.
	 * @returns {TypeCalendarEventResource | undefined} - The transformed calendar event resource.
	 */
	private transformResource(input: TypeNylasCalendarEventResource | undefined): TypeCalendarEventResource | undefined
	{
		if (!input || (!input.email && !input.name))
		{
			return undefined;
		}

		return {
			email: input.email,
			name: input.name
		};
	}

	/**
	 * Transforms a Nylas calendar event reminder override to a calendar event reminder override.
	 *
	 * @param {TypeNylasCalendarEventReminderOverride | undefined} input - The Nylas calendar event reminder override to transform.
	 * @returns {TypeCalendarEventReminderOverride | undefined} - The transformed calendar event reminder override.
	 */
	private transformReminderOverride(input: TypeNylasCalendarEventReminderOverride | undefined): TypeCalendarEventReminderOverride | undefined
	{
		if (!input || (!input.reminder_minutes && !input.reminder_method))
		{
			return undefined;
		}

		return {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			reminderMinutes: input.reminder_minutes,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			reminderMethod: input.reminder_method
		};
	}

	/**
	 * Transforms a Nylas calendar event reminder to a calendar event reminder.
	 *
	 * @param {TypeNylasCalendarEventReminder | undefined} input - The Nylas calendar event reminder to transform.
	 * @returns {TypeCalendarEventReminder | undefined} - The transformed calendar event reminder.
	 */
	private transformReminders(input: TypeNylasCalendarEventReminder | undefined): TypeCalendarEventReminder | undefined
	{
		if (!input || !('use_default' in input))
		{
			return undefined;
		}

		return {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			useDefault: input.use_default,
			overrides: input.overrides?.map(this.transformReminderOverride).filter(override => override !== undefined)
		};
	}

	/**
	 * Transforms Nylas conferencing details to calendar conferencing details.
	 *
	 * @param {TypeNylasCalendarEvent['conferencing'] | undefined} input - The Nylas conferencing details to transform.
	 * @returns {TypeCalendarEvent['conferencing'] | undefined} - The transformed conferencing details.
	 */
	private transformConferencing(input: TypeNylasCalendarEvent['conferencing'] | undefined): TypeCalendarEvent['conferencing'] | undefined
	{
		if (!input || (!input.autocreate && !input.details))
		{
			return undefined;
		}

		return {
			provider: input.provider,
			...input.autocreate ? { autocreate: input.autocreate } : { details: input.details }
		};
	}

	/**
	 * Transforms the Nylas calendar event "when" property to the calendar event "when" property.
	 *
	 * @param {TypeNylasCalendarEvent['when']} input - The Nylas "when" property to transform.
	 * @returns {TypeCalendarEvent['when'] | undefined} - The transformed "when" property.
	 */
	private transformWhen(input: TypeNylasCalendarEvent['when']): TypeCalendarEvent['when']
	{
		if ('time' in input)
		{
			return {
				time: input.time,
				timezone: input.timezone
			};
		}

		if ('start_time' in input && 'end_time' in input)
		{
			return {
				// eslint-disable-next-line @typescript-eslint/naming-convention
				startTime: input.start_time,
				// eslint-disable-next-line @typescript-eslint/naming-convention
				endTime: input.end_time,
				// eslint-disable-next-line @typescript-eslint/naming-convention
				startTimezone: input.start_timezone,
				// eslint-disable-next-line @typescript-eslint/naming-convention
				endTimezone: input.end_timezone
			};
		}

		if ('date' in input)
		{
			return {
				date: input.date
			};
		}

		return {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			startDate: input.start_date,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			endDate: input.end_date
		};
	}
}
