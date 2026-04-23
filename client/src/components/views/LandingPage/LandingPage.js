import React, {useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/hello')
        .then(res => console.log(res.data))
    }, [])

    const onClickHandler = () => {
        axios.get('/api/users/logout')
            .then(res => {
                if (res.data.success) {
                    navigate('/login')
                } else {
                    alert('로그아웃 하는데 실패 했습니다.')
                }
            })
            .catch(err => {
                console.log(err);

                if (err.response?.status === 401) {
                    alert('이미 로그아웃 되었거나 인증정보가 없습니다.')
                    navigate('/login')
                } else {
                    alert('로그아웃 하는데 실패 했습니다.')
                }
            })
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100dvh'
        }}>
            <h2>시작 페이지</h2>

            <button onClick={ onClickHandler }>
                로그아웃
            </button>
        </div>
    )
}

export default LandingPage