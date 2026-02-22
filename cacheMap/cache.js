/**
 * Why Map?

O(1) lookup

Built into JS

Clean key-value store

Better than plain object for this purpose
 */

const cache = new Map();

/**
 * What this does:

Checks existence

Checks expiration

Deletes if expired

Returns data if valid
 */

export function getFromCache(key) {
	const entry = cache.get(key);

	if (!entry) return null;

	if (Date.now() > entry.expiresAt) {
		cache.delete(key);
		return null;
	}

	return entry.data;
}

/*
Designing the Cache Correctly

We don’t just store data.

We must store:

The actual data

Expiration time
*/
export function saveToCache(key, data, ttlInSeconds) {
	const expiresAt = Date.now() + ttlInSeconds * 1000;

	cache.set(key, {
		data,
		expiresAt,
	});
}
