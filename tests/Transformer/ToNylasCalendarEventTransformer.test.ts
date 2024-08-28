import { describe, it, expect } from 'vitest';
import { ToNylasCalendarEventTransformer } from '../../src/Transformer/ToNylasCalendarEventTransformer';
import { type TypeCalendarEvent, type TypeCalendarEventParticipant, type TypeCalendarEventReminderOverride, type TypeCalendarEventResource } from '@dmitryrechkin/calendar-core';


describe('ToNylasCalendarEventTransformer', () =>
{
	const transformer = new ToNylasCalendarEventTransformer();

	it('should return undefined if input is undefined', () =>
	{
		const result = transformer.transform(undefined);
		expect(result).toBeUndefined();
	});

	it('should transform basic event properties', () =>
	{
		const calendarEvent: TypeCalendarEvent = {
			id: 'event1',
			calendarId: 'cal1',
			busy: true,
			capacity: 100,
			description: 'A test event',
			hideParticipants: false,
			location: 'Test Location',
			metadata: { key1: 'value1' },
			participants: [],
			resources: [],
			recurrence: [],
			reminders: {
				useDefault: true,
				overrides: []
			},
			title: 'Test Event',
			visibility: 'public',
			when: {
				time: 1625241600,
				timezone: 'UTC'
			}
		};

		const result = transformer.transform(calendarEvent);

		expect(result).toEqual({
			id: 'event1',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			calendar_id: 'cal1',
			busy: true,
			capacity: 100,
			conferencing: undefined,
			description: 'A test event',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			hide_participants: false,
			location: 'Test Location',
			metadata: { key1: 'value1' },
			participants: [],
			resources: [],
			recurrence: [],
			reminders: {
				// eslint-disable-next-line @typescript-eslint/naming-convention
				use_default: true,
				overrides: []
			},
			title: 'Test Event',
			visibility: 'public',
			when: {
				time: 1625241600,
				timezone: 'UTC'
			}
		});
	});

	it('should transform participant properties', () =>
	{
		const calendarParticipant: TypeCalendarEventParticipant = {
			comment: 'Test Comment',
			email: 'test@example.com',
			name: 'Test Name',
			phoneNumber: '1234567890'
		};

		const result = transformer['transformParticipant'](calendarParticipant);

		expect(result).toEqual({
			comment: 'Test Comment',
			email: 'test@example.com',
			name: 'Test Name',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			phone_number: '1234567890'
		});
	});

	it('should transform resource properties', () =>
	{
		const calendarResource: TypeCalendarEventResource = {
			email: 'resource@example.com',
			name: 'Resource Name'
		};

		const result = transformer['transformResource'](calendarResource);

		expect(result).toEqual({
			email: 'resource@example.com',
			name: 'Resource Name'
		});
	});

	it('should transform reminder override properties', () =>
	{
		const calendarReminderOverride: TypeCalendarEventReminderOverride = {
			reminderMinutes: 30,
			reminderMethod: 'email'
		};

		const result = transformer['transformReminderOverride'](calendarReminderOverride);

		expect(result).toEqual({
			// eslint-disable-next-line @typescript-eslint/naming-convention
			reminder_minutes: 30,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			reminder_method: 'email'
		});
	});

	it('should transform when object with time', () =>
	{
		const calendarWhen = {
			time: 1625241600,
			timezone: 'UTC'
		};

		const result = transformer['transformWhen'](calendarWhen);

		expect(result).toEqual({
			time: 1625241600,
			timezone: 'UTC'
		});
	});

	it('should transform when object with start and end time', () =>
	{
		const calendarWhen = {
			startTime: 1625241600,
			endTime: 1625245200,
			startTimezone: 'UTC',
			endTimezone: 'UTC'
		};

		const result = transformer['transformWhen'](calendarWhen);

		expect(result).toEqual({
			// eslint-disable-next-line @typescript-eslint/naming-convention
			start_time: 1625241600,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			end_time: 1625245200,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			start_timezone: 'UTC',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			end_timezone: 'UTC'
		});
	});

	it('should transform when object with date', () =>
	{
		const calendarWhen = {
			date: '2021-07-02'
		};

		const result = transformer['transformWhen'](calendarWhen);

		expect(result).toEqual({
			date: '2021-07-02'
		});
	});

	it('should transform when object with start and end date', () =>
	{
		const calendarWhen = {
			startDate: '2021-07-02',
			endDate: '2021-07-03'
		};

		const result = transformer['transformWhen'](calendarWhen);

		expect(result).toEqual({
			// eslint-disable-next-line @typescript-eslint/naming-convention
			start_date: '2021-07-02',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			end_date: '2021-07-03'
		});
	});
});
