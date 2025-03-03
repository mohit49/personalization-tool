import { Server } from 'socket.io';

let io;

export async function GET(req) {
  if (!io) {
    io = new Server(res.socket.server, {
      path: '/api/socket',
    });

    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);

      socket.on('message', (data) => {
        console.log('Received:', data);
        io.emit('message', data);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
      });
    });
  }
  return new Response('Socket initialized');
}
