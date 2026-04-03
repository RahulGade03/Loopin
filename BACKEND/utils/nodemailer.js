import nodemailer from "nodemailer";

const sendCredentialsMail = async (toEmail, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_USER, // sending using this email
              pass: process.env.EMAIL_PASS, // application password
            },
        });
      
        const mailOptions = {
            from: `"LoopIn Password Reset Service " <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: "RE: Password reset for LoopIn!",
            text: text,
        };

        const result = await transporter.sendMail(mailOptions);
        if (result.accepted.length>0) {
            return JSON.stringify({
                message: "Mail sent successfully!",
                success: true
            })
        }
        throw new Error("Mail could not be sent!");
    } catch (error) {
        return JSON.stringify({
            message: error.message,
            success: false
        })
    }
};

export default sendCredentialsMail;