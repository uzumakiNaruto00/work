const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'No authentication token provided' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key');
            const user = await User.findOne({ _id: decoded.userId });

            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }

            req.token = token;
            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({ error: 'Invalid authentication token' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Authentication error' });
    }
};

const adminAuth = async (req, res, next) => {
    try {
        await auth(req, res, () => {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Access denied. Admin only.' });
            }
            next();
        });
    } catch (error) {
        console.error('Admin auth middleware error:', error);
        res.status(500).json({ error: 'Authentication error' });
    }
};

module.exports = { auth, adminAuth }; 