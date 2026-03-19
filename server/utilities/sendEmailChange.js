import nodemailer from "nodemailer"

export const sendEmailChangeLink = async (confirmUrl, newEmail) => {
    const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        }
    })

    const options = {
        from: `Paiyya <${process.env.SMTP_MAIL}>`,
        to: newEmail,
        subject: "Confirm your new email address",
        html: `
            <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">
                <div style="margin-bottom: 28px;">
                    <span style="font-family: 'Syne', Arial, sans-serif; font-weight: 800; font-size: 1.3rem; color: #1A1523; letter-spacing: -0.045em;">
                        Pai<span style="color: #6C3CE1;">yya</span>
                    </span>
                </div>

                <h1 style="font-size: 1.3rem; font-weight: 700; color: #1A1523; margin: 0 0 10px 0;">
                    Confirm your new email
                </h1>

                <p style="font-size: 0.9rem; color: #8A8390; line-height: 1.6; margin: 0 0 28px 0;">
                    You requested to change your email address. Click the button below to confirm. 
                    This link expires in <strong style="color: #1A1523;">15 minutes</strong>.
                </p>

                <a 
                    href="${confirmUrl}" 
                    style="
                        display: inline-block;
                        background: #6C3CE1;
                        color: #ffffff;
                        font-size: 0.9rem;
                        font-weight: 600;
                        text-decoration: none;
                        padding: 12px 28px;
                        border-radius: 10px;
                        margin-bottom: 28px;
                    "
                >
                    Confirm Email Change
                </a>

                <p style="font-size: 0.78rem; color: #B0AABA; line-height: 1.6; margin: 0 0 8px 0;">
                    If the button doesn't work, copy and paste this link into your browser:
                </p>
                <p style="font-size: 0.75rem; color: #6C3CE1; word-break: break-all; margin: 0 0 28px 0;">
                    ${confirmUrl}
                </p>

                <hr style="border: none; border-top: 1px solid #E8E3DC; margin-bottom: 20px;" />

                <p style="font-size: 0.75rem; color: #B0AABA; line-height: 1.6; margin: 0;">
                    If you didn't request this, you can safely ignore this email. Your current email remains unchanged.
                </p>
            </div>
        `
    }

    await transporter.sendMail(options)
}