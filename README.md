# Wildlife Watcher mobile app

Welcome to the development repository of the Wildlife Watcher mobile app. This document provides instructions for setting up and running the project on your local machine.

The Wildlife Watcher mobile app allows users to communicate with Wildlife Watcher cameras that record animals and use AI to identify them.

**Project Overview**: [Watch on YouTube](https://www.youtube.com/watch?v=Ima3n2EYfeE)

## Prerequisites

You need to make sure your environment is set up as per the official React Native documentation - [link here](https://reactnative.dev/docs/set-up-your-environment). If you can run a fresh React Native app, you should be able to run this one without any problems.

Make sure you have the following prerequisites installed on your machine:

- **Node.js**: Version 18 or higher
- **Ruby**: Version 2.6.10 or higher

## Getting Started

1. Clone this repository to your local machine:

    ```bash
    git clone https://github.com/your-username/your-project.git
    cd your-project
    ```

2. Install project dependencies:

    ```bash
    npm install
    ```

3. Start the Metro bundler:

    ```bash
    npx react-native start
    ```

## iOS Setup

For iOS development, follow these additional steps:

1. Install Bundler and necessary gems:

    ```bash
    gem install bundler
    bundle install
    ```

2. Prepare Pods:

    ```bash
    bundle exec pod install --project-directory=ios
    ```

3. Run the project in development mode:

    ```bash
    npx react-native run-ios
    ```

## Android Setup

For Android development, run the project in development mode:

```bash
npx react-native run-android
```

## Releasing

Building the app is fully automated via GitHub actions, however, since it's still in Beta you can only release it until the AppTester/Testflight step. Will update the docs once the app is ready for production.

## Contributing

If you wish to contribute to this project, submit a [pull request](https://github.com/wildlifeai/wildlife-watcher-mobile-app/pulls).

## Created & Maintained By

- [Miha Drofenik](https://github.com/Burzo)
- [Victor Anton](https://github.com/victor-wildlife)

If you find this project helpful, consider [donating to Wildlife.ai](https://givealittle.co.nz/donate/org/wildlifeai)
