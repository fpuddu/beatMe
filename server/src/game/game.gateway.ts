import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChallengeService } from '../challenge/challenge.service';
import { NoteEvent } from '../challenge/challenge.entity';

@WebSocketGateway({ cors: { origin: '*' } })
export class GameGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly challengeService: ChallengeService) {}

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { challengeId: string },
  ) {
    client.join(data.challengeId);
    client.emit('roomJoined', { challengeId: data.challengeId });
  }

  @SubscribeMessage('playNote')
  handlePlayNote(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { challengeId: string; note: NoteEvent },
  ) {
    // Broadcast the played note to the other player in the room
    client.to(data.challengeId).emit('noteHeard', data.note);
  }

  @SubscribeMessage('submitAnswer')
  async handleSubmit(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { challengeId: string; answer: NoteEvent[] },
  ) {
    const result = await this.challengeService.submitAnswer({
      challengeId: data.challengeId,
      answer: data.answer,
    });

    this.server.to(data.challengeId).emit('challengeResult', {
      challengeId: result.id,
      score: result.score,
      status: result.status,
    });
  }
}
