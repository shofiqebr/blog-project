import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRouter from './app/modules/auth/auth.router';
import blogRouter from './app/modules/blog/blog.router';

const app: Application = express();
// const port = 3000

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRouter)
app.use('/api', blogRouter)


app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to blog Project!');
});

export default app;
