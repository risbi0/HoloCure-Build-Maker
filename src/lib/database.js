import Redis from 'ioredis';

import { PORT, HOST, PASSWORD } from '$env/static/private';

export default new Redis(PORT, HOST, {password: PASSWORD});