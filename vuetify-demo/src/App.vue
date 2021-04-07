<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
     Vue Recorder
    </v-app-bar>

    <v-main>
      <VueRecorder/>
    </v-main>
  </v-app>
</template>

<script>
import VueRecorder from './components/VueRecorder';

export default {
  name: 'App',

  components: {
    VueRecorder,
  },

  data: () => ({
    //
  }),
};
</script>
