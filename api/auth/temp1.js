async function sendOTP(userEmail, userOTP) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_LOGIN,
        pass: process.env.MAIL_PASS,
      },
    });
    const mailOptions = {
      from: `${process.env.MAIL_LOGIN}@gmail.com`,
      to: userEmail,
      subject: "Please, verify your email",
      html: `<div>
    <h1>Please, verify your Email adress</h1>
    <p>Your can do it by sending POST to <a href='http://localhost:3000/otp/${userOTP}'>page</a> including your email adress</p>
  <h2>${userOTP}</h2>
    </div>`,
    };
  
    const result = await transporter.sendMail(mailOptions);
  }

async sendVerification(email, verificationToken) {
    const verificationLink = `${process.env.SERVER_URL}/auth/verify/${verificationToken}`;
    const result = await sgMail.send({
      to: email,
      from: process.env.SEND_GRID_FROM,
      subject: "Email verification",
      html: `<a href="${verificationLink}">Click to verify your email</a>`,
    });

    return console.log(result);
  }