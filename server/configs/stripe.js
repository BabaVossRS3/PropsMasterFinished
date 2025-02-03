import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root directory where index.js is
dotenv.config({
    path: path.resolve(__dirname, '../.env.production') 
});

if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Environment loading debug:');
    console.error('Current directory:', process.cwd());
    console.error('Attempted env path:', path.resolve(__dirname, '../.env.production'));
    throw new Error('STRIPE_SECRET_KEY is missing from environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
    timeout: 20000,
    maxNetworkRetries: 2,
});

export default stripe;