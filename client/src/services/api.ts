import { Challenge, ChallengeType, NoteEvent, Player } from '../types';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  createPlayer(username: string): Promise<Player> {
    return request('/players', {
      method: 'POST',
      body: JSON.stringify({ username }),
    });
  },

  getPlayers(): Promise<Player[]> {
    return request('/players');
  },

  createChallenge(data: {
    senderUsername: string;
    receiverUsername: string;
    type: ChallengeType;
    fullSequence: NoteEvent[];
    hint?: string;
  }): Promise<Challenge> {
    return request('/challenges', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getChallengesForPlayer(playerId: string): Promise<Challenge[]> {
    return request(`/challenges/player/${playerId}`);
  },

  getChallenge(id: string): Promise<Challenge> {
    return request(`/challenges/${id}`);
  },

  submitAnswer(challengeId: string, answer: NoteEvent[]): Promise<Challenge> {
    return request('/challenges/submit', {
      method: 'POST',
      body: JSON.stringify({ challengeId, answer }),
    });
  },
};
