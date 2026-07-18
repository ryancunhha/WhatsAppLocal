import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import axios from "axios";

const socket = io("http://localhost:3000");

export default function App() {
    const [status, setStatus] = useState("");
    const [mensagens, setMensagens] = useState([]); // mensagem salvas

    const [mensagem, setMensagem] = useState(""); // input mensagem 
    const [nome, setNome] = useState(""); // input nome

    useEffect(() => {
        axios.get("http://localhost:3000/api/mensagens")
            .then(res => {
                setMensagens(res.data.mensagens);
            });
    }, []);

    useEffect(() => {
        socket.on("novaMensagem", (msg) => {
            setMensagens(prev => [
                ...prev,
                msg
            ]);
        });

        return () => {
            socket.off("novaMensagem");
        };
    }, []);

    useEffect(() => {
        axios.get("http://localhost:3000/api/teste").then(res => { setStatus(res.data.mensagem) });
    }, []);

    async function enviarMensagem(e) {
        e.preventDefault();

        if (!nome.trim() || !mensagem.trim()) return;

        try {
            const res = await axios.post("http://localhost:3000/api/enviar", { nome, mensagem });

            console.log(res.data);

            setMensagem("");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <h1>{status}</h1>

            <form onSubmit={enviarMensagem}>
                <input type="text" placeholder="seu nome" value={nome} onChange={(e) => setNome(e.target.value)} />
                <input type="text" placeholder="digite sua mensagem" value={mensagem} onChange={(e) => setMensagem(e.target.value)} />
                <button type="submit">Enviar</button>
            </form>

            <div>
                {mensagens.map((msg, index) => (
                    <p key={index}>
                        {msg.nome}: {msg.mensagem} {" "}
                        <small>{msg.data}</small>
                    </p>
                ))}
            </div>
        </div>
    )
}