import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { database } from '../services/firebase';

import { useAuth } from '../hooks/useAuth';

import { Button } from '../components/Button';

import logoImg from '../assets/images/logo.svg';
import illustrationImg from '../assets/images/illustration.svg';

import '../styles/auth.scss';

export function NewRoom() {
  const { user } = useAuth();
  const [newRoom, setNewRoom] = useState('');
  const history = useHistory();

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === '') {
      return;
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    history.push(`/rooms/${firebaseRoom.key}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizandi perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Logo da Letmeask" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              value={newRoom}
              onChange={(event) => {
                setNewRoom(event.target.value);
              }}
            />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente?{' '}
            <Link to="/" title="Entrar em uma sala existente">
              Clique aqui.
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}