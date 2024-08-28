import { z } from 'zod';

export const nylasCalendarOpenHoursSchema = z.object({
	days: z.array(z.number()).describe('The days of the week that the open hours settings are applied to. Sunday corresponds to 0, and Saturday corresponds to 6.'),
	timezone: z.string().describe('The calendar\'s time zone as an IANA-formatted string.'),
	start: z.string().describe('The start time for the open hours settings, in 24-hour time format.'),
	end: z.string().describe('The end time for the open hours settings, in 24-hour time format.'),
	exdates: z.array(z.string()).optional().describe('A list of dates that Nylas excludes from the account\'s open hours, in YYYY-MM-DD format.')
});

export const nylasCalendarBufferBetweenEventsSchema = z.object({
	before: z.number().min(0).max(120).describe('The amount of buffer time to add before meetings, in increments of five minutes. This value must be between 0 and 120, and must be divisible by 5.'),
	after: z.number().min(0).max(120).describe('The amount of buffer time to add after meetings, in increments of five minutes. This value must be between 0 and 120, and must be divisible by 5.')
});

export const nylasCalendarAvailabilityParticipantSchema = z.object({
	email: z.string().email().describe('The email address of the participant.'),
	// eslint-disable-next-line @typescript-eslint/naming-convention
	calendar_ids: z.array(z.string()).optional().describe('The calendar IDs associated with the participant.'),
	// eslint-disable-next-line @typescript-eslint/naming-convention
	open_hours: z.array(nylasCalendarOpenHoursSchema).optional().describe('The open hours for the participant.')
});

export const nylasCalendarAvailabilityRulesSchema = z.object({
	// eslint-disable-next-line @typescript-eslint/naming-convention
	availability_method: z.enum(['collective', 'max-fairness', 'max-availability']).describe('The method used to determine availability.'),
	buffer: nylasCalendarBufferBetweenEventsSchema.optional().describe('The buffer time Nylas adds around existing meetings, in minutes.'),
	// eslint-disable-next-line @typescript-eslint/naming-convention
	default_open_hours: z.array(nylasCalendarOpenHoursSchema).optional().describe('A default set of open hours to apply to all participants.'),
	// eslint-disable-next-line @typescript-eslint/naming-convention
	round_robin_group_id: z.string().optional().describe('The ID on events that Nylas considers when calculating the order of round-robin participants.')
});

export const nylasCalendarAvailabilitySchema = z.object({
	participants: z.array(nylasCalendarAvailabilityParticipantSchema).describe('A list of participants that you want to get availability information for.'),
	// eslint-disable-next-line @typescript-eslint/naming-convention
	start_time: z.number().describe('The beginning of the time slot that Nylas checks availability for, in Unix epoch format. Must be a multiple of 5 minutes.'),
	// eslint-disable-next-line @typescript-eslint/naming-convention
	end_time: z.number().describe('The end of the time slot that Nylas checks availability for, in Unix epoch format. Must be a multiple of 5 minutes.'),
	// eslint-disable-next-line @typescript-eslint/naming-convention
	duration_minutes: z.number().describe('The duration of each time slot, in minutes. Must be a multiple of 5 minutes.'),
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interval_minutes: z.number().optional().describe('Nylas generates a time slot every interval_minutes (for example, every 30 minutes) and returns only slots when all participants are free. Must be a multiple of 5 minutes.'),
	// eslint-disable-next-line @typescript-eslint/naming-convention
	round_to: z.number().optional().describe('Nylas rounds each time slot to the nearest round_to value. For example, if a time slot starts at 9:05a.m. and round_to is set to 15, Nylas rounds it to 9:15a.m. Must be a multiple of 5 minutes. Default: 15'),
	// eslint-disable-next-line @typescript-eslint/naming-convention
	availability_rules: nylasCalendarAvailabilityRulesSchema.optional().describe('The rules for determining availability, including buffer times and open hours.')
});

export const nylasCalendarAvailabilityTimeSlotSchema = z.object({
	emails: z.array(z.string()).describe('An array of emails of the participants available in this time slot.'),
	// eslint-disable-next-line @typescript-eslint/naming-convention
	start_time: z.number().describe('The start of a time slot, in Unix epoch format.'),
	// eslint-disable-next-line @typescript-eslint/naming-convention
	end_time: z.number().describe('The end of a time slot, in Unix epoch format.')
});

export const nylasCalendarAvailabilityInfoSchema = z.object({
	order: z.array(z.string()).describe('(Round-robin events only) The order of participants in line to attend the proposed meeting.'),
	// eslint-disable-next-line @typescript-eslint/naming-convention
	time_slots: z.array(nylasCalendarAvailabilityTimeSlotSchema).describe('An array of the available time slots when you can create a meeting using the requested settings.')
});

export interface TypeNylasCalendarOpenHours extends z.infer<typeof nylasCalendarOpenHoursSchema> {}
export interface TypeNylasCalendarBufferBetweenEvents extends z.infer<typeof nylasCalendarBufferBetweenEventsSchema> {}
export interface TypeNylasCalendarAvailabilityParticipant extends z.infer<typeof nylasCalendarAvailabilityParticipantSchema> {}
export interface TypeNylasCalendarAvailabilityRules extends z.infer<typeof nylasCalendarAvailabilityRulesSchema> {}
export interface TypeNylasCalendarAvailability extends z.infer<typeof nylasCalendarAvailabilitySchema> {}
export interface TypeNylasCalendarAvailabilityTimeSlot extends z.infer<typeof nylasCalendarAvailabilityTimeSlotSchema> {}
export interface TypeNylasCalendarAvailabilityInfo extends z.infer<typeof nylasCalendarAvailabilityInfoSchema> {}
