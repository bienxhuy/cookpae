import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

interface CustomJwtPayload {
  sub: number;
  role: string;
}

export class WebSocketManager {
  private io: SocketIOServer;
  private userSockets: Map<number, string[]> = new Map();

  constructor(httpServer: HttpServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
      },
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    // JWT authentication middleware for WebSocket connections
    this.io.use((socket: Socket, next) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error: Token required'));
      }

      try {
        const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
        if (!jwtAccessSecret) {
          return next(new Error('JWT secret not configured'));
        }

        const decoded = jwt.verify(token, jwtAccessSecret);
        
        if (typeof decoded === 'string') {
          return next(new Error('Authentication error: Invalid token format'));
        }
        
        const payload = decoded as unknown as CustomJwtPayload;
        
        // Attach user info to socket
        (socket as any).userId = payload.sub;
        (socket as any).userRole = payload.role;
        
        next();
      } catch (error) {
        next(new Error('Authentication error: Invalid token'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: Socket) => {
      const userId = (socket as any).userId;
      console.log(`User ${userId} connected via WebSocket`);

      // Track user socket connections
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, []);
      }
      this.userSockets.get(userId)!.push(socket.id);

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`User ${userId} disconnected from WebSocket`);
        
        // Remove socket from tracking
        const sockets = this.userSockets.get(userId);
        if (sockets) {
          const index = sockets.indexOf(socket.id);
          if (index > -1) {
            sockets.splice(index, 1);
          }
          
          // Clean up if no more sockets for this user
          if (sockets.length === 0) {
            this.userSockets.delete(userId);
          }
        }
      });
    });
  }

  /**
   * Emit notification to a specific user
   */
  public emitToUser(userId: number, event: string, data: any) {
    const socketIds = this.userSockets.get(userId);
    
    if (socketIds && socketIds.length > 0) {
      socketIds.forEach(socketId => {
        this.io.to(socketId).emit(event, data);
      });
      console.log(`Notification sent to user ${userId}`);
    } else {
      console.log(`User ${userId} is not connected`);
    }
  }

  /**
   * Emit notification to multiple users
   */
  public emitToUsers(userIds: number[], event: string, data: any) {
    userIds.forEach(userId => {
      this.emitToUser(userId, event, data);
    });
  }

  /**
   * Get Socket.IO instance (if needed for advanced use cases)
   */
  public getIO(): SocketIOServer {
    return this.io;
  }
}

let webSocketManagerInstance: WebSocketManager | null = null;

export function initializeWebSocket(httpServer: HttpServer): WebSocketManager {
  if (!webSocketManagerInstance) {
    webSocketManagerInstance = new WebSocketManager(httpServer);
  }
  return webSocketManagerInstance;
}

export function getWebSocketManager(): WebSocketManager {
  if (!webSocketManagerInstance) {
    throw new Error('WebSocket manager not initialized');
  }
  return webSocketManagerInstance;
}
