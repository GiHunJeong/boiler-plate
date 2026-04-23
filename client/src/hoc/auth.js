import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { auth } from '../_actions/user_action'
import { useNavigate } from 'react-router-dom'

export default function (SpecificComponent, options, adminRoute = null) {

    // options
    // null => 아무나 출입 가능한 페이지
    // true => 로그인한 유저만 출입이 가능한 페이지
    // false => 로그인한 유저는 출입 불가능한 페이지

    function AuthenticationCheck(props) {
        const navigate = useNavigate()
        const dispatch = useDispatch()

        useEffect(() => {
            dispatch(auth())
                .then(res => {
                    console.log(res)

                    const isAuth = res?.payload?.isAuth
                    const isAdmin = res?.payload?.isAdmin

                    // 로그인 하지 않은 상태
                    if (!isAuth) {
                        if (options === true) {
                            navigate('/login')
                        }
                        return
                    }

                    // 로그인 상태
                    if (adminRoute === true && !isAdmin) {
                        navigate('/')
                        return
                    }

                    if (options === false) {
                        navigate('/')
                    }
                })
                .catch(err => {
                    console.log(err)

                    // 로그인 안 된 상태에서 401 떨어지는 경우
                    if (options === true) {
                        navigate('/login')
                    }
                })
        }, [dispatch, navigate])

        return (
            <SpecificComponent {...props} />
        )
    }

    return AuthenticationCheck
}