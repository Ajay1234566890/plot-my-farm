import rateLimit from 'express-rate-limit';

// Rate limiter: 10 requests per minute per IP
export const rateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 requests per windowMs
    message: 'Too many token requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});
