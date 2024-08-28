import { type TransformerInterface } from '@dmitryrechkin/foundation-core';

import {
	type TypeCalendarAvailability,
	type TypeCalendarAvailabilityParticipant,
	type TypeCalendarAvailabilityRules,
	type TypeCalendarBufferBetweenEvents,
	type TypeCalendarOpenHours
} from '@dmitryrechkin/calendar-core';

import {
	type TypeNylasCalendarAvailability,
	type TypeNylasCalendarAvailabilityParticipant,
	type TypeNylasCalendarAvailabilityRules,
	type TypeNylasCalendarBufferBetweenEvents,
	type TypeNylasCalendarOpenHours
} from '../Type/NylasCalendarAvailability';

export class ToNylasCalendarAvailabilityTransformer implements TransformerInterface<TypeCalendarAvailability, TypeNylasCalendarAvailability>
{
	/**
	 * Transforms input of type TypeCalendarAvailability to output of type TypeNylasCalendarAvailability
	 *
	 * @param {TypeCalendarAvailability | undefined} input - input data to be transformed
	 * @returns {TypeNylasCalendarAvailability | undefined} - transformed data
	 */
	public transform(input: TypeCalendarAvailability | undefined): TypeNylasCalendarAvailability | undefined
	{
		if (!input) return undefined;

		return {
			participants: input.participants.map(participant => this.transformParticipant(participant))
				.filter(participant => participant !== undefined) as TypeNylasCalendarAvailabilityParticipant[],
			// eslint-disable-next-line @typescript-eslint/naming-convention
			start_time: input.startTime,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			end_time: input.endTime,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			duration_minutes: input.durationMinutes,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			interval_minutes: input.intervalMinutes,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			round_to: input.roundTo,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			availability_rules: this.transformAvailabilityRules(input.availabilityRules)
		};
	}

	/**
	 * Transforms input of type TypeCalendarAvailabilityParticipant to output of type TypeNylasCalendarAvailabilityParticipant
	 *
	 * @param {TypeCalendarAvailabilityParticipant | undefined} participant - input data to be transformed
	 * @returns {TypeNylasCalendarAvailabilityParticipant | undefined} - transformed data
	 */
	private transformParticipant(participant: TypeCalendarAvailabilityParticipant | undefined): TypeNylasCalendarAvailabilityParticipant | undefined
	{
		if (!participant) return undefined;

		return {
			email: participant.email,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			calendar_ids: participant.calendarIds,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			open_hours: participant.openHours?.map(openHour => this.transformOpenHours(openHour))
				.filter(openHour => openHour !== undefined) as TypeNylasCalendarOpenHours[]
		};
	}

	/**
	 * Transforms input of type TypeCalendarOpenHours to output of type TypeNylasCalendarOpenHours
	 *
	 * @param {TypeCalendarOpenHours | undefined} openHours - input data to be transformed
	 * @returns {TypeNylasCalendarOpenHours | undefined} - transformed data
	 */
	private transformOpenHours(openHours: TypeCalendarOpenHours | undefined): TypeNylasCalendarOpenHours | undefined
	{
		if (!openHours) return undefined;

		return {
			days: openHours.days,
			timezone: openHours.timezone,
			start: openHours.start,
			end: openHours.end,
			exdates: openHours.exdates
		};
	}

	/**
	 * Transforms input of type TypeCalendarAvailabilityRules to output of type TypeNylasCalendarAvailabilityRules
	 *
	 * @param {TypeCalendarAvailabilityRules | undefined} rule - input data to be transformed
	 * @returns {TypeNylasCalendarAvailabilityRules | undefined} - transformed data
	 */
	private transformAvailabilityRules(rule: TypeCalendarAvailabilityRules | undefined): TypeNylasCalendarAvailabilityRules | undefined
	{
		if (!rule) return undefined;

		return {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			availability_method: rule.availabilityMethod,
			buffer: this.transformBufferBetweenEvents(rule.buffer),
			// eslint-disable-next-line @typescript-eslint/naming-convention
			default_open_hours: rule.defaultOpenHours?.map((openHour: TypeCalendarOpenHours | undefined) => this.transformOpenHours(openHour))
				.filter((openHour: TypeCalendarOpenHours | undefined) => openHour !== undefined) as TypeNylasCalendarOpenHours[],
			// eslint-disable-next-line @typescript-eslint/naming-convention
			round_robin_group_id: rule.roundRobinGroupId
		};
	}

	/**
	 * Transforms input of type TypeCalendarBufferBetweenEvents to output of type TypeNylasCalendarBufferBetweenEvents
	 *
	 * @param {TypeCalendarBufferBetweenEvents | undefined} buffer - input data to be transformed
	 * @returns {TypeNylasCalendarBufferBetweenEvents | undefined} - transformed data
	 */
	private transformBufferBetweenEvents(buffer: TypeCalendarBufferBetweenEvents | undefined): TypeNylasCalendarBufferBetweenEvents | undefined
	{
		if (!buffer) return undefined;

		return {
			before: buffer.before,
			after: buffer.after
		};
	}
}
