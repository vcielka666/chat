// server.ts
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import express, { Request, Response } from 'express';
import { Server, Socket } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  const io = new Server(httpServer);

  io.on('connection', (socket: Socket) => {
    console.log('Client connected');

    socket.on('message', (msg: string) => {
      console.log('Message received:', msg);
      socket.broadcast.emit('message', msg);
    });

    socket.on('typing', (input: string) => {
      console.log('Typing event:', input);
      socket.broadcast.emit('typing', input);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  server.all('*', (req: Request, res: Response) => {
    return handle(req, res, parse(req.url!, true));
  });

  const port = process.env.PORT || 3000;
  httpServer.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
