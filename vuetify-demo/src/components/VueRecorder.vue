<template>
  <v-row>
    <v-col>
      <v-card v-show="view == 'video'">
        <vue-recorder
          ref="recorder"
          :device-id="deviceId"
          width="100%"
          height="100%"
          @started="onStarted"
          @stopped="onStopped"
          @error="onError"
          @cameras="onCameras"
          @camera-change="onCameraChange"
        />
        <v-card-actions fluid class="justify-center">
          <v-container class="d-flex align-center justify-center" v-if="!isRecording">
            <v-btn class="mx-2" @click="onRecord" fab mdi-icon x-small light
              ><v-icon x-large color="red">mdi-record-circle</v-icon></v-btn
            >
          </v-container>
          <v-container class="d-flex align-center justify-center" v-if="isRecording">
            <v-btn class="mx-2" @click="onRecordStop" fab mdi-icon x-small light
              ><v-icon x-large>mdi-stop-circle</v-icon></v-btn
            >
            <v-btn
              class="mx-2"
              @click="onPause"
              fab
              mdi-icon
              x-small
              light
              v-if="!isPaused"
              ><v-icon x-large>mdi-pause-circle</v-icon></v-btn
            >
            <v-btn
              class="mx-2"
              @click="onResume"
              fab
              mdi-icon
              x-small
              dark
              v-if="isPaused"
              ><v-icon x-large>mdi-pause-circle</v-icon></v-btn
            >
            <v-btn class="mx-2" @click="onSnapshot" fab mdi-icon x-small light
              ><v-icon x-large>mdi-camera-iris</v-icon></v-btn
            >
          </v-container>
        </v-card-actions>
      </v-card>
      <v-card v-show="view == 'selectVideo'" flat> </v-card>
      <v-card v-show="view == 'cameraVideo'" flat> </v-card>
      <v-card v-show="view == 'screenVideo'" flat> </v-card>
      <v-card v-show="view == 'snapshot'">
        <figure class="figure">
          <img :src="img" class="fluid" />
        </figure>
        <v-card-actions fluid class="justify-center">
          <v-container class="d-flex align-center justify-center">
            <v-btn class="mx-2" @click="onCloseSnapshot" fab mdi-icon x-small light
              ><v-icon x-large color="red">mdi-close-circle</v-icon></v-btn
            >
            <v-btn class="mx-2" @click="onSnapshotDownload" fab mdi-icon x-small light
              ><v-icon x-large>mdi-download-circle</v-icon></v-btn
            >
          </v-container>
          </v-card-actions>
      </v-card>
      <v-card v-show="view == 'playVideo'" flat> </v-card>
      <h2>Current Camera</h2>
      <code v-if="device">{{ device.label }}</code>
      <div class="border"></div>

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
          <button type="button" class="btn btn-success" @click="onPause">Pause</button>
          <button type="button" class="btn btn-success" @click="onResume">Resume</button>
        </div>
        <div class="col-md-12">
          <button type="button" class="btn btn-danger" @click="onStop">Stop Video</button>
          <button type="button" class="btn btn-primary" @click="onSnapshot">
            Snapshot
          </button>
        </div>
      </div>

      <div class="col-md-6">
        <h2>Captured Image</h2>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { VueRecorder } from "../../../src";

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
      view: "video",
      isRecording: false,
      isPaused: false,
    };
  },
  computed: {
    device: function () {
      return this.devices.find((n) => n.deviceId === this.deviceId);
    },
  },
  watch: {
    camera: function (id) {
      this.deviceId = id;
    },
    devices: function () {
      // Once we have a list select the first one
      const [first, ...tail] = this.devices;
      console.log(tail);
      if (first) {
        this.camera = first.deviceId;
        this.deviceId = first.deviceId;
      }
    },
  },
  methods: {
    onSnapshot() {
      this.view = 'snapshot'
      this.img = this.$refs.recorder.snapshot();
    },
    onStarted(stream) {
      console.log("On Started Event", stream);
    },
    onStopped(stream) {
      console.log("On Stopped Event", stream);
    },
    onStop() {
      this.$refs.recorder.stop();
    },
    onStart() {
      this.$refs.recorder.start();
    },
    onError(error) {
      console.log("On Error Event", error);
    },
    onCameras(cameras) {
      this.devices = cameras;
      console.log("On Cameras Event", cameras);
    },
    onCameraChange(deviceId) {
      this.deviceId = deviceId;
      this.camera = deviceId;
      console.log("On Camera Change Event", deviceId);
    },
    onCloseSnapshot() {
      this.view = 'video'
      console.log("Closed Snapshot");
    },
    onSnapshotDownload() {
      console.log("Download Snapshot");
      this.$refs.recorder.downloadSnapshot();
    },
    onRecordStop() {
      this.isRecording = false;
      this.$refs.recorder.stopRecording();
    },
    onRecord() {
      this.isRecording = true;
      this.$refs.recorder.startRecording();
    },
    onScreenshare() {
      this.$refs.recorder.startScreenshare();
    },
    onPause() {
      this.isPaused = true;
      this.$refs.recorder.pause();
    },
    onResume() {
      this.isPaused = false;
      this.$refs.recorder.resume();
    },
  },
};
</script>
