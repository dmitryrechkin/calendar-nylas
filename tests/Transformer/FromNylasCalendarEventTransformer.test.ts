import { describe, it, expect } from 'vitest';
import { FromNylasCalendarEventTransformer } from '../../src/Transformer/FromNylasCalendarEventTransformer';
import { type TypeNylasCalendarEvent, type TypeNylasCalendarEventParticipant, type TypeNylasCalendarEventReminderOverride, type TypeNylasCalendarEventResource } from '../../../../src/Calendar/Nylas/Type/NylasCalendarEvent';

describe('FromNylasCalendarEventTransformer', () =>
{
	const transformer = new FromNylasCalendarEventTransformer();

	it('should return undefined if input is undefined', () =>
	{
		const result = transformer.transform(undefined);
		expect(result).toBeUndefined();
	});

	it('should transform basic event properties', () =>
	{
		const nylasEvent: TypeNylasCalendarEvent = {
			id: 'event1',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			calendar_id: 'cal1',
			busy: true,
			capacity: 100,
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
		};

		const result = transformer.transform(nylasEvent);

		expect(result).toEqual({
			id: 'event1',
			calendarId: 'cal1',
			busy: true,
			capacity: 100,
			conferencing: undefined,
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
		});
	});

	it('should transform participant properties', () =>
	{
		const nylasParticipant: TypeNylasCalendarEventParticipant = {
			comment: 'Test Comment',
			email: 'test@example.com',
			name: 'Test Name',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			phone_number: '1234567890'
		};

		const result = transformer['transformParticipant'](nylasParticipant);

		expect(result).toEqual({
			comment: 'Test Comment',
			email: 'test@example.com',
			name: 'Test Name',
			phoneNumber: '1234567890'
		});
	});

	it('should transform resource properties', () =>
	{
		const nylasResource: TypeNylasCalendarEventResource = {
			email: 'resource@example.com',
			name: 'Resource Name'
		};

		const result = transformer['transformResource'](nylasResource);

		expect(result).toEqual({
			email: 'resource@example.com',
			name: 'Resource Name'
		});
	});

	it('should transform reminder override properties', () =>
	{
		const nylasReminderOverride: TypeNylasCalendarEventReminderOverride = {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			reminder_minutes: 30,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			reminder_method: 'email'
		};

		const result = transformer['transformReminderOverride'](nylasReminderOverride);

		expect(result).toEqual({
			reminderMinutes: 30,
			reminderMethod: 'email'
		});
	});

	it('should transform when object with time', () =>
	{
		const nylasWhen = {
			time: 1625241600,
			timezone: 'UTC'
		};

		const result = transformer['transformWhen'](nylasWhen);

		expect(result).toEqual({
			time: 1625241600,
			timezone: 'UTC'
		});
	});

	it('should transform when object with start and end time', () =>
	{
		const nylasWhen = {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			start_time: 1625241600,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			end_time: 1625245200,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			start_timezone: 'UTC',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			end_timezone: 'UTC'
		};

		const result = transformer['transformWhen'](nylasWhen);

		expect(result).toEqual({
			startTime: 1625241600,
			endTime: 1625245200,
			startTimezone: 'UTC',
			endTimezone: 'UTC'
		});
	});

	it('should transform when object with date', () =>
	{
		const nylasWhen = {
			date: '2021-07-02'
		};

		const result = transformer['transformWhen'](nylasWhen);

		expect(result).toEqual({
			date: '2021-07-02'
		});
	});

	it('should transform when object with start and end date', () =>
	{
		const nylasWhen = {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			start_date: '2021-07-02',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			end_date: '2021-07-03'
		};

		const result = transformer['transformWhen'](nylasWhen);

		expect(result).toEqual({
			startDate: '2021-07-02',
			endDate: '2021-07-03'
		});
	});
});
