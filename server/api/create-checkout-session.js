import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  timeout: 20000,
  maxNetworkRetries: 2,
});

console.log('Server Environment Variables:', {
  PORT: process.env.PORT || 5173,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL,
});


// Configure rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
});

// Middleware
app.use(morgan('combined')); // Production logging
app.use(limiter); // Apply rate limiting
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(express.json());


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    serverUrl: `${req.protocol}://${req.get('host')}`,
    environment: process.env.NODE_ENV
  });
});

// Create checkout session endpoint
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    // Validate request body
    const { priceId, userId, userEmail, planName } = req.body;

    if (!priceId || !userId || !userEmail || !planName) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'priceId, userId, userEmail, and planName are required',
        code: 'missing_fields'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return res.status(400).json({
        error: 'Invalid email format',
        code: 'invalid_email'
      });
    }

    console.log('Creating checkout session with:', {
      priceId,
      userId,
      userEmail,
      planName
    });

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ 
        price: priceId, 
        quantity: 1,
      }],
      success_url: `${process.env.FRONTEND_URL}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/choosePlan`,
      customer_email: userEmail,
      client_reference_id: userId,
      metadata: { 
        userId, 
        planName,
        createdAt: new Date().toISOString() 
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      payment_method_collection: 'always',
      subscription_data: {
        metadata: {
          userId,
          planName
        },
        trial_settings: {
          end_behavior: {
            missing_payment_method: 'cancel'
          }
        }
      }
    });

    console.log('Checkout session created:', session.id);

    // Return only necessary session data
    res.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);

    // Handle specific Stripe errors
    if (error.type?.startsWith('Stripe')) {
      return res.status(400).json({
        error: error.message,
        code: error.code,
        type: error.type
      });
    }

    // Handle other errors
    res.status(500).json({
      error: 'An error occurred while creating the checkout session',
      code: 'server_error'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'An unexpected error occurred',
    code: 'server_error'
  });
});

// Start server
const PORT = process.env.PORT || 5173;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;