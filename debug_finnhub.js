const finnhub = require('finnhub');
console.log('Type of finnhub:', typeof finnhub);
console.log('Keys:', Object.keys(finnhub));
console.log('ApiClient exists:', !!finnhub.ApiClient);
try {
    const client = new finnhub.ApiClient();
    console.log('ApiClient instantiated successfully');
} catch (e) {
    console.log('ApiClient instantiation failed:', e.message);
}
