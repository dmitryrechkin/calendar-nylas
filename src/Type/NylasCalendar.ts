import { z } from 'zod';

export const nylasCalendarSchema = z.object({
	// eslint-disable-next-line @typescript-eslint/naming-convention
	grant_id: z.string().optional().describe('The unique identifier for the grant associated with this calendar.'),
	description: z.string().optional().nullable().describe('A brief description of the calendar. Can be null if no description is set.'),
	id: z.string().optional().describe('A unique identifier for the calendar.'),
	// eslint-disable-next-line @typescript-eslint/naming-convention
	is_primary: z.boolean().optional().describe('Indicates whether this is the primary calendar for the user.'),
	name: z.string().describe('The name of the calendar.'),
	object: z.literal('calendar').optional().describe('The type of object, always set to "calendar" for calendar objects.'),
	// eslint-disable-next-line @typescript-eslint/naming-convention
	read_only: z.boolean().optional().describe('Indicates whether the calendar is read-only.'),
	timezone: z.string().optional().describe('The timezone in which the calendar operates, specified as an IANA timezone string.'),
	// eslint-disable-next-line @typescript-eslint/naming-convention
	hex_color: z.string().optional().describe('The hexadecimal color code associated with the calendar.'),
	// eslint-disable-next-line @typescript-eslint/naming-convention
	hex_foreground_color: z.string().optional().describe('The hexadecimal foreground color code for text displayed on the calendar.'),
	// eslint-disable-next-line @typescript-eslint/naming-convention
	is_owned_by_user: z.boolean().optional().describe('Indicates whether the calendar is owned by the current user.'),
	location: z.string().optional().describe('The physical location associated with the calendar, if specified.')
});

// TypeScript type definitions
export interface TypeNylasCalendar extends z.infer<typeof nylasCalendarSchema> {}

