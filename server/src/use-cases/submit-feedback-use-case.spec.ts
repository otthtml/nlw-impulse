import { SubmitFeedbackUseCase } from "./submit-feedback-use-case";

const createFeedbackSpy = jest.fn();
const sendMailSpy = jest.fn();

const submitFeedbackUseCase = new SubmitFeedbackUseCase(
    { create: createFeedbackSpy },
    { sendMail: sendMailSpy }
);

describe('Submit feedback use case', () => {
    it('should submit feedback', async () => {
        await expect(submitFeedbackUseCase.execute({
            type: 'BUG',
            comment: 'test',
            screenshot: 'data:image/png;base64,test.jpg'
        })).resolves.not.toThrow();

        expect(createFeedbackSpy).toHaveBeenCalled();
        expect(sendMailSpy).toHaveBeenCalled();
    });

    it('should not submit feedback without type or comment', async () => {
        await expect(submitFeedbackUseCase.execute({
            type: '',
            comment: '',
            screenshot: 'data:image/png;base64,test.jpg'
        })).rejects.toThrow();
    });

    it('should not submit feedback with invalid screenshot', async () => {
        await expect(submitFeedbackUseCase.execute({
            type: 'BUG',
            comment: 'test',
            screenshot: 'test.jpg'
        })).rejects.toThrow();
    });
});