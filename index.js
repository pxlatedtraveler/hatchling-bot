process.traceDeprecation = true;

require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => console.log('listening  at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const token = process.env.BNG_TOKEN;
const auth_url = process.env.AUTH_URL;
const auth_clientID = process.env.AUTH_CLIENT_ID;

const dataToSend = {
    status: 'success',
    token,
    auth_url,
    auth_clientID
};

app.post('/api', (request, response) => {
    console.log('I got a request!');
    console.log(request.body);

    response.json(dataToSend);
})

