import { ReactNode } from "react"
import "../styles/question.scss"
import cx from 'classnames'

type QuestionProps = {
    content: string,
    author: {
        name: string,
        avatar: string
    },
    children: ReactNode,
    isAnwsered?: boolean,
    isHighlighted?: boolean
}


export function Question({ content, author, children, isAnwsered = false, isHighlighted = false }: QuestionProps) {
    return (
        <div className={cx('question', { anwsered: isAnwsered }, { highlighted: isHighlighted && !isAnwsered } )}>
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>                    
                </div>
                <div>{children}</div>
            </footer>
        </div>
    )
}