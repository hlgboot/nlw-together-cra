import { useHistory, useParams } from "react-router"
import { useAuth } from "../hooks/useAuth"
import { useRoom } from "../hooks/useRoom"
import { useEffect } from "react"

import { database } from "../services/firebase"

import { Toaster } from "react-hot-toast"

import logoImg from "../assets/images/logo.svg"
import deleteImg from "../assets/images/delete.svg"

import { Button } from "../components/Button"
import { RoomCode } from "../components/RoomCode"
import { Question } from "../components/Question"

import "../styles/room.scss"

type RoomParams = {
    id: string
}


export function AdminRoom() {
    
    const { id } = useParams<RoomParams>()

    const history = useHistory()
    
    const { user } = useAuth()
    
    const { questions, title } = useRoom(id)
    
    useEffect(() => {
        const roomRef = database.ref(`rooms/${id}`)

        roomRef.once('value', room => {
            const creatorUser = room.val().authorId
            
            if(creatorUser !== user?.id) {
                history.push('/')
                return
            }
            
        })

        return () => {
            roomRef.off('value')
        }
    }, [id])


    async function handleEndRoom() {
       await database.ref(`rooms/${id}`).update({
           endedAt: new Date(),
       })
       history.push('/')
    } 

    async function handleDeleteQuestion(questionId: string) {
        if(window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
            const questionRef = database.ref(`rooms/${id}/questions/${questionId}`)
            await questionRef.remove()
        }
    }

    return (
        <div id="page-room">
            <Toaster position='top-right' reverseOrder={false} />
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask Logo" />
                    <div>
                        <RoomCode code={id}/>
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
                </div>

                <div className="questions-list">
                {questions.map(question => (
                    <Question
                        key={question.id} 
                        content={question.content}
                        author={
                            {
                                avatar: question.author.avatar,
                                name: question.author.name
                            }
                        }>
                        <button 
                            type='button'
                            onClick={() => handleDeleteQuestion(question.id)}
                        >
                            <img src={deleteImg} alt="Delete Question" />
                        </button>
                    </Question>
                ))}
                </div>
            </main>
        </div>
    )
}