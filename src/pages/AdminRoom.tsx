import { useHistory, useParams } from "react-router"
import { useAuth } from "../hooks/useAuth"
import { useRoom } from "../hooks/useRoom"

import { database } from "../services/firebase"

import { Toaster } from "react-hot-toast"

import logoImg from "../assets/images/logo.svg"
import deleteImg from "../assets/images/delete.svg"
import checkImg from "../assets/images/check.svg"

import { Button } from "../components/Button"
import { RoomCode } from "../components/RoomCode"
import { Question } from "../components/Question"

import "../styles/room.scss"
import { useEffect } from "react"

type RoomParams = {
    id: string
}


export function AdminRoom() {
    
    const { id } = useParams<RoomParams>()

    const history = useHistory()

    const { user } = useAuth()

    useEffect(() => {
        const roomRef = database.ref(`rooms/${id}`)
    
        roomRef.once('value', room => {
            const creatorUser = room.val().authorId
            
            if(creatorUser !== user?.id) {
                history.push('/')
            }
        })
    }, [])
    
    
    const { questions, title } = useRoom(id)
    


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

    async function handleCheckQuestionAsAnswered(questionId: string) {
        const questionRef = database.ref(`rooms/${id}/questions/${questionId}`)
        await questionRef.update({
            isAnswered: true
        })
    }

    async function handleHighligthQuestion(questionId: string) {
        const questionRef = database.ref(`rooms/${id}/questions/${questionId}`)
        await questionRef.update({
            isHighlighted: true
        })
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
                            }
                            isAnwsered={question.isAnswered}
                            isHighlighted={question.isHighlighted}>
                            {
                                !question.isAnswered && (
                                <>
                                    <button type='button' onClick={() => handleCheckQuestionAsAnswered(question.id)}>
                                        <img src={checkImg} alt="Check Question" />
                                    </button>
    
                                    <button className='highlighted' type='button' onClick={() => handleHighligthQuestion(question.id)}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </>
                                )
                            }

                            <button 
                                type='button' onClick={() => handleDeleteQuestion(question.id)}>
                                <img src={deleteImg} alt="Delete Question" />
                            </button>
                        </Question>
                    ))}
                    </div>
                </main>

        </div>
    )
}