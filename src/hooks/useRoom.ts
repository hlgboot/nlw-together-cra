import { useEffect, useState } from "react"
import { database } from "../services/firebase"
import { useAuth } from "./useAuth"

type QuestionType = {
    id: string,
    author: {
        name: string,
        avatar: string
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean,
    likeCount: number,
    likeId: string | undefined
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string,
        avatar: string
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean,
    like: Record<string, {
        authorId: string
    }>
}>

export function useRoom(roomId: string) {

    const { user } = useAuth()

    const [questions, setQuestions] = useState<QuestionType[]>([])
    const [title, setTitle] = useState('')


    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`)

        roomRef.on('value', room => {
            const firebaseQuestions: FirebaseQuestions = room.val().questions ?? {}

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.like ?? {}).length,
                    likeId: Object.entries(value.like ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
                }
            })
            
            parsedQuestions.sort((a, b) => {
                if(b.isHighlighted && !b.isAnswered) {
                    return 1
                }
                if(a.isAnswered) {
                    return 1
                }
                return b.likeCount - a.likeCount
            })

            setTitle(room.val().title)
            setQuestions(parsedQuestions)
        })

        return () => {
            roomRef.off('value')
        }

    }, [roomId, user?.id])


    return { questions, title }
}