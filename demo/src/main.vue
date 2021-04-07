<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <h2>Current Camera</h2>
        <code v-if="device">{{ device.label }}</code>
        <div class="border">
          <vue-recorder
            ref="video"
            :device-id="deviceId"
            width="100%"
            @started="onStarted"
            @stopped="onStopped"
            @error="onError"
            @cameras="onCameras"
            @camera-change="onCameraChange"
          />
        </div>

        <div class="row">
          <div class="col-md-12">
            <select v-model="camera">
              <option>-- Select Device --</option>
              <option
                v-for="device in devices"
                :key="device.deviceId"
                :value="device.deviceId"
              >
                {{ device.label }}
              </option>
            </select>
            <button type="button" class="btn btn-success" @click="onStart">
              Start Camera Video
            </button>
          </div>
          <div class="col-md-12">
            <button type="button" class="btn btn-success" @click="onScreenshare">
              Start Screen Share
            </button>
          </div>
          <div class="col-md-12">
            <button type="button" class="btn btn-success" @click="onRecord">
              Start Recording
            </button>
            <button type="button" class="btn btn-success" @click="onRecordStop">
              Stop Recording
            </button>
            <button type="button" class="btn btn-success" @click="onPause">
              Pause
            </button>
            <button type="button" class="btn btn-success" @click="onResume">
              Resume
            </button>
          </div>
          <div class="col-md-12">
            <button type="button" class="btn btn-danger" @click="onStop">
              Stop Video
            </button>
            <button type="button" class="btn btn-primary" @click="onCapture">
              Snapshot
            </button>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <h2>Captured Image</h2>
        <figure class="figure">
          <img :src="img" class="img-responsive" />
        </figure>
      </div>
    </div>
  </div>
</template>

<script>
import { VueRecorder } from "../../src";

export default {
  name: "App",
  components: {
    "vue-recorder": VueRecorder,
  },
  data() {
    return {
      img: null,
      camera: null,
      deviceId: null,
      devices: [],
    };
  },
  computed: {
    device: function () {
      return this.devices.find((n) => n.deviceId === this.deviceId)
    },
  },
  watch: {
    camera: function (id) {
      this.deviceId = id
    },
    devices: function () {
      // Once we have a list select the first one
      const [first, ...tail] = this.devices
      if (first) {
        this.camera = first.deviceId
        this.deviceId = first.deviceId
      }
    },
  },
  methods: {
    onCapture() {
      this.img = this.$refs.video.capture()
    },
    onStarted(stream) {
      console.log("On Started Event", stream)
    },
    onStopped(stream) {
      console.log("On Stopped Event", stream)
    },
    onStop() {
      this.$refs.video.stop()
    },
    onStart() {
      this.$refs.video.start()
    },
    onError(error) {
      console.log("On Error Event", error)
    },
    onCameras(cameras) {
      this.devices = cameras;
      console.log("On Cameras Event", cameras)
    },
    onCameraChange(deviceId) {
      this.deviceId = deviceId
      this.camera = deviceId
      console.log("On Camera Change Event", deviceId)
    },
    onRecordStop() {
      this.$refs.video.stopRecording()
    },
    onRecord() {
      this.$refs.video.startRecording()
    },
    onScreenshare() {
      this.$refs.video.startScreenshare()
    },
    onPause() {
       this.$refs.video.pause() 
    },
    onResume() {
       this.$refs.video.resume() 
    }
  },
};
</script>
