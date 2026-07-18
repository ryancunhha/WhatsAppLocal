import { Server } from "socket.io";
import fs from "fs";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// VISUALIZAÇÂO
app.get("/api/teste", (req, res) => {
    res.json({ online: true, mensagem: "Servidor online" });
});

// mensagem
app.post("/api/enviar", (req, res) => {
    const { nome, mensagem } = req.body;

    if (!nome || !mensagem) {
        return res.status(400).json({ erro: "Nome e Mensagem obrigatórios" });
    }

    let mensagens = [];

    if (fs.existsSync("mensagens.json")) {
        const dados = fs.readFileSync("mensagens.json", "utf8");
        mensagens = JSON.parse(dados);
    }

    const Mensagem = { data: new Date().toLocaleString(), nome, mensagem };

    mensagens.push(Mensagem);

    fs.writeFileSync("mensagens.json", JSON.stringify(mensagens, null, 2));

    io.emit("novaMensagem", Mensagem);
});

// pegar mensagem
app.get("/api/mensagens", (req, res) => {
    if (!fs.existsSync("mensagens.json")) {
        return res.json({ mensagens: [] });
    }

    const dados = fs.readFileSync("mensagens.json", "utf8");

    res.json({ mensagens: JSON.parse(dados) });
});

const server = app.listen(3000, () => {
    console.log("Servidor em http://localhost:3000");
});

const io = new Server(server, {
    cors: { origin: "*" }
});