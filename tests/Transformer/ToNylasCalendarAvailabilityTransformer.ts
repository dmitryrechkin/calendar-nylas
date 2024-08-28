import { describe, it, expect } from 'vitest';
import { ToNylasCalendarAvailabilityTransformer } from '../../src/Transformer/ToNylasCalendarAvailabilityTransformer';
import { type TypeCalendarAvailability } from '@dmitryrechkin/calendar-core';
import { type TypeNylasCalendarAvailability } from '../../src/Type/NylasCalendarAvailability';

describe('ToNylasCalendarAvailabilityTransformer', () =>
{
	const transformer = new ToNylasCalendarAvailabilityTransformer();

	it('should correctly transform a valid TypeCalendarAvailability object to TypeNylasCalendarAvailability', () =>
	{
		const input: TypeCalendarAvailability = {
			participants: [
				{
					email: 'participant@example.com',
					calendarIds: ['calendar1', 'calendar2'],
					openHours: [
						{
							days: [1, 2, 3],
							timezone: 'America/Vancouver',
							start: '09:00',
							end: '17:00',
							exdates: ['2024-10-09']
						}
					]
				}
			],
			startTime: 1723401655,
			endTime: 1723405255,
			durationMinutes: 60,
			intervalMinutes: 30,
			roundTo: 15,
			availabilityRules:
				{
					availabilityMethod: 'max-availability',
					buffer: {
						before: 10,
						after: 10
					},
					defaultOpenHours: [
						{
							days: [0, 1, 2],
							timezone: 'America/Vancouver',
							start: '08:00',
							end: '16:00'
						}
					],
					roundRobinGroupId: 'groupId1'
				}
		};

		const expectedOutput: TypeNylasCalendarAvailability = {
			participants: [
				{
					email: 'participant@example.com',
					// eslint-disable-next-line @typescript-eslint/naming-convention
					calendar_ids: ['calendar1', 'calendar2'],
					// eslint-disable-next-line @typescript-eslint/naming-convention
					open_hours: [
						{
							days: [1, 2, 3],
							timezone: 'America/Vancouver',
							start: '09:00',
							end: '17:00',
							exdates: ['2024-10-09']
						}
					]
				}
			],
			// eslint-disable-next-line @typescript-eslint/naming-convention
			start_time: 1723401655,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			end_time: 1723405255,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			duration_minutes: 60,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			interval_minutes: 30,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			round_to: 15,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			availability_rules:
				{
					// eslint-disable-next-line @typescript-eslint/naming-convention
					availability_method: 'max-availability',
					buffer: {
						before: 10,
						after: 10
					},
					// eslint-disable-next-line @typescript-eslint/naming-convention
					default_open_hours: [
						{
							days: [0, 1, 2],
							timezone: 'America/Vancouver',
							start: '08:00',
							end: '16:00'
						}
					],
					// eslint-disable-next-line @typescript-eslint/naming-convention
					round_robin_group_id: 'groupId1'
				}

		};

		const result = transformer.transform(input);
		expect(result).toEqual(expectedOutput);
	});

	it('should return undefined if the input is undefined', () =>
	{
		const result = transformer.transform(undefined);
		expect(result).toBeUndefined();
	});

	it('should handle missing optional fields and return default values', () =>
	{
		const input: TypeCalendarAvailability = {
			participants: [
				{
					email: 'participant@example.com',
					calendarIds: [],
					openHours: []
				}
			],
			startTime: 1723401655,
			endTime: 1723405255,
			durationMinutes: 60,
			intervalMinutes: 30,
			roundTo: 15
		};

		const expectedOutput: TypeNylasCalendarAvailability = {
			participants: [
				{
					email: 'participant@example.com',
					// eslint-disable-next-line @typescript-eslint/naming-convention
					calendar_ids: [],
					// eslint-disable-next-line @typescript-eslint/naming-convention
					open_hours: []
				}
			],
			// eslint-disable-next-line @typescript-eslint/naming-convention
			start_time: 1723401655,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			end_time: 1723405255,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			duration_minutes: 60,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			interval_minutes: 30,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			round_to: 15
		};

		const result = transformer.transform(input);
		expect(result).toEqual(expectedOutput);
	});
});
