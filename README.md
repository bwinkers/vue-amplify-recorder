# vue-amplify-recorder

[![npm](https://img.shields.io/npm/v/vue-amplify-recorder.svg)](https://www.npmjs.com/package/vue-amplify-recorder)
[![npm](https://img.shields.io/npm/dm/vue-amplify-recorder.svg)](https://www.npmjs.com/package/vue-amplify-recorder)
![Contributions welcome](https://img.shields.io/badge/contributions-welcome-orange.svg)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This is a recorder component for VueJs. 
This can take snapshots, video, audio tracks, screen recordings and capture.
It supports uploading the content to Amplify S3 Storage.
There is a JavaScript Lambda function to perform basic processing on the uploads.

See [this](http://caniuse.com/#feat=stream)
for browser compatibility.

## Installation

```bash
npm install vue-amplify-recorder --save
// or
yarn add vue-amplify-recorder
```

## Usage

```js
import Vue from 'vue'
import AmplifyRecorder from "../../src";
Vue.use(AmplifyRecorder);


<vue-amplify-recorder ... />

// or
import { AmplifyRecorder } from "vue-amplify-recorder";

components: {
    AmplifyRecorder
}

<vue-amplify-recorder ... />

components: {
    'vue-amplify-recorder': AmplifyRecorder
}

<vue-amplify-recorder ... />
```

## Nuxt.js

Add `vue-amplify-recorder/nuxt` to modules section of `nuxt.config.js`

```javascript
{
  modules: ['vue-amplify-recorder/nuxt']
}
```

## Testing & Dev

```bash
npm run dev
```

### Props

| prop              | type    | default      | notes                                              |
| ----------------- | ------- | ------------ | -------------------------------------------------- |
| height            | number  | 500          | height of video element                            |
| width             | number  | 500          | width of video element                             |
| autoplay          | boolean | true         | autoplay attribute                                 |
| screenshotFormat  | string  | 'image/jpeg' | format of screenshot                               |
| selectFirstDevice | boolean | false        | select first device when avaialble                 |
| deviceId          | string  | null         | currently selected camera                          |
| playsinline       | boolean | true         | playsinline of video element                       |
| resolution        | object  | null         | object with width and height for camera resolution |

### Events

| name          | param    | notes                                                         |
| ------------- | -------- | ------------------------------------------------------------- |
| started       | stream   | emitted once the stream has started                           |
| stopped       | stream   | emitted once the stream has stopped                           |
| error         | error    | emitted if the stream failed to start with the error returned |
| notsupported  | error    | emitted when the browser does not support this feature        |
| cameras       | cameras  | emitted when a list of all cameras available is loaded        |
| camera-change | deviceId | emitted when camera change occurs                             |
| video-live    | stream   | emitted when video is started                                 |

### Methods

| name         | param    | notes                                                                                                 |
| ------------ | -------- | ----------------------------------------------------------------------------------------------------- |
| snapshot      | void     | Capture the current video player image as a base64 encoded dataUri                                 |
| changeCamera | deviceId | change the currently selected camera. Must pass in the device ID                                      |
| start        | void     | Programmatically Start the camera after stopping it (relies on deviceId prop passed to the component) |
| stop         | void     | Programmatically stop the camera                                                                      |
| pause        | void     | Programmatically pause the camera                                                                     |
| resume       | void     | Programmatically resume the camera after it was paused
| record       | void     | Start recording the current video stream


## Contributing

If you'd like to help make this project better you can help with the following tasks:

- Tests - This project needs a way to test the functionality using a javascript testing solution (Jest as an example)
- Examples - Additional Examples of usage might be helpful to others.
- Project Website - Perhaps launch a project website (on Github Pages) that'll showcase the plugin, Demo, Usage instructions, configuration etc..

## License

MIT

## Credits
This was based off [vue-web-cam](https://www.npmjs.com/package/vue-web-cam). Which was in turn based off [@smronju vue-webcam](https://github.com/smronju/vue-webcam) and [react-webcam](https://github.com/mozmorris/react-webcam).

Image processing and file upload concepts were borrowed from:
[OLD AWS Workshop](https://amplify-workshop.go-aws.com/10_prerequisites.html)
and 
[Nader Dabit's Amplify Photo Sharing Workshop](https://github.com/dabit3/amplify-photo-sharing-workshop)
