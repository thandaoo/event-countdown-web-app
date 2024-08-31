# Event Countdown App

## Live Demo

The application has been deployed and is accessible via the following URL:

 [Live Demo URL](<https://thandaoo.github.io/event-countdown-web-app/>)

## About

This project is a countdown web app built with Angular and TypeScript. It allows users to set an event name and end date, displaying the remaining time in days, hours, minutes, and seconds. The app features dynamic text fitting, adjusting text size to perfectly fit the screen in both portrait and landscape modes. Event details are saved between sessions for persistence.

## Features

- **Event Countdown**: Displays the remaining time until a specified event, starting from the current time.
- **Dynamic Text Resizing**: Implements a custom algorithm to ensure that the text (event name and countdown) always fits the entire width of the screen without line breaks.
- **Responsive Design**: Works in both portrait and landscape modes.
- **Data Persistence**: The event name and date are saved to local storage and persisted across page reloads.
- **Reusable Components**: The text fitting solution is reusable and can be applied to other elements or components in the application.

## Tech Stack

- **Angular**: Latest stable version (v18.2.0).
- **TypeScript**: Type-based Angular.
- **Luxon**: Date handling and manipulation.
- **RxJS**: Used for handling asynchronous events.
- **Angular Material**: UI components

## Setup Instructions

### Prerequisites

- Node.js (version 22.4.1)
- npm (version 10.8.1)
- Angular CLI (optional)

### Installation

1. **Clone the repository**:

   ```bash
   git clone <https://github.com/thandaoo/event-countdown-web-app.git>
   cd event-countdown-web-app

2. **Install dependencies**:

    ```bash
    npm install

3. **Run the application**:

    ```bash
    ng serve

## Author

- [@thandaoo](https://github.com/thandaoo)
- [LinkedIn](https://www.linkedin.com/in/thanda-oo/)
