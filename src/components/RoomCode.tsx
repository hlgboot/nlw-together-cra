import toast from 'react-hot-toast'
import copyImg from '../assets/images/copy.svg'

import '../styles/room-code.scss'

type RoomCodeProps = {
    code: string
}

export function RoomCode({code}: RoomCodeProps) {
    function copyRoomCodeToClipboard() {
        navigator.clipboard.writeText(code)
        toast.success('Copied to clipboard')
    }

    return (
        <button className='room-code' onClick={copyRoomCodeToClipboard}>
            <div>
                <img src={copyImg} alt="Copy To Clipboard Icon" />                    
            </div>
            <span>Sala #{code}</span> 
        </button>
    )
}