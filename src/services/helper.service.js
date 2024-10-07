import nodemailer from 'nodemailer';
import path from 'path';



export const sendEmail = async (email, otp) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    const __dirname = path.resolve();
    const logoPath = path.join(__dirname, 'public', 'logo.png');

    let mailOptions = {
        from: `The Sponsor Team 👻 <${process.env.EMAIL}>`,
        to: email,
        subject: 'Verification code',
        html: `
        <div style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center;">
            <div style="text-align: center; background-color: #f4f4f4; padding: 20px; border-radius: 20px; margin: auto;">
                <img src="cid:logo" alt="Company Logo" style="width: 150px; margin-top: 20px;" />
                <p style="font-size: 1.2em; color: #333; font-weight: bold;">Your OTP code is:</p>
                <h2 style="font-size: 2em; color: #333; background-color: #f4f4f4; display: inline-block; padding: 10px; border-radius: 5px; margin-top: 10px;">${otp}</h2>
                <p style="font-size: 1em; color: #666; margin: 10px 0;">Please use this OTP code within 60 seconds.</p>
                <p style="font-size: 1em; color: #666; margin: 0;">If you did not request this code, please ignore this email.</p>
            </div>
        </div>
        `,
        attachments: [
            {
                filename: 'logo.png',
                path: logoPath,
                cid: 'logo'
            }
        ]
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        return res.status(200).json({ success: false, message: error.message });
    }
};