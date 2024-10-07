import jwt from 'jsonwebtoken';

export const generateToken = (data) => {
    const token = jwt.sign(
        { userId: data._id, email: data.email, name: data.name, role: data.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
    return token;
}

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = decodedToken;
        next();
    });
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Unauthorized' });
    }
};
