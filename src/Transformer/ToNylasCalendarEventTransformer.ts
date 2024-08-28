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

export class ToNylasCalendarEventTransformer implements TransformerInterface<TypeCalendarEvent, TypeNylasCalendarEvent>
{
	/**
     * Transforms input of type TypeCalendarEvent to TypeNylasCalendarEvent.
     *
     * @param {TypeCalendarEvent | undefined} input - The calendar event to transform.
     * @returns {TypeNylasCalendarEvent | undefined} - The transformed Nylas calendar event.
     */
	public transform(input: TypeCalendarEvent | undefined): TypeNylasCalendarEvent | undefined
	{
		if (!input) return undefined;

		return {
			id: input.id,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			calendar_id: input.calendarId,
			busy: input.busy,
			capacity: input.capacity,
			conferencing: this.transformConferencing(input.conferencing),
			description: input.description,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			hide_participants: input.hideParticipants,
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
     * Transforms a calendar event participant to a Nylas calendar event participant.
     *
     * @param {TypeCalendarEventParticipant | undefined} input - The calendar event participant to transform.
     * @returns {TypeNylasCalendarEventParticipant | undefined} - The transformed Nylas calendar event participant.
     */
	private transformParticipant(input: TypeCalendarEventParticipant | undefined): TypeNylasCalendarEventParticipant | undefined
	{
		if (!input) return undefined;

		return {
			comment: input.comment,
			email: input.email,
			name: input.name,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			phone_number: input.phoneNumber
		};
	}

	/**
     * Transforms a calendar event resource to a Nylas calendar event resource.
     *
     * @param {TypeCalendarEventResource | undefined} input - The calendar event resource to transform.
     * @returns {TypeNylasCalendarEventResource | undefined} - The transformed Nylas calendar event resource.
     */
	private transformResource(input: TypeCalendarEventResource | undefined): TypeNylasCalendarEventResource | undefined
	{
		if (!input) return undefined;

		return {
			email: input.email,
			name: input.name
		};
	}

	/**
     * Transforms a calendar event reminder override to a Nylas calendar event reminder override.
     *
     * @param {TypeCalendarEventReminderOverride | undefined} input - The calendar event reminder override to transform.
     * @returns {TypeNylasCalendarEventReminderOverride | undefined} - The transformed Nylas calendar event reminder override.
     */
	private transformReminderOverride(input: TypeCalendarEventReminderOverride | undefined): TypeNylasCalendarEventReminderOverride | undefined
	{
		if (!input) return undefined;

		return {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			reminder_minutes: input.reminderMinutes,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			reminder_method: input.reminderMethod
		};
	}

	/**
     * Transforms a calendar event reminder to a Nylas calendar event reminder.
     *
     * @param {TypeCalendarEventReminder | undefined} input - The calendar event reminder to transform.
     * @returns {TypeNylasCalendarEventReminder | undefined} - The transformed Nylas calendar event reminder.
     */
	private transformReminders(input: TypeCalendarEventReminder | undefined): TypeNylasCalendarEventReminder | undefined
	{
		if (!input) return undefined;

		return {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			use_default: input.useDefault,
			overrides: input.overrides?.map(this.transformReminderOverride).filter(override => override !== undefined)
		};
	}

	/**
     * Transforms calendar conferencing details to Nylas conferencing details.
     *
     * @param {TypeCalendarEvent['conferencing'] | undefined} input - The calendar conferencing details to transform.
     * @returns {TypeNylasCalendarEvent['conferencing'] | undefined} - The transformed conferencing details.
     */
	private transformConferencing(input: TypeCalendarEvent['conferencing'] | undefined): TypeNylasCalendarEvent['conferencing'] | undefined
	{
		if (!input || (!input.autocreate && !input.details)) return undefined;

		return {
			provider: input.provider,
			...input.autocreate ? { autocreate: input.autocreate } : { details: input.details! }
		};
	}

	/**
     * Transforms the calendar event "when" property to the Nylas calendar event "when" property.
     *
     * @param {TypeCalendarEvent['when']} input - The "when" property to transform.
     * @returns {TypeNylasCalendarEvent['when'] | undefined} - The transformed "when" property.
     */
	private transformWhen(input: TypeCalendarEvent['when']): TypeNylasCalendarEvent['when']
	{
		if ('time' in input)
		{
			return {
				time: input.time,
				timezone: input.timezone
			};
		}

		if ('startTime' in input && 'endTime' in input)
		{
			return {
				// eslint-disable-next-line @typescript-eslint/naming-convention
				start_time: input.startTime,
				// eslint-disable-next-line @typescript-eslint/naming-convention
				end_time: input.endTime,
				// eslint-disable-next-line @typescript-eslint/naming-convention
				start_timezone: input.startTimezone,
				// eslint-disable-next-line @typescript-eslint/naming-convention
				end_timezone: input.endTimezone
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
			start_date: input.startDate,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			end_date: input.endDate
		};
	}
}
