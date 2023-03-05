import "reflect-metadata";
import express, {Request, Response} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {usersRouter} from "./routes/users-router";
import {authRouter} from "./routes/auth-router";
import {commentsRouter} from "./routes/comments-router";
import {testingRouter} from "./routes/testing-router";
import {securityDevicesRouter} from "./routes/security-devices-router";
import {runDb} from "./repositories/db";

export const app = express()

const parserMiddleware = express.json()
app.set('trust proxy', true)
app.use(cors())
app.use(parserMiddleware)
app.use(cookieParser())

app.get('/', (req: Request, res: Response) => {
    res.send(':0')
})

app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)
app.use('/testing', testingRouter)
app.use('/security/devices', securityDevicesRouter)