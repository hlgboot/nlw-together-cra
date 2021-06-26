import { Link, useHistory } from 'react-router-dom'
import { FormEvent, useState, useEffect} from 'react'

import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'

import ilustrationImg from "../assets/images/illustration.svg"
import logoImg from "../assets/images/logo.svg"

import { Button } from "../components/Button"

import '../styles/auth.scss'

export function NewRoom() {
    const {user} = useAuth()

    const [newRoom, setNewRoom] = useState('')

    const history = useHistory()

    useEffect(() => {
        if(!user) {
            history.push('/')
        }
    }, [user, history])

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault()

        if(newRoom.trim() === '' ) {
            return
        }

        const roomRef = database.ref('rooms')

        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id,
        })

        history.push(`/admin/rooms/${firebaseRoom.key}`)

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
                    <h2>Crie uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input 
                        type="text" 
                        placeholder="Nome da sala" 
                        onChange={event => setNewRoom(event.target.value)} 
                        value={newRoom} />
                        <Button type="submit">Criar sala</Button>
                    </form>
                    <p>
                        Quer entrar em uma sala já existente? <Link to="/">Clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}