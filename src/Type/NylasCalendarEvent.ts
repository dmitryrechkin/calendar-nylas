import { z } from 'zod';

export const nylasCalendarEventParticipantSchema = z.object({
	comment: z.string().optional().describe('A comment about the participant (for example, their nickname).'),
	email: z.string().email().describe('The participant\'s email address.'),
	name: z.string().optional().describe('The participant\'s full name.'),
	// eslint-disable-next-line @typescript-eslint/naming-convention
	phone_number: z.string().optional().describe('The participant\'s phone number.'),
	status: z.enum(['yes', 'no', 'maybe', 'noreply']).optional().describe('The participant\'s attendance status.')
});

export const nylasCalendarEventResourceSchema = z.object({
	email: z.string().email().describe('The resource\'s email address.'),
	name: z.string().optional().describe('The resource\'s full name.')
});

export const nylasCalendarEventReminderOverrideSchema = z.object({
	// eslint-disable-next-line @typescript-eslint/naming-convention
	reminder_minutes: z.number().describe('The number of minutes before the event start time when a user wants to receive a reminder for this event.'),
	// eslint-disable-next-line @typescript-eslint/naming-convention
	reminder_method: z.enum(['popup', 'email', 'display', 'sound']).describe('The method used to notify the end user about the event.')
});

export const nylasCalendarEventReminderSchema = z.object({
	// eslint-disable-next-line @typescript-eslint/naming-convention
	use_default: z.boolean().describe('Indicates whether to use the calendar\'s default reminders.'),
	overrides: z.array(nylasCalendarEventReminderOverrideSchema).optional().describe('Custom reminder settings, if any.')
});

export const nylasCalendarEventConferenceAutocreateSchema = z.object({
	// Define the autocreate settings here if necessary
});

export const nylasCalendarEventConferenceDetailsSchema = z.union([
	z.object({
		// google meet
		phone: z.array(z.string()).optional().describe('The phone number associated with the Google Meet conference.'),
		pin: z.string().optional().describe('The PIN associated with the Google Meet conference, if applicable.'),
		url: z.string().describe('The URL for the Google Meet conference.')
	}),
	z.object({
		// zoom meeting
		// eslint-disable-next-line @typescript-eslint/naming-convention
		meeting_code: z.string().describe('A unique ID associated with the Zoom conference.'),
		password: z.string().optional().describe('The password for the Zoom conference, if applicable.'),
		url: z.string().describe('The URL for the Zoom conference.')
	}),
	z.object({
		// microsoft teams
		url: z.string().describe('The URL for the Microsoft Teams conference.')
	})
]).describe('Conference details for different providers');

export const nylasCalendarEventConferenceSchema = z.object({
	provider: z.enum(['Google Meet', 'Zoom Meeting', 'Microsoft Teams']).describe('The provider of the conference.')
}).and(
	z.union([
		z.object({
			autocreate: nylasCalendarEventConferenceAutocreateSchema,
			details: z.undefined()
		}),
		z.object({
			autocreate: z.undefined(),
			details: nylasCalendarEventConferenceDetailsSchema
		})
	])
).describe('An object that allows you to automatically create a conference or enter conferencing details manually.');

export const nylasCalendarEventWhenSchema = z.union([
	// Time Object
	z.object({
		time: z.number().describe('The time that the meeting occurs, in Unix epoch format.'),
		timezone: z.string().optional().describe('The timezone of the event as an IANA-formatted string.')
	}),
	// Timespan Object
	z.object({
		// eslint-disable-next-line @typescript-eslint/naming-convention
		start_time: z.number().describe('The event\'s start time, in Unix epoch format.'),
		// eslint-disable-next-line @typescript-eslint/naming-convention
		end_time: z.number().describe('The event\'s end time, in Unix epoch format.'),
		// eslint-disable-next-line @typescript-eslint/naming-convention
		start_timezone: z.string().optional().nullable().describe('The timezone of the event\'s start time as an IANA-formatted string.'),
		// eslint-disable-next-line @typescript-eslint/naming-convention
		end_timezone: z.string().optional().nullable().describe('The timezone of the event\'s end time as an IANA-formatted string.')
	}),
	// Date Object
	z.object({
		date: z.string().describe('The date of the event, in ISO 8601 format.')
	}),
	// Datespan Object
	z.object({
		// eslint-disable-next-line @typescript-eslint/naming-convention
		start_date: z.string().describe('The event\'s start date, in ISO 8601 format.'),
		// eslint-disable-next-line @typescript-eslint/naming-convention
		end_date: z.string().describe('The event\'s end date, in ISO 8601 format.')
	})
]).describe('An object that represents the time and duration of an event.');

export const nylasCalendarEventSchema = z.object({
	id: z.string().optional().describe('A unique identifier for the event.'),
	// eslint-disable-next-line @typescript-eslint/naming-convention
	calendar_id: z.string().optional().describe('The ID of the calendar that the event belongs to.'),
	busy: z.boolean().describe('If true, shows the event\'s time block as "busy" on shared or public calendars.'),
	capacity: z.number().optional().describe('The maximum number of participants that may attend the event.'),
	conferencing: nylasCalendarEventConferenceSchema.optional().describe('An object that allows you to automatically create a conference or enter conferencing details manually.'),
	description: z.string().max(8192).optional().nullable().describe('A brief description of the event (for example, its agenda).'),
	// eslint-disable-next-line @typescript-eslint/naming-convention
	hide_participants: z.boolean().optional().describe('When true, hides the event\'s list of participants.'),
	location: z.string().max(255).optional().describe('The location of the event (for example, a physical address or the name of a meeting room).'),
	metadata: z.record(z.string(), z.string()).optional().describe('The metadata associated with the object.'),
	participants: z.array(nylasCalendarEventParticipantSchema).optional().describe('An array of participants or attendees for the event.'),
	resources: z.array(nylasCalendarEventResourceSchema).optional().describe('An array of resources for the event.'),
	recurrence: z.array(z.string()).optional().describe('An array of RRULE and EXDATE strings.'),
	reminders: nylasCalendarEventReminderSchema.optional().describe('A list of reminders to send for the event.'),
	title: z.string().max(1024).describe('The name of the event.'),
	visibility: z.enum(['public', 'private', 'default']).optional().describe('The event\'s visibility. If not defined, the calendar\'s default settings are used.'),
	when: nylasCalendarEventWhenSchema.describe('An object that represents the time and duration of an event.')
});

export interface TypeNylasCalendarEventParticipant extends z.infer<typeof nylasCalendarEventParticipantSchema> {}
export interface TypeNylasCalendarEventResource extends z.infer<typeof nylasCalendarEventResourceSchema> {}
export interface TypeNylasCalendarEventReminderOverride extends z.infer<typeof nylasCalendarEventReminderOverrideSchema> {}
export interface TypeNylasCalendarEventReminder extends z.infer<typeof nylasCalendarEventReminderSchema> {}
export interface TypeNylasCalendarEventConferenceAutocreate extends z.infer<typeof nylasCalendarEventConferenceAutocreateSchema> {}
export interface TypeNylasCalendarEvent extends z.infer<typeof nylasCalendarEventSchema> {}
