// Rewrite these imports from commonjs to es6 modules
// const express = require('express');
// const axios = require('axios');
// const { getFromCache, saveToCache } = require('./cacheMap/cache');
import express from 'express';
import axios from 'axios';
import { getFromCache, saveToCache } from './cacheMap/cache.js';

const app = express();
const PORT = 3000;
app.get('/users', async (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const perPage = parseInt(req.query.per_page) || 10;

	const cacheKey = `github_users_page_${page}_limit_${perPage}`;

	const cachedData = getFromCache(cacheKey);

	if (cachedData) {
		console.log('Serving from cache');
		return res.json(cachedData);
	}

	try {
		console.log('Fetching from GitHub API');

		const response = await axios.get(`https://api.github.com/users`, {
			params: {
				since: (page - 1) * perPage,
				per_page: perPage,
			},
		});

		saveToCache(cacheKey, response.data, 60); // 60 seconds TTL

		res.json(response.data);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch users' });
	}
});
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
