# TasKit

Toolkit to manage personal and team tasks

<p align="center">
  <img src="images/logo-readme-1.png" />
</p>



Trash Walk is a mobile (iOS) app aimed at helping us make the world a cleaner place! The app is a tool for people cleaning (doing "trash walks"), and uses their phones GPS to save their walks to a shared database. This brings two main benefits:

1. It documents the efforts made, for the ones volunteering their time (and everyone else!).
2. Make the activitity more gratifying to the trash walkers themselves by "gamification" and social functions.

## Screenshots

<p align="center">
  <img src="images/10.png" />
</p>



## Getting started

Except for the regular suspects; git, Node, npm, you need these things to work on the Trash Walk app. Follow the instructions supplied below them or on their links to get them up and running before you continue with *Installation*.

* Xcode (latest version, at least >9.3). Install from App Store.
* [Cocoapods](https://cocoapods.org) - a dependency manager for Swift and Objective-C Cocoa projects. 
  ```sudo gem install cocoapods```
* [Expo XDE](https://www.expo.io) - the Expo development environment.
  ```npm install -g exp```

**Recommended!**

* The [Trash Walk backend](https://github.com/cherlin/trash-walk-backend) is highly recommended as well, if you want any sort of useful interaction with the app.
* [React Native Debugger](https://github.com/jhen0409/react-native-debugger) - a debugger built on the Chrome debugger, including React and Redux Dev Tools.

## Installation

1. Clone this repo and enter!

   ```bash
   git clone https://github.com/cherlin/trash-walk-frontend.git
   cd trash-walk-frontend
   ```

2. Install dependencies.

   ```bash
   npm install
   cd ios			# ! Change into the ios folder !
   pod install
   ```

3. While in the ios folder, run ````exp start```` to start the Expo development environment that will build the JS bundle for your app.

4. Run the **_trash-walk.xcworkspace_** file in Xcode (**NOT** the *trash-walk.xcodeproj*).

5. Set up an **Identity** for the app under *General* in Xcode. You will need to pick a bundle name that will be unique to the particular certificate that you then have to generate under **Signing**

6. Build the app! (click the Play-button in the top left corner when you have picked your target in the drop-down to the right of it.)

## Tech Stack

* [React Native](https://facebook.github.io/react-native/) (ejected from Expo)
* [Redux](https://redux.js.org/)
* Other dependencies:
  * [React Native Background Geolocation](https://github.com/transistorsoft/react-native-background-geolocation)
  * [React Native Maps](https://github.com/react-community/react-native-maps)

## Developers

* Christofer Herlin - [GitHub](https://github.com/cherlin) - [LinkedIn](https://www.linkedin.com/in/cherl/)
* Juliane Nagao - [GitHub](https://github.com/junagao) - [LinkedIn](https://www.linkedin.com/in/junagao/)
* Necati Özmen - [GitHub](https://github.com/necatiozmen) - [LinkedIn](https://www.linkedin.com/in/necatiozmen/)
* Marco Antonio Ghiani - [GitHub](https://github.com/marcoantonioghiani01) - [LinkedIn](https://www.linkedin.com/in/marcoantonioghiani/)
