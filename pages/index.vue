<template>
  <v-container>
    <v-row>
      <v-col cols="8" offset="2">
        <v-alert type="info" class="mb-5" closable>
          <div>Entrez le code correspondant à votre requête dans la boite de texte ci-dessous.</div>
          <div>Cliquez ensuite sur "Valider".</div>
          <div>Les résultats devraient s'afficher dans un tableau sous la boite de texte si tout s'est bien passé.</div>
          <div><b>ATTENTION</b> N'oubliez pas d'ajouter un return explicite comme dans l'exemple donné pour renvoyer un résultat.</div>
        </v-alert>
        <!--v-textarea variant="outlined" no-resize rows="15" bg-color="white" label="Requête" placeholder="db.collection...." v-model="query" /-->
        <HighCode
          class="code"
          :codeValue="query"
          width="100%"
          height="500px"
          lang="javascript"
          theme="light"
          :textEditor="true"
          ref="query"
        ></HighCode>
        <v-btn color="primary" class="mt-5" @click="validate">Valider</v-btn>
      </v-col>
      <!-- The list of results-->
      <v-col cols="8" offset="2" v-if="results">
        <!-- In the case the results are an array, it dynamically draws it -->
        <v-data-table v-if="(results instanceof Array)" :items="results" />
        <pre v-else>{{ results }}</pre>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import axios from 'axios';
import { HighCode } from 'vue-highlight-code';
import 'vue-highlight-code/dist/style.css';

const query = ref('return db.books.find({}, {title: 1}).limit(10);');

onMounted(() => {
  const stored = localStorage.getItem("sandbox-code")
  if (!!stored) query.value.modelValue = stored;
})

const results = ref(false);

async function validate() {
  localStorage.setItem("sandbox-code", query.value.modelValue);
  results.value = (await axios.post("/queries", {query: query.value.modelValue})).data;
  console.log(results.value);
}
</script>

<style scoped>
.wrapped {
  white-space: nowrap
}
</style>