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
7. [Known Issues](#known-issues)
8. [Screenshots](#screenshots)

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
1. When we using [react-native-mmkv-storage](https://github.com/ammarahm-ed/react-native-mmkv-storage), have problem after prebuild app. We can't create storage and have following errors:
- JSI bindings were not installed for: MMKVNative
- Error: MMKVNative bindings not installed, js engine: hermes

## Screenshots
![Profile](https://private-user-images.githubusercontent.com/100965013/356807080-8eb60305-19c8-40bc-95b5-5af5ebc84d8f.jpg?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MjMyODc5NjEsIm5iZiI6MTcyMzI4NzY2MSwicGF0aCI6Ii8xMDA5NjUwMTMvMzU2ODA3MDgwLThlYjYwMzA1LTE5YzgtNDBiYy05NWI1LTVhZjVlYmM4NGQ4Zi5qcGc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwODEwJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDgxMFQxMTAxMDFaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0yMGJhMjViMTU5NDk2ZDA5M2FlYzEwZjEzMmUzZGMxMDU4NDdhYWE5NmEwZGNjZTcyNjdlNmM2NTlmNThkMDRjJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.Zo_1H9j69TCwyNEwCd6jHv8CLyPUSabZi25K64dHGiw)
![Drawer](https://private-user-images.githubusercontent.com/100965013/356807077-3d19d756-eb49-454b-b808-e3d3a7606e89.jpg?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MjMyODc5NjEsIm5iZiI6MTcyMzI4NzY2MSwicGF0aCI6Ii8xMDA5NjUwMTMvMzU2ODA3MDc3LTNkMTlkNzU2LWViNDktNDU0Yi1iODA4LWUzZDNhNzYwNmU4OS5qcGc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwODEwJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDgxMFQxMTAxMDFaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1iYTMwZDc4MDliNDhjYmI4YzhhYTk4YWZjNzYxODdlZGUxMDkwZWMyNDdlYTcyYmQ1NDBiYzk2MzAyNWRiZjVhJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.zaXzI0TBF9Ng7DG1G47J--i9s5NeS7Pw5BnTpQvBxgI)
![Chats page](https://private-user-images.githubusercontent.com/100965013/356807074-39c9f69a-312f-4087-86b9-c009d510274d.jpg?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MjMyODc5NjEsIm5iZiI6MTcyMzI4NzY2MSwicGF0aCI6Ii8xMDA5NjUwMTMvMzU2ODA3MDc0LTM5YzlmNjlhLTMxMmYtNDA4Ny04NmI5LWMwMDlkNTEwMjc0ZC5qcGc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwODEwJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDgxMFQxMTAxMDFaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0yNWVkMGY5NTc5ZjE4NDcxZDEyZTNhZmExNTU1MGJjNDgwM2Y4MjM3ZGU4YzYwNjk5YTdkMDQwNWM5MWJlMjFkJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.WMh0C-zwIfe2YBLMgZ7dE45752tiNMD75NFXIGSnJY0)
![Chat](https://private-user-images.githubusercontent.com/100965013/356807076-7afeb82e-67b7-4d05-b746-94a0279d777c.jpg?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MjMyODc5NjEsIm5iZiI6MTcyMzI4NzY2MSwicGF0aCI6Ii8xMDA5NjUwMTMvMzU2ODA3MDc2LTdhZmViODJlLTY3YjctNGQwNS1iNzQ2LTk0YTAyNzlkNzc3Yy5qcGc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwODEwJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDgxMFQxMTAxMDFaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT02MGI5NjQyZDFhMmIwZGMwN2YyOGRhZDhhZmExNDEzYjAzZWRlYTllYWYwYzFiMjBhNWVhZDg4ZDcxOTU5OWUyJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.PLOvAa568YfFOV6MeNkCJyNAG21ScQQpSzzv9mlaLoc)
![Chat settings page](https://private-user-images.githubusercontent.com/100965013/356807079-0f9b2091-7c9d-4c18-baaf-8592201b061a.jpg?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MjMyODc5NjEsIm5iZiI6MTcyMzI4NzY2MSwicGF0aCI6Ii8xMDA5NjUwMTMvMzU2ODA3MDc5LTBmOWIyMDkxLTdjOWQtNGMxOC1iYWFmLTg1OTIyMDFiMDYxYS5qcGc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwODEwJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDgxMFQxMTAxMDFaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT00ZDdkMTc3NWQ2OTZiOTM5NWNiNTE1N2MzNjM4NWE5ZDhiMDBmMDRiZGFlMmFkNzUwNDFiMWVmMmNmYmIwM2FiJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.WgQvAEu_16ijfAlHLXBF5-uT_Ghcgx0RX7kulTsuJHM)
![Change wallpaper page](https://private-user-images.githubusercontent.com/100965013/356807073-2a6091be-38f9-42f1-ba27-499d36b329ae.jpg?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MjMyODc5NjEsIm5iZiI6MTcyMzI4NzY2MSwicGF0aCI6Ii8xMDA5NjUwMTMvMzU2ODA3MDczLTJhNjA5MWJlLTM4ZjktNDJmMS1iYTI3LTQ5OWQzNmIzMjlhZS5qcGc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwODEwJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDgxMFQxMTAxMDFaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0zODkwZjNmZGU4NjA5NDI2ZTk3OWFhM2E2NjZiODgwMjEyOTY4MTQ1MDNiYzZlYjY1MDY0MGRhMDM2MjY2OWJiJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.FESRT4vbdNhpLRbYBGl_2QVmr-GtM3g0vRy_L_3q0OA)
![Set gradient wallpaper page](https://private-user-images.githubusercontent.com/100965013/356807072-1d93a669-60b7-4a44-8187-2aab006ce06c.jpg?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MjMyODc5NjEsIm5iZiI6MTcyMzI4NzY2MSwicGF0aCI6Ii8xMDA5NjUwMTMvMzU2ODA3MDcyLTFkOTNhNjY5LTYwYjctNGE0NC04MTg3LTJhYWIwMDZjZTA2Yy5qcGc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwODEwJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDgxMFQxMTAxMDFaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0yZmVkNGRiZWM1ODE5YzI4MjQ0OGYxMWYwYjhiZWVlMGQ2ZTk4ZTBiZDllZTY0Y2IyNzZmNzlmODRjMjUxZDFjJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.dqxWF85p4ueAB2R77U_pL18cN7MdNlgMKu997tJb_tI)
