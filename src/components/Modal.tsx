import { Dispatch, SetStateAction } from "react" // Import useState Function Props
import ReactModal from "react-modal"

import closeImg from "../assets/images/close.svg"

import "../styles/modal.scss"

type ModalProps = {
    title: string,
    content: string,
    state: boolean,
    callback: () => Promise<void>,
    setState: Dispatch<SetStateAction<boolean>>
}

export function Modal({ content, title, callback, state, setState }: ModalProps) {
    function handleCloseModal() {
        setState(false)
    }
    async function handleConfirm() {
        await callback()
        setState(false)
    }

    return (
        <ReactModal
            className="modal"
            isOpen={state}
            onRequestClose={handleCloseModal}
            style={{
                overlay: {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(5, 2, 6, 0.8)"
                },
                content: {
                    borderRadius: "8px",
                    border: "0",
                    outline: "none",
                }
            }}
        >
            <img src={closeImg} alt="Close Icon" />
            <h1>{title}</h1>
            <p>{content}</p>
            <div className="buttons">
                <button className="cancel" onClick={handleCloseModal}>Cancelar</button>
                <button className="confirm" onClick={handleConfirm}>Confirmar</button>
            </div>
        </ReactModal>
    )
}
