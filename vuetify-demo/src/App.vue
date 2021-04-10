<template>
  <v-app>
    <v-app-bar app color="primary" dark> Vue Recorder </v-app-bar>

    <v-main>
      <v-row>
        <v-col cols="5">
          <VueRecorder />
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
import VueRecorder from "./components/VueRecorder";

export default {
  name: "App",

  components: {
    VueRecorder,
  },

  data: () => ({
    //
  }),
};
</script>
