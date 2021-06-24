import { useHistory } from 'react-router-dom'
import { FormEvent, useState } from 'react'

import ilustrationImg from "../assets/images/illustration.svg"
import logoImg from "../assets/images/logo.svg"
import googleIconImg from "../assets/images/google-icon.svg"
import logInIcon from "../assets/images/log-in.svg"

import '../styles/auth.scss'

import { Button } from "../components/Button"

import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'



export function Home() {

    const { user, signInWithGoogle } = useAuth()

    const history = useHistory()

    const [roomCode, setRoomCode] = useState('')

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault()

        if(roomCode.trim() === '') {
            return
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get()

        if(!roomRef.exists()) {
            alert('Room does not exists.')
            return
        }

        if(roomRef.val().endedAt) {
            alert('Room alredy closed.')
            return
        }

        history.push(`/rooms/${roomCode}`)
    }

    async function handleToNewRoom() {
        if(!user) {
            await signInWithGoogle()
        }

        history.push('/rooms/new')
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={ilustrationImg} alt="Imagem simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao vivo</strong>
                <p>Tire duvidas da sua audiência em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask Logo" />
                    <button onClick={handleToNewRoom} className="create-room">
                        <img src={googleIconImg} alt="Google Logo" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                        type="text" 
                        placeholder="Digite o código da sala" 
                        onChange={event => setRoomCode(event.target.value)} 
                        value={roomCode}
                        />
                        <Button type="submit">
                            <img src={logInIcon} alt="Log In Icon" />
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}