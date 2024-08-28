import { type TransformerInterface } from '@dmitryrechkin/foundation-core';
import { type TypeCalendar } from '@dmitryrechkin/calendar-core';
import { type TypeNylasCalendar } from '../Type/NylasCalendar';

export class FromNylasCalendarTransformer implements TransformerInterface<TypeNylasCalendar, TypeCalendar>
{
	/**
	 * Transforms a Nylas calendar object to a custom TypeCalendar object
	 *
	 * @param {TypeNylasCalendar | undefined} input - The Nylas calendar object
	 * @returns {TypeCalendar | undefined} - The transformed custom calendar object
	 */
	public transform(input: TypeNylasCalendar | undefined): TypeCalendar | undefined
	{
		if (!input)
		{
			return undefined;
		}

		return {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			id: input.id,
			name: input.name,
			description: input.description || '',
			timezone: input.timezone || '',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			readOnly: !!input.read_only,
			location: input.location || '',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			isPrimary: !!input.is_primary,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			isOwnedByUser: !!input.is_owned_by_user
		};
	}
}
