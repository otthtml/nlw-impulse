import { MailAdapter } from "../adapters/mail-adapter";
import { FeedbackRepository } from "../repositories/feedback-repository";

interface SubmitFeedbackUseCaseRequest {
    type: string;
    comment: string;
    screenshot?: string;
}

export class SubmitFeedbackUseCase {
    constructor(
        private feedbackRepository: FeedbackRepository,
        private mailAdapter: MailAdapter,
    ) {}

    async execute(request: SubmitFeedbackUseCaseRequest) {
        const { type, comment, screenshot } = request;

        if (!type || !comment) {
            throw new Error('Type and comment are required');
        }

        if (screenshot && !screenshot.startsWith('data:image/png;base64,')) {
            throw new Error('Invalid screenshot');
        }

        await this.feedbackRepository.create({
            type,
            comment,
            screenshot,
        });

        await this.mailAdapter.sendMail({
            subject: "Feedback do usuário",
            body: [`<p>Tipo do feedback: ${type}</p>`,
            `<p>Comentário: ${comment}</p>`,
            screenshot ? `<img src="${screenshot}" />` : ''].join('')
        });
    }
}