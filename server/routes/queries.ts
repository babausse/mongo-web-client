import * as child_process from "child_process";
import { promises as fs } from 'fs'

export default defineEventHandler(async (event) => {

  try {

    const uri = process.env.MONGODB_URL

    const filename = `${(new Date()).getTime()}`;

    const queryFile = `./tmp/query_${filename}.js`;
    const resultsFile = `tmp/results_${filename}.json`

    const { query } = await readBody(event);
    // Synchronous writing of the file to ensure data are available for the command line after.
    await fs.writeFile(queryFile, `function query() { ${query} }; print_value(query());`);

    function pr(): Promise<any> {
        return new Promise(async function (resolve, reject) {
        child_process.exec(`mongosh --quiet ${uri} ./tmp/functions.js ${queryFile} > ${resultsFile}`, (error, stdout, stderr) => {
          if (error) reject(error);
          if(stderr) reject(stderr);
          else resolve(stdout);
        });
      });
    }

    await pr();

    const results = await fs.readFile(resultsFile);

    fs.unlink(queryFile);
    fs.unlink(resultsFile);

    return results
  }
  catch (err) {
    console.log(err);
    return {"error": "Une erreur est survenue lors de l'exécution de la requête"};
  }
});