# Calendar Nylas

**Calendar Nylas is a TypeScript library that integrates with the Nylas API to manage calendar events and availability.** This package provides a set of tools and actions to interact with Nylas calendars, making it easy to create, retrieve, update, and delete calendar events, as well as check availability within the Nylas ecosystem.

## Installation

Install the package using pnpm:

```bash
pnpm add @dmitryrechkin/calendar-nylas
```

## Features

- **Calendar Management**: Create, retrieve, update, and delete calendar events with ease.
- **Availability Checking**: Check calendar availability to prevent scheduling conflicts.
- **Nylas API Integration**: Seamlessly interact with the Nylas API, utilizing built-in authentication and request handling.
- **Action-Based Design**: Perform specific calendar operations using dedicated actions, keeping your codebase clean and modular.
- **Platform Independent**: Unlike the original Nylas package, this library is designed to work in serverless environments such as Cloudflare Workers. It avoids dependencies on Node.js-specific modules, ensuring compatibility with various serverless platforms.

## Usage

### Creating a Calendar Event

```typescript
import { CreateCalendarEventAction } from '@dmitryrechkin/calendar-nylas';
import { NylasRequestSender } from '@dmitryrechkin/request-sender-nylas';
import { TypeNylasAuthentication } from '@dmitryrechkin/request-sender-nylas';

const auth: TypeNylasAuthentication = {
    apiKey: 'your-nylas-api-key',
    apiUrl: 'https://api.nylas.com',
    grantId: 'your-grant-id'
};

const nylasSender = new NylasRequestSender(auth);
const createEventAction = new CreateCalendarEventAction(nylasSender);

const eventData = {
    title: 'Team Meeting',
    when: {
        start_time: 1710499200, // Unix timestamp
        end_time: 1710502800   // Unix timestamp
    },
    location: 'Conference Room A',
    participants: ['email@example.com']
};

const response = await createEventAction.execute(eventData);
console.log('Created event ID:', response.data?.id);
```

### Retrieving Calendar Events

```typescript
import { GetCalendarEventsAction } from '@dmitryrechkin/calendar-nylas';
import { NylasRequestSender } from '@dmitryrechkin/request-sender-nylas';

const nylasSender = new NylasRequestSender(auth);
const getEventsAction = new GetCalendarEventsAction(nylasSender);

const response = await getEventsAction.execute({ calendar_id: 'your-calendar-id' });
console.log('Retrieved events:', response.data);
```

### Checking Calendar Availability

```typescript
import { GetCalendarsAvailabilityAction } from '@dmitryrechkin/calendar-nylas';
import { NylasRequestSender } from '@dmitryrechkin/request-sender-nylas';

const nylasSender = new NylasRequestSender(auth);
const availabilityAction = new GetCalendarsAvailabilityAction(nylasSender);

const availabilityResponse = await availabilityAction.execute({
    calendar_id: 'your-calendar-id',
    start_time: 1710499200, // Unix timestamp
    end_time: 1710502800   // Unix timestamp
});

console.log('Availability:', availabilityResponse.data);
```

### Deleting a Calendar Event

```typescript
import { DeleteCalendarEventAction } from '@dmitryrechkin/calendar-nylas';
import { NylasRequestSender } from '@dmitryrechkin/request-sender-nylas';

const nylasSender = new NylasRequestSender(auth);
const deleteEventAction = new DeleteCalendarEventAction(nylasSender);

const deleteResponse = await deleteEventAction.execute({ event_id: 'your-event-id' });
console.log('Deleted event status:', deleteResponse.success);
```

## When to Use

`Calendar Nylas` is perfect for applications that need to integrate with Nylas for managing calendar events and checking availability. It provides a clean, action-based API that simplifies the complexities of interacting with Nylas, allowing you to focus on building features rather than managing API calls.

## Installation & Setup

Install the package using pnpm:

```bash
pnpm add @dmitryrechkin/calendar-nylas
```

Ensure your project is set up to handle TypeScript and supports ES modules, as this library is built with modern JavaScript standards.

## Rationale

### Platform Independence for Serverless Environments

The `Calendar Nylas` library was created to address a significant limitation of the original Nylas package: its dependency on Node.js-specific modules, which makes it incompatible with serverless environments such as Cloudflare Workers. This library is platform-independent, meaning it can be used in serverless platforms without any issues, making it a better fit for modern, cloud-based applications.

### Action-Based Design for Clean Code

The `Calendar Nylas` library is designed with an action-based approach, meaning each calendar operation is encapsulated within a specific action class. This design promotes clean, modular code, making it easier to maintain and extend your application.

- **Focused Actions**: Each action class focuses on a specific operation, such as creating or deleting events, making your code more readable and maintainable.
- **Seamless Integration**: By leveraging the `NylasRequestSender` class from `Request Sender Nylas`, you can easily handle authentication and request sending without writing boilerplate code.
- **Scalable and Extensible**: The action-based architecture allows you to easily add new calendar-related features as your application grows.

## Contributing

Contributions are welcome! Feel free to fork this project and submit pull requests. Before submitting, please ensure your code passes all linting and unit tests.

You can run unit tests using:

```bash
pnpm test
```