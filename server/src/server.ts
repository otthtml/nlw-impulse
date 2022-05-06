import express from 'express';
import nodemailer from 'nodemailer';
import { prisma } from './prisma';

const app = express();
app.use(express.json());

var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "1f28f6ff7bbb84",
      pass: "484933a1606286"
    }
  });

app.post('/feedback', async (req, res) => {
    const { type, comment, screenshot } = req.body;

    const feedback = await prisma.feedback.create({
        data: {
            type,
            comment,
            screenshot,
        }
    });

    await transport.sendMail({
        from: 'Equipe Feedget <fake@feedget.com>',
        to: 'Octavio <ott.html@gmail.com>',
        subject: 'Feedback do usuário',
        html: `<p>Tipo do feedback: ${type}</p>` +
            `<p>Comentário: ${comment}</p>`
    });
    return res.status(201).json({ data: feedback });
});

app.listen(3333, () => {
    console.log('Server started on port 3333');
});