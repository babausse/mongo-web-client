import mongoose from "mongoose";

const conn = mongoose.connection;

const AsyncFunction = (async function () {}).constructor;

const handler = {
  get(cible, prop, recepteur) {
    return cible.collection(prop);
  }
}

export default defineEventHandler(async (event) => {

  let connection;

  try {
    const connection = await mongoose.connect('mongodb://localhost:27017/iut');
    const body = await readBody(event);
    const db = new Proxy(connection.connections[0], handler);
    
    const fct = AsyncFunction('db', body.query);

    const results = await fct(db);

    console.log(results);

    return body.query;
  } catch (err) {
    console.error("DB connection failed.", err);
  }
});