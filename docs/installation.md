# Installation

## Browser

Go to [https://painting-droid-web.vercel.app](https://painting-droid-web.vercel.app/)

Supported desktop browsers:

* Chrome
* Safari
* Firefox

The app has limited support for touch gestures, so it may or may not work correctly on your mobile device.

## Desktop

Go to [https://github.com/mateuszmigas/painting-droid/releases](https://github.com/mateuszmigas/painting-droid/releases) and download the version that matches your operating system.\
\
Supported platforms:

* Windows 7 and above
* macOS 10.15 and above
* Linux with webkit2gtk 4.1  (for example Ubuntu 22.04)

## Flatpak

To install the application using Flatpak, run the following command:

```sh
flatpak install flathub com.paintingdroid.PaintingDroid
```

For more details, visit the [Flathub page for Painting Droid](https://flathub.org/apps/details/com.paintingdroid.PaintingDroid).

## Self-hosted

The app can be hosted on anything that can run Docker containers. A lightweight image that contains only the necessary runtime is available at [https://hub.docker.com/r/mateuszmigas/painting-droid](https://hub.docker.com/r/mateuszmigas/painting-droid).\


To run it locally in Docker execute:

`docker run -p 3010:80 mateuszmigas/painting-droid`

where 3010 is the port you want to expose. Then navigate to [http://localhost:3010](http://localhost:3010/)
