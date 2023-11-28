<template>
  <v-container>
    <v-row>
      <v-col cols="8">
        <v-textarea variant="outlined" no-resize rows="15" bg-color="white" label="Requête" placeholder="db.collection...." v-model="query" />
        <v-btn color="primary" @click="validate">Valider</v-btn>
      </v-col>
      <v-col cols="4">
        <v-alert type="info" title="structure">
          <pre>
            {
              "_id": &lt;ObjectId&gt;
            }
          </pre>
        </v-alert>
      </v-col>
      <!-- The list of results-->
      <v-col cols="12" v-if="results">
        <!-- In the case the results are an array, it dynamically draws it -->
        <v-table v-if="(results instanceof Array)">
          <thead>
            <tr>
              <th v-for="(_, index) in results[0]">{{ index }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="result in results">
              <td v-for="(_, index) in results[0]">{{ result[index] }}</td>
            </tr>
          </tbody>
        </v-table>
        <!-- This will mostly happen in the case of aggregations -->
        <pre v-else>{{ results }}</pre>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import axios from 'axios';

const query = ref('');

const results = ref(false);

async function validate() {
  results.value = (await axios.post("/queries", {query: query.value})).data;
}
</script>