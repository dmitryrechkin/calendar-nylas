import { describe, it, expect } from 'vitest';
import { FromNylasCalendarAvailabilityInfoTransformer } from '../../src/Transformer/FromNylasCalendarAvailabilityInfoTransformer';
import type { TypeNylasCalendarAvailabilityInfo } from '../../src/Type/NylasCalendarAvailability';
import type { TypeCalendarAvailabilityInfo } from '@dmitryrechkin/calendar-core';

describe('FromNylasCalendarAvailabilityInfoTransformer', () =>
{
	const transformer = new FromNylasCalendarAvailabilityInfoTransformer();

	it('should correctly transform a valid TypeNylasCalendarAvailabilityInfo object to a TypeCalendarAvailabilityInfo object', () =>
	{
		const input: TypeNylasCalendarAvailabilityInfo = {
			order: ['1'],
			// eslint-disable-next-line @typescript-eslint/naming-convention
			time_slots: [
				{
					emails: ['example1@example.com', 'example2@example.com'],
					// eslint-disable-next-line @typescript-eslint/naming-convention
					start_time: 1629748800000,
					// eslint-disable-next-line @typescript-eslint/naming-convention
					end_time: 1629770400000
				}
			]
		};

		const expectedOutput: TypeCalendarAvailabilityInfo = {
			order: ['1'],
			timeSlots: [
				{
					emails: ['example1@example.com', 'example2@example.com'],
					startTime: 1629748800000,
					endTime: 1629770400000
				}
			]
		};

		const result = transformer.transform(input);

		expect(result).toEqual(expectedOutput);
	});

	it('should handle empty time slots and return default values', () =>
	{
		const input: TypeNylasCalendarAvailabilityInfo = {
			order: ['2'],
			// eslint-disable-next-line @typescript-eslint/naming-convention
			time_slots: []
		};

		const expectedOutput: TypeCalendarAvailabilityInfo = {
			order: ['2'],
			// eslint-disable-next-line @typescript-eslint/naming-convention
			timeSlots: []
		};

		const result = transformer.transform(input);

		expect(result).toEqual(expectedOutput);
	});

	it('should return undefined if the input is undefined', () =>
	{
		const result = transformer.transform(undefined);

		expect(result).toBeUndefined();
	});
});
