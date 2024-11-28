import express from 'express';
import taskRoutes from './routes/tasks';
import authRoutes from './routes/auth';

const app = express()
app.use(express.json());
const port = 3000;

app.use('/api/tasks', taskRoutes);
app.use("/api/auth",authRoutes)

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})