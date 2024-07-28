# React Native Mobile Chat Application

This project is a React Native chat application using Expo, Redux Toolkit, Node.js, and MongoDB, Express.js and other libraries. 
Follow the steps below to initialize, install, and run the project.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Installation](#installation)
4. [MongoDB Setup](#mongodb-setup)
5. [Setup .env and config files](#setup-env-and-config-files)
6. [Running the Project](#running-the-project)
6. [Known Issues](#known-issues)

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
3. Create directories `public/avatars` and `public/chat/messages/` in `backend` directory. If you don't create it, server should be create it.

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

## Setup env and config files
1. Create `.env` file in `backend` directory.
2. Create `config.ts` file in `frontend` directory.
3. Write Your secret constants using `.example` files as example.

## Running the Project
1. You can use ```npm start``` or ```yarn start``` for running the project in `frontend` and `backend` directories.
**Note:** Use it separately!
2. Run the project on a physical device or emulator:
- **For iOS:** Scan the QR code with the Expo Go app on your iPhone or iPad.
- **For Android:** Scan the QR code with the Expo Go app on your Android device.

## Known Issues
***Note:** If you know how to resolve some issues, please send me it to e-mail [zermankarim@gmail.com](zermankarim@gmail.com)*

- You must create directories `public/avatars` and `public/chat/messages`, because they ignored in `.gitignore` as `public/avatars/*` and `public/chat/messages/*`. It should be set to prevent commiting pictures.
