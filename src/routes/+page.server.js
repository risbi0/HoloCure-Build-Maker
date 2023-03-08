import redis from '$lib/database';

/** @type {import('./$types').PageLoad} */
export async function load(event) {
	const buildString = event.url.searchParams.get('build');
	if (buildString && buildString.length === 8) {
		const response = await redis.get(buildString);
		return { buildStr: response }
	}
}