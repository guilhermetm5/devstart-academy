require("dotenv").config();

const express = require("express");
const { MongoClient } = require("mongodb");
const path = require("path");

const app = express();
const client = new MongoClient(process.env.MONGODB_URI);

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/api/health", async (req, res) => {
  try {
    await client.db("admin").command({ ping: 1 });
    res.json({ status: "ok", mongodb: "conectado" });
  } catch {
    res.status(500).json({ status: "erro" });
  }
});

async function iniciarServidor() {
  try {
    await client.connect();

    const db = client.db(process.env.MONGODB_DB);

    app.use("/api/certificados", require("./routes/certificados")(db));
    app.use("/api/validacao", require("./routes/validacao")(db));
    app.listen(process.env.PORT || 3000, "0.0.0.0", () => {
      console.log(`DevStart Academy: http://localhost:${process.env.PORT || 3000}`);
      console.log("MongoDB conectado!");
    });
  } catch (error) {
    console.error("Erro ao iniciar:", error.message);
    process.exit(1);
  }
}

iniciarServidor();
