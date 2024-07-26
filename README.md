# React Native Chat Application

This project is a React Native chat application using Expo, Redux Toolkit, Firebase, and MongoDB. Follow the steps below to initialize, install, and run the project.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Installation](#installation)
4. [MongoDB Setup](#mongodb-setup)
5. [Setup .env and config files](#usage)
6. [Running the Project](#running-the-project)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Version 14.x or higher.
- **Expo CLI**: Install Expo CLI globally with `npm install -g expo-cli`.
- **Git**: Ensure Git is installed to manage the repository.

## Project Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```
2. Install project dependencies in `frontend` and `backend` directories:
    ```bash
   npm install
   ```
    or
    ```bash
   yarn install
   ```
## Installation

1. Install Expo CLI if not already installed:
 ```bash
 npm install -g expo-cli
 ```
or
```bash
yarn install -g expo-cli
```

## MongoDB Setup
1. **Install MongoDB:** Follow the [official MongoDB installation guide](https://www.mongodb.com/docs/manual/installation/) for your operating system.
2. **Create a MongoDB database:** You can create a local or cloud-based MongoDB instance.

## Setup .env file
1. Create `.env` file in backend directory.
2. Create `config.ts` file in backend directory.
3. Write Your secret variables using `.example` files.

## Running the Project
1. You can use ```npm start``` or ```yarn start``` for running the project in `frontend` and `backend` directories.
**Note:** Use it separately!
2. Run the project on a physical device or emulator:
- **For iOS:** Scan the QR code with the Expo Go app on your iPhone or iPad.
- **For Android:** Scan the QR code with the Expo Go app on your Android device.
