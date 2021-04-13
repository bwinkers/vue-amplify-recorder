<template>
  <video
    ref="video"
    :width="width"
    :height="height"
    :src="source"
    :autoplay="autoplay"
    :playsinline="playsinline"
  />
</template>

<script>
import { v4 as uuidv4 } from "uuid";

export default {
  name: "VueRecorder",

  props: {
    width: {
      type: [Number, String],
      default: "100%"
    },
    height: {
      type: [Number, String],
      default: "100%"
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    screenshotFormat: {
      type: String,
      default: "image/jpeg"
    },
    deviceId: {
      type: String,
      default: null
    },
    playsinline: {
      type: Boolean,
      default: true
    },
    resolution: {
      type: Object,
      default: null,
      validator: value => {
        return value.height && value.width;
      }
    }
  },
  data() {
    return {
      source: null,
      canvas: null,
      camerasListEmitted: false,
      cameras: [],
      recorder: null,
      recordings: [],
      snapshot: null
    };
  },

  watch: {
    deviceId: function(id) {
      this.changeVideoInput(id);
    }
  },

  mounted() {
    this.setupMedia();
  },

  beforeDestroy() {
    this.stop();
  },

  methods: {
    /**
     * get user media
     */
    legacyGetUserMediaSupport() {
      return constraints => {
        // First get ahold of the legacy getUserMedia, if present
        let getUserMedia =
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia ||
          navigator.msGetUserMedia ||
          navigator.oGetUserMedia;

        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
          return Promise.reject(
            new Error("getUserMedia is not implemented in this browser")
          );
        }

        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function(resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    },

    /**
     * setup media
     */
    setupMedia() {
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }

      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = this.legacyGetUserMediaSupport();
      }

      this.testMediaAccess();
    },

    /**
     * load available cameras
     */
    loadCameras() {
      navigator.mediaDevices
        .enumerateDevices()
        .then(deviceInfos => {
          for (let i = 0; i !== deviceInfos.length; ++i) {
            let deviceInfo = deviceInfos[i];
            if (deviceInfo.kind === "videoinput") {
              this.cameras.push(deviceInfo);
            }
          }
        })
        .then(() => {
          if (!this.camerasListEmitted) {
            //if (this.selectFirstDevice && this.cameras.length > 0) {
            //  console.log("Using first device");
            //  this.deviceId = this.cameras[0].deviceId;
            //}

            this.$emit("cameras", this.cameras);
            this.camerasListEmitted = true;
          }
        })
        .catch(error => this.$emit("notsupported", error));
    },

    /**
     * change to a different input stream, like front and back camera on phones or screenshare
     */
    changeVideoInput(deviceId) {
      this.stop();
      this.$emit("camera-change", deviceId);
      if (deviceId) {
        if (deviceId != "screenshare") {
          this.loadCamera(deviceId);
        } else if (deviceId == "screenshare") {
          this.startScreenshare();
        }
      }
    },

    /**
     * load the stream to the
     */
    loadSrcStream(stream) {
      if ("srcObject" in this.$refs.video) {
        // new browsers api
        this.$refs.video.srcObject = stream;
      } else {
        // old broswers
        this.source = window.HTMLMediaElement.srcObject(stream);
      }
      // Emit video start/live event
      this.$refs.video.onloadedmetadata = () => {
        this.$emit("video-live", stream);
      };

      this.$emit("started", stream);
    },

    /**
     * stop the selected streamed video to change camera or switch to screenshare
     */
    stopStreamedVideo(videoElem) {
      let stream = videoElem.srcObject;
      let tracks = stream.getTracks();

      tracks.forEach(track => {
        // stops the video track
        track.stop();
        this.$emit("stopped", stream);

        this.$refs.video.srcObject = null;
        this.source = null;
      });
    },

    // stop the video from camera or screenshare
    stop() {
      if (this.$refs.video !== null && this.$refs.video.srcObject) {
        this.stopStreamedVideo(this.$refs.video);
      }
    },

    // start the video camera
    startCamera() {
      //this.stop(); // in case screensharing is active
      if (this.deviceId) {
        this.loadCamera(this.deviceId);
      }
    },

    // pause the video
    pause() {
      if (this.$refs.video !== null && this.$refs.video.srcObject) {
        this.$refs.video.pause();
      }
    },

    // resume the video
    resume() {
      if (this.$refs.video !== null && this.$refs.video.srcObject) {
        this.$refs.video.play();
      }
    },

    /**
     * test access
     */
    testMediaAccess() {
      let constraints = { video: true };

      if (this.resolution) {
        constraints.video = {};
        constraints.video.height = this.resolution.height;
        constraints.video.width = this.resolution.width;
      }

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          //Make sure to stop this MediaStream
          let tracks = stream.getTracks();
          tracks.forEach(track => {
            track.stop();
          });
          this.loadCameras();
        })
        .catch(error => this.$emit("error", error));
    },

    /**
     * load the camera passed as index!
     */
    loadCamera(device) {
      let constraints = { video: { deviceId: { exact: device } } };

      if (this.resolution) {
        constraints.video.height = this.resolution.height;
        constraints.video.width = this.resolution.width;
      }

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => this.loadSrcStream(stream))
        .catch(error => this.$emit("error", error));
    },

    /**
     * capture snapshot of current video
     */
    takeSnapshot() {
      this.snapshot = this.getCanvas().toDataURL(this.screenshotFormat);
      return this.snapshot;
    },

    /**
     * Delete the snapshot to save memory
     */
    async deleteSnapshot() {
      this.snapshot = null;
    },

    /**
     * download snapshot captured from video
     */
    async downloadSnapshot() {
      const imgInfo = await this.dataURItoBlob(this.snapshot);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = this.snapshot;
      const uid = await uuidv4();
      a.download = uid + imgInfo.type.split("/").pop();
      a.click();
    },

    /**
     * convert base64/URLEncoded data to binary object that can be uploaded and downloaded
     */
    async dataURItoBlob(dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(",")[0].indexOf("base64") >= 0)
        byteString = atob(dataURI.split(",")[1]);
      else byteString = unescape(dataURI.split(",")[1]);

      // separate out the mime component
      var mimeString = dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];

      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ia], { type: mimeString });
    },

    /**
     * get canvas
     */
    getCanvas() {
      let video = this.$refs.video;
      console.log(video);
      if (!this.ctx) {
        let canvas = document.createElement("canvas");
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        this.canvas = canvas;

        this.ctx = canvas.getContext("2d");
      }

      const { ctx, canvas } = this;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      return canvas;
    },

    /**
     * Start recording the current video
     */
    async startRecording() {
      const stream = this.$refs.video.srcObject;
      const recorder = new MediaRecorder(stream);
      this.recorder = recorder;

      this.recorder.ondataavailable = event => this.pushVideoData(event.data);
      this.recorder.start();
      console.log(this.recorder.state);
    },

    /**
     * Stop recording
     */
    async stopRecording() {
      if (this.$refs.video !== null && this.$refs.video.srcObject) {
        this.recorder.stop();
        console.log(this.recorder.state);
      }
    },
    /**
     * Push a recorded data blob onto recordings
     */
    async pushVideoData(data) {
      if (data.size > 0) {
        const uid = await uuidv4();
        data.name = "clip-" + uid + ".webm";
        console.log("pushing video: " + data.name);
        this.recordings.push(data);
      }
    },
    async startScreenshare() {
      console.log("Starting Screenshare");

      this.stop();

      let stream = null;

      try {
        stream = await navigator.mediaDevices.getDisplayMedia();
        this.loadSrcStream(stream);
      } catch (err) {
        console.error("Error: " + err);
      }
      console.log(this.$refs.video);
    },
    stopScreenshare() {
      console.log("Stopping Screenshare");
      this.stop();
    }
  }
};
</script>
