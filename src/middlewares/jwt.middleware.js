import jwt from 'jsonwebtoken';

export const generateToken = (data) => {
    const tokendata = {
        _id: data._id,
        user_type: data.user_type,
        updatedAt: data.updatedAt,
        createdAt: data.createdAt,
        first_name: data.first_name,
        email: data.email,
        status: data.status
    };
    const token = jwt.sign(
        tokendata,
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
    return token;
}

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid token' });
        }
        req.payload = decodedToken;
        next();
    });
};

export const isSponsor = (req, res, next) => {
    if (req.payload.user_type == 'sponsor') {
        next();
    } else {
        res.status(403).json({ message: 'Unauthorized' });
    }
};
