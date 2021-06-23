import { useParams } from "react-router"
import { FormEvent, useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"

import toast, { Toaster } from 'react-hot-toast'

import logoImg from "../assets/images/logo.svg"

import { Button } from "../components/Button"
import { RoomCode } from "../components/RoomCode"

import "../styles/room.scss"
import { database } from "../services/firebase"

type RoomParams = {
    id: string
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string,
        avatar: string
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean
}>

type Question = {
    id: string,
    author: {
        name: string,
        avatar: string
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean
}

export function Room() {
    const { user } = useAuth()
    
    const { id } = useParams<RoomParams>()

    const [questions, setQuestions] = useState<Question[]>([])
    const [title, setTitle] = useState('')

    useEffect(() => {
        const roomRef = database.ref(`rooms/${id}`)

        roomRef.on('value', room => {
            const firebaseQuestions: FirebaseQuestions = room.val().questions ?? {}

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, entries]) => {
                return {
                    id: key,
                    content: entries.content,
                    author: entries.author,
                    isHighlighted: entries.isHighlighted,
                    isAnswered: entries.isAnswered
                }
            })
            
            setTitle(room.val().title)
            setQuestions(parsedQuestions)
        })

    }, [id])

    const [newQuestion, setNewQuestion] = useState('')

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault()

        if(newQuestion.trim() === '') {
            return
        }

        if(!user) {
            toast.error('You must be logged in.')
            return
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar,
            },
            isHighlighted: false,
            isAnswered: false
        }

        await database.ref(`rooms/${id}/questions`).push(question)

        setNewQuestion('')

        toast.success('Successfully send!')

    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask Logo" />
                    <Toaster position="top-center" reverseOrder={false}/>
                    <RoomCode code={id}/>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea 
                        placeholder="O que você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />
                    <div className="form-footer">
                        { user ? (
                            <div className='user-info'>
                                <img src={user.avatar} alt="User Avatar" />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar perguntar, <button>faça seu login.</button></span>
                        ) }
                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>                    
                    </div>
                </form>
                {JSON.stringify(questions)}
            </main>
        </div>
    )
}