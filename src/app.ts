import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRouter from './app/modules/auth/auth.router';
import blogRouter from './app/modules/blog/blog.router';
import { adminRouter } from './app/modules/admin/admin.router';
import { globalErrorHandler } from './middlewares/globalErrorHandler';

const app: Application = express();
// const port = 3000

app.use(express.json());
app.use(cors());

app.use('/api', authRouter)
app.use('/api', blogRouter)
app.use('/api', adminRouter)


app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to blog Project!');
});

app.use(globalErrorHandler)

app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: false,
    message: 'Route not found'
  })
})

export default app;
