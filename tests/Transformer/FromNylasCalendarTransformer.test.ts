import { describe, it, expect } from 'vitest';
import { FromNylasCalendarTransformer } from '../../src/Transformer/FromNylasCalendarTransformer';
import { type TypeNylasCalendar } from '../../src/Type/NylasCalendar';
import { type TypeCalendar } from '@dmitryrechkin/calendar-core';

describe('FromNylasCalendarTransformer', () =>
{
	const transformer = new FromNylasCalendarTransformer();

	it('should correctly transform a valid Nylas calendar object to a TypeCalendar object', () =>
	{
		const input: TypeNylasCalendar = {
			id: 'calendar_id',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			grant_id: 'grant_id',
			name: 'Test Calendar',
			object: 'calendar',
			description: 'A test calendar',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			hex_color: '#ff0000',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			hex_foreground_color: '#00ff00',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			is_owned_by_user: true,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			is_primary: true,
			location: 'Test Location',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			read_only: false,
			timezone: 'America/Vancouver'
		};

		const expectedOutput: TypeCalendar = {
			id: 'calendar_id',
			name: 'Test Calendar',
			description: 'A test calendar',
			timezone: 'America/Vancouver',
			readOnly: false,
			location: 'Test Location',
			isPrimary: true,
			isOwnedByUser: true
		};

		const result = transformer.transform(input);

		expect(result).toEqual(expectedOutput);
	});

	it('should handle missing optional fields and return default values', () =>
	{
		const input: TypeNylasCalendar = {
			id: 'calendar_id',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			grant_id: 'grant_id',
			name: 'Test Calendar',
			object: 'calendar'
		};

		const expectedOutput: TypeCalendar = {
			id: 'calendar_id',
			name: 'Test Calendar',
			description: '',
			timezone: '',
			readOnly: false,
			location: '',
			isPrimary: false,
			isOwnedByUser: false
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
