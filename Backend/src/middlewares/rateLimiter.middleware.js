const ipRequestCounts = new Map();

// Reset map every minute
setInterval(() => {
    ipRequestCounts.clear();
}, 60 * 1000);

function rateLimiter(req, res, next) {
    const ip = req.ip || req.headers["x-forwarded-for"] || "unknown-ip";
    
    let current = ipRequestCounts.get(ip) || 0;
    
    if (current >= 120) { // Limit to 120 requests per minute
        return res.status(429).json({
            message: "Too many requests. Please try again in a minute."
        });
    }
    
    ipRequestCounts.set(ip, current + 1);
    next();
}

module.exports = rateLimiter;
