<template>
  <v-row class="fluid align-center justify-center" >
    <v-col>
      <v-card v-show="view == 'video'">
        <vue-recorder
          ref="recorder"
          :device-id="deviceId"
          @started="onStarted"
          @stopped="onStopped"
          @error="onError"
          @cameras="onCameras"
          @video-change="onVideoChange"
          @new-recording="onNewRecording"
          screenshotFormat="image/png"
        />
        <v-card-actions fluid class="justify-center">
          <v-container class="d-flex align-center justify-center" v-if="controls=='videoInput'">
            <v-select :items="videoOptions" v-model="videoSource" label="Select video input">
            </v-select>
          </v-container>
          <v-container class="d-flex align-center justify-center" v-if="controls=='liveVideo'">
            <v-btn class="mx-2" @click="record" fab mdi-icon x-small light
              ><v-icon x-large color="red">mdi-record-circle</v-icon></v-btn
            >
            <v-btn class="mx-2" @click="snapshot" fab mdi-icon x-small light
              ><v-icon x-large>mdi-camera-iris</v-icon></v-btn
            >
            <v-btn class="mx-2" @click="stop" fab mdi-icon x-small light
              ><v-icon x-large>mdi-close-circle</v-icon></v-btn
            >
          </v-container>
          <v-container class="d-flex align-center justify-center" v-if="controls=='recording'">
            <v-btn class="mx-2" @click="recordStop" fab mdi-icon x-small light
              ><v-icon x-large>mdi-stop-circle</v-icon></v-btn
            >
            <v-btn
              class="mx-2"
              @click="pause"
              fab
              mdi-icon
              x-small
              light
              v-if="!isPaused"
              ><v-icon x-large>mdi-pause-circle</v-icon></v-btn
            >
            <v-btn
              class="mx-2"
              @click="resume"
              fab
              mdi-icon
              x-small
              dark
              v-if="isPaused"
              ><v-icon x-large>mdi-pause-circle</v-icon></v-btn
            >
            <v-btn class="mx-2" @click="snapshot" fab mdi-icon x-small light
              ><v-icon x-large>mdi-camera-iris</v-icon></v-btn
            >
          </v-container>
        </v-card-actions>
      </v-card>
      <v-card v-show="view == 'snapshot'">
        <img :src="img" width="100%" height="100%"/>
        <v-card-actions fluid class="justify-center">
          <v-container class="d-flex align-center justify-center">
            <v-btn class="mx-2" @click="closeSnapshot" fab mdi-icon x-small light
              ><v-icon x-large color="red">mdi-close-circle</v-icon></v-btn
            >
            <v-btn class="mx-2" @click="snapshotDownload" fab mdi-icon x-small light
              ><v-icon x-large>mdi-download-circle</v-icon></v-btn
            >
          </v-container>
        </v-card-actions>
      </v-card>
      <v-card v-show="view == 'playVideo'" flat> </v-card>
      <v-row>
        <v-col>
          <v-card>
          <v-card-title>Recordings</v-card-title>

          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left"></th>
                  <th class="text-left">Name</th>
                  <th class="text-left">Caption</th>
                  <th class="text-left">Size</th>
                  <th class="text-left">Type</th>
                  <th class="text-left">Download</th>
                  <th class="text-left">Upload</th>
                  <th class="text-left">Play</th>
                  <th class="text-left">Delete</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in recordings" :key="index">
                  <td class="text-left">{{ index + 1 }}</td>
                  <td class="text-left">{{ item.name }}</td>
                  <td class="text-left">
                    {{ item.caption
                    }}<v-icon @click="editRecordingCaption(index)"
                      >mdi-pencil</v-icon
                    >
                  </td>
                  <td class="text-left">{{ item.size }}</td>
                  <td class="text-left">{{ item.type.slice(0, 5) }}</td>
                  <td class="text-left">
                    <v-btn icon medium @click="onDownloadRecording(index)"
                      ><v-icon medium color="green darken-2"
                        >mdi-download</v-icon
                      ></v-btn
                    >
                  </td>
                  <td class="text-left">
                    <v-icon
                      medium
                      color="green darken-2"
                      @click="onUploadRecording(index)"
                      >mdi-upload</v-icon
                    >
                  </td>
                  <td class="text-left">
                    <v-icon
                      medium
                      color="green darken-2"
                      @click="onLoadRecording(index)"
                      >mdi-play</v-icon
                    >
                  </td>
                  <td class="text-left">
                    <v-icon
                      medium
                      color="red lighten-1"
                      @click="onDeleteRecording(index)"
                      >mdi-delete</v-icon
                    >
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { Multicorder } from "../../../src";

export default {
  name: "App",
  components: {
    "vue-recorder": Multicorder,
  },
  data() {
    return {
      img: null,
      videoSource: null,
      deviceId: null,
      devices: [],
      view: "video",
      isPaused: false,
      controls: 'videoInput',
      staticVideoOptions: [
        {
          divider: true,
          header: "Screen Sharing"
        },
        {
          text: "Screen share",
          value: "screenshare"
        }
      ],
      cameraVideoOptionsHeader: [
        {
          divider: true,
          header: "Cameras"
        }
      ]
    };
  },
  computed: {
    device: function () {
      return this.devices.find((n) => n.deviceId === this.deviceId);
    },
    videoOptions: function () {
      const cameras = this.cameraVideoOptionsHeader;
      const devices = this.devices;
      devices.forEach(device => {
        cameras.push({text: device.label, value: device.deviceId});
      }
      );
      
      const options = [...cameras, ...this.staticVideoOptions];
      return options;
    }
  },
  watch: {
    videoSource: function (id) {
      if(id) {
        this.deviceId = id;
        this.controls = 'liveVideo'
      }
    },
  },
  methods: {
    snapshot() {
      this.view = "snapshot";
      this.img = this.$refs.recorder.takeSnapshot();
    },
    onStarted(stream) {
      console.log("On Started Event", stream);
    },
    onStopped(stream) {
      console.log("On Stopped Event", stream);
    },
    stop() {
      this.$refs.recorder.stop();
      this.controls = 'videoInput';
      this.videoSource = null;
      this.deviceId = null;
    },
    start() {
      this.$refs.recorder.start();
    },
    onError(error) {
      console.log("On Error Event", error);
    },
    onCameras(cameras) {
      this.devices = cameras;
      console.log("On Cameras Event", cameras);
    },
    onVideoChange(deviceId) {
      console.log(deviceId);
      if(deviceId == 'screenshare') {
        console.log(deviceId);
      } else {
        this.deviceId = deviceId;
        this.videoSource = deviceId;
      }
      
      console.log("On Video Change Event", deviceId);
    },
    closeSnapshot() {
      this.view = "video";
      this.img = null;
      this.$refs.recorder.deleteSnapshot()
      console.log("Closed Snapshot");
    },
    snapshotDownload() {
      console.log("Download Snapshot");
      this.$refs.recorder.downloadSnapshot();
    },
    recordStop() {
      this.controls = 'liveVideo';
      this.$refs.recorder.stopRecording();
      // resume the video, minus recording
      this.resume()
    },
    record() {
      this.controls = 'recording';
      this.$refs.recorder.startRecording();
    },
    screenshare() {
      this.$refs.recorder.startScreenshare();
    },
    pause() {
      this.isPaused = true;
      this.$refs.recorder.pause();
    },
    resume() {
      this.isPaused = false;
      this.$refs.recorder.resume();
    },
  },
};
</script>
