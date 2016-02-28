# Offline Youtube Music
## React Native Implementation

Offline Youtube Music Player (iOS) - implemented on [React Native](https://facebook.github.io/react-native/).

For music download app uses [Youtube MP3](http://www.youtube-mp3.org/).

![Preview 1](/preview.png)

![Preview 2](/preview_2.png)

![Preview 3](/preview_3.png)

#### Installation


```sh
git clone https://github.com/Tomas-Sereikis/youtube-music.git
cd youtube-music

npm install
rnpm link
```

Create `src/PrivateConfig.js` file and add following code.
```javascript
export default {
  GOOGLE_AUTH_CLIENT_ID: '-- your google client id --',
  GOOGLE_AUTH_KEY: '-- your google auth key --',
};
```

Open `YoutubeMusic.xcodeproj` on your Xcode and run on your simulator or local device.

This is work in progress React Native playground...