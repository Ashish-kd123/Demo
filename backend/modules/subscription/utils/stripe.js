 const Stripe = require('stripe');
const stripe = new Stripe(process.env.sk_test_51RLikwKv9VCxS7mFSaxm5C0Bdm2HI9WeI6OHVpxJCh3o6RkFSaJEafVHLQOpw4553NFHak9osNGEc1XvKA76H80d00bWD1QdG1); // Make sure this env var is set
module.exports = stripe;
