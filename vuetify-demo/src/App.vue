<template>
  <v-app>
    <v-app-bar app color="primary" dark> Vue Recorder </v-app-bar>

    <v-main>
      <v-row>
        <v-col cols="5">
          <Multicorder />
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
import Multicorder from "./components/Multicorder";

export default {
  name: "App",

  components: {
    Multicorder,
  },

  data: () => ({
    //
  }),
};
</script>
