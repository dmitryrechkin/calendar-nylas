import { type TransformerInterface } from '@dmitryrechkin/foundation-core';
import { type TypeCalendarAvailabilityInfo, type TypeCalendarAvailabilityTimeSlot } from '@dmitryrechkin/calendar-core';
import { type TypeNylasCalendarAvailabilityInfo, type TypeNylasCalendarAvailabilityTimeSlot } from '../Type/NylasCalendarAvailability';

export class FromNylasCalendarAvailabilityInfoTransformer implements TransformerInterface<TypeNylasCalendarAvailabilityInfo, TypeCalendarAvailabilityInfo>
{
	/**
	 * Transforms input of type TypeNylasCalendarAvailabilityInfo with snake_case properties
	 * to output of type TypeCalendarAvailabilityInfo with camelCase properties.
	 *
	 * @param {TypeNylasCalendarAvailabilityInfo | undefined} input - input data to be transformed
	 * @returns {TypeCalendarAvailabilityInfo | undefined} - transformed data
	 */
	public transform(input: TypeNylasCalendarAvailabilityInfo | undefined): TypeCalendarAvailabilityInfo | undefined
	{
		if (!input) return undefined;

		return {
			order: input.order,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			timeSlots: input.time_slots.map((timeSlot: any) => this.transformTimeSlot(timeSlot)).filter(timeSlot => timeSlot !== undefined)
		};
	}

	/**
	 * Transforms input of time slots.
	 *
	 * @param {TypeNylasCalendarAvailabilityInfo | undefined} - availability time slot
	 * @returns {TypeCalendarAvailabilityTimeSlot | undefined} - transformed data
	 */
	private transformTimeSlot(timeSlot: TypeNylasCalendarAvailabilityTimeSlot | undefined): TypeCalendarAvailabilityTimeSlot | undefined
	{
		if (!timeSlot) return undefined;

		return {
			emails: timeSlot.emails,
			startTime: timeSlot.start_time,
			endTime: timeSlot.end_time
		};
	}
}
