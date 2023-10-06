const express = require('express');
const cors = require('cors');
const axios = require('axios'); // We'll use Axios for making HTTP requests
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001; // Update port to use environment variable if available
const { API_KEY } = process.env;

app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static('public'));

const baseUrl = `https://api.clashofclans.com/v1`;
const clanTag = '#RJ0J9JCG';
const playerTag = '#CPLUCQ8';


// Define a function to fetch data from /findClan
const fetchClanList = async (locationId) => {
    try {
        // Make a GET request to the COC API
        const response = await axios.get(`${baseUrl}/clans?locationId=${locationId}`, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        // Check if the response status is not 200 (OK)
        if (response.status !== 200) {
            throw new Error(`Failed to fetch data. Status code: ${response.status}`);
        }

        // Extract the data from the response
        const clanInfo = response.data;

        return { status: true, msg: "Clan List Fetched", data: clanInfo };
    } catch (error) {
        console.error('Error fetching clan info:', error.message);
        return { status: false, msg: error.message };
    }
}

// Define a new route to render the HTML page with data from /findClan
app.get('/', async (req, res) => {
    try {
        const clanData = await fetchClanList(32000134);

        if (!clanData.status) throw new Error(clanData.msg);

        res.render('index', { data: clanData.data.items });
    } catch (error) {
        // Handle errors
        console.error('Error rendering index page:', error.message);
        res.status(500).json({ status: false, msg: error.message });
    }
});

app.get('/:clanTag', async (req, res) => {
    try {
        const clanTag = req.params.clanTag.trim();
        
        console.log(clanTag);
        console.log(`${baseUrl}/clans/#${encodeURIComponent(clanTag)}`);

        // Make a GET request to the COC API
        const response = await axios.get(`${baseUrl}/clans/#${encodeURIComponent(clanTag)}`, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        // Check if the response status is not 200 (OK)
        // if (response.status !== 200) {
        //     throw new Error(`Failed to fetch data. Status code: ${response.status}`);
        // }

        // Extract the data from the response
        const clanInfo = response.data;

        res.render('clanDetails', { data: clanInfo });
    } catch (error) {
        // Handle errors
        console.error('Error rendering index page:', error.message);
        res.status(500).json({ status: false, msg: error.message });
    }
});


// Endpoint for getting clan information by tag
app.get('/findClan', async (req, res) => {
    try {
        // Make a GET request to the COC API
        const response = await axios.get(`${baseUrl}/clans/${encodeURIComponent(clanTag)}`, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        // Extract the data from the response
        const clanInfo = response.data;

        // Send the news data as a JSON response
        res.status(200).json({ status: true, msg: "Coc info fetched successfully", data: clanInfo });
    } catch (error) {
        // Handle errors
        console.error('Error fetching clan info:', error.message);
        res.status(500).json({ status: false, msg: error.message });
    }
});

// Endpoint for getting all FWA clans
app.get('/fwaClans', async (req, res) => {
    try {
        // Extract the FWA Clan data
        const clanInfo = await fetchClanList(32000134);

        if (!clanInfo.status) throw new Error(clanInfo.msg);

        // Send the news data as a JSON response
        res.status(200).json({ status: true, msg: "FWA Clans Listed Successfully", data: clanInfo.data });
    } catch (error) {
        // Handle errors
        console.error('Error fetching clan info:', error.message);
        res.status(500).json({ status: false, msg: error.message });
    }
});

// Endpoint for getting all Indian clans
app.get('/indClans', async (req, res) => {
    try {
        // Extract all Indian Clans data
        const clanInfo = await fetchClanList(32000113);

        if (!clanInfo.status) throw new Error(clanInfo.msg);

        // Send the news data as a JSON response
        res.status(200).json({ status: true, msg: "Indian Clans Listed Successfully", data: clanInfo.data });

    } catch (error) {
        // Handle errors
        console.error('Error fetching clan info:', error.message);
        res.status(500).json({ status: false, msg: error.message });
    }
});

// Define a new route to get all locations
app.get('/all-locations', async (req, res) => {
    try {
        // Make a GET request to the COC API to fetch all locations
        const response = await axios.get(`${baseUrl}/locations`, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        // Extract the list of locations from the response
        const locations = response.data.items;

        // Send the list of locations as a JSON response
        res.status(200).json({ status: true, msg: 'Locations fetched successfully', data: locations });
    } catch (error) {
        // Handle errors
        console.error('Error fetching all locations:', error.message);
        res.status(500).json({ status: false, msg: error.message });
    }
});

// Define a new route to get player details by player tag
app.get('/player', async (req, res) => {
    try {
        // const playerTag = req.params.playerTag;

        // Make a GET request to the COC API to fetch player details
        const response = await axios.get(`${baseUrl}/players/${encodeURIComponent(playerTag)}`, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        // Extract the player details from the response
        const playerDetails = response.data;

        // Send the player details as a JSON response
        res.status(200).json({ status: true, msg: 'Player details fetched successfully', data: playerDetails });
    } catch (error) {
        // Handle errors
        console.error('Error fetching player details:', error.message);
        res.status(500).json({ status: false, msg: error.message });
    }
});




app.listen(port, () => {
    console.log(`Server running on port ${port}!`);
});
