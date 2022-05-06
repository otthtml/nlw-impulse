import { FeedbackRepository } from "../repositories/feedback-repository";

interface SubmitFeedbackUseCaseRequest {
    type: string;
    comment: string;
    screenshot?: string;
}

export class SubmitFeedbackUseCase {
    constructor(
        private feedbackRepository: FeedbackRepository
    ) {}

    async execute(request: SubmitFeedbackUseCaseRequest) {
        const { type, comment, screenshot } = request;

        await this.feedbackRepository.create({
            type,
            comment,
            screenshot,
        });
    }
}