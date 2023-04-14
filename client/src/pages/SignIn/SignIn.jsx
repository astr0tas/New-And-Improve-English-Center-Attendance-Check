import './SignIn.css';
import SignInFrame from './image/SignInFrame.jpg';
// import UserContext from '../General/UserContext';
// import { useContext } from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { cookieExists, getCookieValue } from '../../tools/cookies';


export function SignInAs()
{
    useEffect(() =>
    {
        const cookies = document.cookie.split('; ');
        for (let i = 0; i < cookies.length; i++)
        {
            const cookie = cookies[i].split('=');
            document.cookie = cookie[0] + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    })

    // const { user } = useContext(UserContext);
    function halderSignIn(event)
    {
        // user.position = event.target.innerHTML;
        if (event.target.innerHTML === "Admin")
            document.cookie = `userType=Admin;`;
        else
            document.cookie = `userType=TS;`;
    }
    return (
        <div>
            <img alt="" className="position-absolute" src={ SignInFrame } style={ { top: 0, left: 0, width: '100%', height: '100%', zIdex: 0 } } />
            <div className="container" id="box">
                <h1 className="card-title" style={ { top: '10%', position: 'relative', fontSize: 60 } }>Sign in as</h1>
                <div className="button-con container flex-column">
                    <Link className="cus-btn btn btn-primary" to='/SignIn' onClick={ halderSignIn } style={ { fontSize: 30, alignItems: 'center', justifyContent: 'center', display: 'flex' } }>
                        Admin
                    </Link>
                    <Link className="cus-btn btn btn-primary" to='/SignIn' onClick={ halderSignIn } style={ { fontSize: 30, alignItems: 'center', justifyContent: 'center', display: 'flex' } }>
                        Teacher
                    </Link>
                    <Link className="cus-btn btn btn-primary" to='/SignIn' onClick={ halderSignIn } style={ { fontSize: 30, alignItems: 'center', justifyContent: 'center', display: 'flex' } }>
                        Supervisor
                    </Link>
                </div>
            </div>
        </div>
    );
}

export function SignIn()
{
    const [isWrong, setWrong] = useState(false);
    // const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    // var f_position = user.position;

    useEffect(() =>
    {
        if (cookieExists('userType') && cookieExists('id'))
            navigate("/Home");
        else if (cookieExists('userType') && !cookieExists('id'))
            ;
        else
            navigate("/");
    });

    function handleSignIn()
    {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === "" || password === "")
        {
            setWrong(true);
            return;
        }

        if (getCookieValue('userType') === "Admin")
        {
            axios.get('http://localhost:3030/admin/user/' + username)
                .then(res =>
                {
                    var user = res.data;

                    console.log(user);

                    if (!user || user.password !== password)
                    {
                        setWrong(true);
                        return;
                    }
                    else
                    {
                        document.cookie = `id=${ user.id };`;
                        // localStorage.setItem('user', JSON.stringify({ user, position: f_position }));
                        // localStorage.setItem('navbar', true);
                        // setUser({ user, position: f_position });
                        // console.log(f_position);
                        // props.onNavBar();
                        navigate('/Home');
                    }
                })
                .catch(error => console.log(error));
        }
        else
        {
            axios.post('http://localhost:3030/TS/login', { params: { account: username, password: password } })
                .then(res =>
                {
                    console.log(res);
                    if (!res.data)
                        setWrong(true);
                    else
                    {
                        document.cookie = `id=${ res.data };`;
                        navigate('/Home');
                        // SHOULD BE CHANGED
                        // localStorage.setItem('user', JSON.stringify({ user, position: f_position }));
                        // localStorage.setItem('navbar', true);
                        // setUser({ user, position: f_position });
                        // console.log(f_position);
                        // props.onNavBar();
                        // navigate('/' + f_position + '/Home');
                        // SHOULD BE CHANGED
                    }
                })
                .catch(error => console.log(error));
        }
    }

    return (
        <div>
            <img alt="" className="position-absolute" src={ SignInFrame } style={ { top: 0, left: 0, width: '100%', height: '100%', zIdex: 0 } } />
            <div className="container flex-column" id='box'>
                <h1 className="card-title" style={ { top: '10%', position: 'relative', fontSize: 60 } }>Sign in</h1>
                {
                    isWrong &&
                    <p
                        style={ {
                            top: '20%',
                            left: '20%',
                            color: 'red',
                            width: '60%',
                            textAlign: 'center'
                        } }
                    >
                        The username and/or password are not correct
                    </p>
                }
                <div className='container flex-column' style={ { top: '25%', position: 'relative', width: '60%' } }>
                    <p style={ { left: '-40%' } }>Username</p>
                    <div className="input-group input-group-lg cus-input">
                        <input id="username" type="text" className="form-control" placeholder="Username" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" />
                        {
                            isWrong &&
                            <span>
                                <svg width="45" height="45" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M52 32C52 43.0457 43.0457 52 32 52C20.9543 52 12 43.0457 12 32C12 20.9543 20.9543 12 32 12C43.0457 12 52 20.9543 52 32Z" stroke="#EE1C1C" strokeWidth="2" />
                                    <path d="M24 24L40 40" stroke="#EE1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M40 24L24 40" stroke="#EE1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        }
                    </div>
                    <p style={ { left: '-40%', marginTop: '50px' } }>Password</p>
                    <div className="input-group input-group-lg cus-input">
                        <input id="password" type="password" className="form-control " placeholder="Password" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" />
                        {
                            isWrong &&
                            <span>
                                <svg width="45" height="45" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M52 32C52 43.0457 43.0457 52 32 52C20.9543 52 12 43.0457 12 32C12 20.9543 20.9543 12 32 12C43.0457 12 52 20.9543 52 32Z" stroke="#EE1C1C" strokeWidth="2" />
                                    <path d="M24 24L40 40" stroke="#EE1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M40 24L24 40" stroke="#EE1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        }
                    </div>
                </div>

                <button className="cus-btn btn btn-primary" type="button"
                    style={ { top: '35%', position: 'relative', fontSize: 30 } }
                    onClick={ handleSignIn }
                >
                    Sign in
                </button>
                <p style={ { top: '30%', left: '30%', position: 'relative', fontSize: 30, cursor: 'pointer', width: '40%' } }>Forgot password?</p>
            </div>
        </div>
    )
}