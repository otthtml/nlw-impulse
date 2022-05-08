# NLW Impulse

Sample project made in a bootcamp.
It's a simple widget that allows you to send feedback.
Frontend made in React.
Backend made in Express + Prisma.

## How to run

Easy! Just have docker-compose installed and run:
```
docker-compose up
```

You can also get each service to run individually with:
```
docker-compose up web
docker-compose up server
```

You can also initiate prisma studio by sshing into the server container and running 
```
npx prisma studio
```

## How to deploy

web is automatically deployed whenever the 'i-hate-solid' branch receives a commit.

server must be built using 'npx tsc'.

## Important notes about solid
1. SubmitFeedbackUseCase uses a generic FeedbackRepository in order to create the feedbacks. 
2. The generic repository has an interface for creation, which is implemented by the PrismaFeedbackRepository.
3. This allows us to decouple the UseCase from Implementation details (Prisma).
4. Now when you want to use the SubmitFeedbackUseCase, all you have to do is instantiate a specific repository, such as PrismaFeedbackRepository, and pass it into SubmitFeedbackUseCase.