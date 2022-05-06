import express from 'express';
import nodemailer from 'nodemailer';
import { send } from 'process';
import { PrismaFeedbackRepository } from './repositories/prisma/prisma-feedback-repository';
import { SubmitFeedbackUseCase } from './use-cases/submit-feedback-use-case';

export const routes = express.Router();

var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "1f28f6ff7bbb84",
      pass: "484933a1606286"
    }
  });

routes.post('/feedback', async (req, res) => {
    const { type, comment, screenshot } = req.body;
  
    const prismaFeedbackRepository = new PrismaFeedbackRepository();
    const submitFeedbackUseCase = new SubmitFeedbackUseCase(
      prismaFeedbackRepository
    );

    await submitFeedbackUseCase.execute({
      type,
      comment,
      screenshot
    });
    // await transport.sendMail({
    //     from: 'Equipe Feedget <fake@feedget.com>',
    //     to: 'Octavio <ott.html@gmail.com>',
    //     subject: 'Feedback do usuário',
    //     html: `<p>Tipo do feedback: ${type}</p>` +
    //         `<p>Comentário: ${comment}</p>`
    // });
    return res.status(201).send();
});