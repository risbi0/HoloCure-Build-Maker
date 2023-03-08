import redis from '$lib/database';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const params = await request.json()
	const key = params['redisKey'];
	const value = params['redisValue'];

	await redis.set(key, value);

	return new Response();
}