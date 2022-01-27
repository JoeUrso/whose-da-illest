const knex = require("knex")(require("../knexfile").development);
const axios = require("axios");
const qs = require("qs");

// Import from .env
require("dotenv").config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET_KEY;
// const clientId = "b5e35c2df7ec4fcd86e84ed4cb6deb0b";
// const clientSecret = "2979aade3c8e4719a40051955ca5d16a";

const headers = {
    headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
    },
    auth: {
        username: clientId,
        password: clientSecret,
    },
};
const data = {
    grant_type: "client_credentials",
};

exports.index = (_req, res) => {
    knex("battles")
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) =>
            res.status(400).send(`Error retrieving battles: ${err}`)
        );
};

exports.getToken = (_req, res) => {
    axios
        .post(
            "https://accounts.spotify.com/api/token",
            qs.stringify(data),
            headers
        )
        .then((response) => {
            let token = response.data.access_token;
            console.log(token);
            res.status(200).json(token);
        })
        .catch((err) => res.status(400).send(`Error retrieving token: ${err}`));
};
