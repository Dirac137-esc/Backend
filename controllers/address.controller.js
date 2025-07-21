const axios = require('axios');

exports.searchAddress = async (req, res) => {
    try {
        const { address } = req.body;
        if (!address) {
            return res.status(400).json({ error: 'Address parameter is required' });
        }

        const apiURL = 'https://z4ryw4kny0.execute-api.ap-southeast-1.amazonaws.com/production/searchByAddress';

        const response = await axios.get(apiURL, {
            params: { address },
        });

        return res.json(response.data);
    } catch (error) {
        console.error('Error in searchAddress:', error.message);
        return res.status(500).json({ error: 'Failed to fetch address data' });
    }
};
