import { useHistory } from 'react-router-dom'

import ilustrationImg from "../assets/images/illustration.svg"
import logoImg from "../assets/images/logo.svg"
import googleIconImg from "../assets/images/google-icon.svg"
import logInIcon from "../assets/images/log-in.svg"

import '../styles/auth.scss'

import { Button } from "../components/Button"

import { useAuth } from '../hooks/useAuth'



export function Home() {

    const { user, signInWithGoogle } = useAuth()

    const history = useHistory()

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
                    <form action="">
                        <input 
                        type="text" 
                        placeholder="Digite o código da sala" />
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