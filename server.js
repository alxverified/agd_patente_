const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const BASE_URL = "https://reportes.agd-online.com/api/v1";
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
app.use(express.json());
async function authenticate() {
    try {
        const response = await axios.post(`${BASE_URL}/account/authenticate`, {
            username: USERNAME,
            password: PASSWORD
        }, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error("Error al autenticar:", error);
        throw new Error('Error al autenticar');
    }
}

app.get('/patente', async (req, res) => {
    const { pat } = req.query;
    if (!pat) {
        return res.status(400).send('Patente es requerida');
    }
    try {
        const token = await authenticate();
        const response = await axios.get(`${BASE_URL}/automotor/?dominio=${pat}&page=1&per_page=20&web_request=true`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });
        res.json(response.data.data);
    } catch (error) {
        console.error('Error al obtener datos:', error);
        res.status(500).send('Error al obtener datos');
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});
