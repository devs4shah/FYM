import axios from 'axios';
import {userState ,useEffect} from 'react';
import {useHistory} from 'react-router-dom';


const Login = (props) => {
    const [name,setName]=useState('');
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const [error,setError]=useState('');
    const [register,setMode]=useState(false);
    const [loading,setLoading]=useState(false);

    const regex={length: /.{6,}/,digit:/\d/,capital:/[A-Z]/};

    const [passMin,setPassMin]=useState(false);
    const [passNum,setPassNum]=useState(false);
    const [passCapital,setPassCapital]=useState(false);
    const [buttonEnabled,setButtonEnabled]=useState(false);
    const history=useHistory();
    const dispatch=useDispatch();
    
    useEffect(()=>{
        if(register){
            document.title='Sign Up | FYM';
          }
        else{
            document.title='Sign In | FYM'
        }

        validPassword(password);
    },[register]);
    
    function redirect(){
        if(props.location.state){
            history.push('/movie/'+props.location.stat.redirectID);
        }else{
            history.goBack();
        }
    }

    function signUpRequest(){
        setLoading(true);
        axios({
            method:'post',
            url:'/account/register',
            headers:{
                'Content-Type':'application/json',
            },
            data:JSON.stringify({
                name:name,
                username:username,
                password:password,
            }),
        }).then((res)=>{
            if(res.data.success){
                setInStorage('fym',{
                    token:res.data.token,
                });
                setLoading(false);
                dispatch(setUser(res.data.user));
                setTimeout(redirect,1700);
            }
            else{
                setError(res.data.message);
            }
            setLoading(false);
        });
    }

    function signInRequest(){
        setLoading(true);
        axios({
            method:'post',
            url:'/account/login',
            headers:{
                'Content-Type':'application/json',
            },
            data:JSON.stringify({
                username:username,
                password:password
            }),
        }).then((res)=>{
            if(res.data.success){
                setInStorage('fym',{
                    token:res.data.token,
                });
                setLoading(false);
                dispatch(setUser(res.data.user));
                setTimeout(redirect,1700);
            }
            else{
                setError(res.data.message);
            }
            setLoading(false);
        })
    }

    function validUsername(){
        if(username.length>-6 && username.length<=14){
            return (
                <div className='d-flex jistify-content-between'>
                    <label>Username</label>
                    <small className='text-danger'>6-14 characters</small>
                </div>
            )
        }
    }

    function validPassword(pass){
        if(regex.length.test(pass)){
            setPassMin(true);
        }
        else{
            setPassMin(false);
        }
        if(regex.digit.test(pass)){
            setPassCapital(true);
        }
        else{
            setPassCapital(false);
        }
        if(regex.length.test(pass) && regex.digital.test(pass) && regex.capital.test(pass)){
            setButtonEnabled(true);
        }
        else{
            setButtonEnabled(false);
        }        
    }
    
    function signInContainer(){
     
        return(
            <form className='container rounded p-4 pt-5 text-white h-100 d-flex flex-column justify-content-between'>
                 <div>
                    <div class='form-group'>
                        <label>Username</label>
                        <input
                            name='username'
                            type='text'
                            class='form-control'
                            placeholder='Enter username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div class='form-group'>
                        <label>Password</label>
                        <input
                            name='password'
                            type='password'
                            class='form-control'
                            placeholder='Enter Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                {error ? (
                    <small class='form-text text-danger'>{error}</small>
                ) : (
                    ''
                )}
                <div>
                    <div class='form-group'>
                        <small class='form-text text-muted'>
                            Don't have an account?
                            <a
                                class='text-warning text-decoration-none pointer'
                                onClick={() => {
                                    setMode(true);
                                    setError();
                                }}>
                                {' '}
                                Sign up
                            </a>
                        </small>
                    </div>{' '}
                    <button
                        type='submit'
                        onClick={() => signInRequest()}
                        class='btn btn-warning w-100'>
                        Sign In
                    </button>
                </div>
            </form>
        );
    }

    function getContainer(){
        if(loading){
            return (
                <div className='container rounded p-4 text-white h-100 d-flex flex-column justify-content-center align-items-center'>
                    <h5>Loading...</h5>
                </div>
            );
        } else{
            if(user.currentUser){
                return (
                    <div className='container rounded p-4 text-white h-100'>
                        <CSSTransition
                            in={true}
                            appear={true}
                            timeout={600}
                            classNames='fade'
                            unmountOnExit>
                            <div className='d-flex flex-column justify-content-center align-items-center h-100'>
                            <h5>Your're logged in</h5>
                            <br />
                            <br />
                            <img
                                    src={checkedIcon}
                                    className='checked-icon'></img>
                            </div>
                        </CSSTransition>
                        </div>
                );
            } else{
                if(register){
                    return signUpContainer();
                }else{
                    return signInContainer();
                }
            }
        }
    }

    return ( 
        <div className="Login">
             <CSSTransition
            in={true}
            appear={true}
            timeout={600}
            classNames='fade'
            unmountOnExit>
            <div>
                {/* background */}
                <div className='login-background'>
                    <div className='background-default'></div>
                    <div className='background-cover opacity-60'></div>
                </div>
                {/* login container */}
                <div className='login-container'>{getContainer()}</div>
            </div>
        </CSSTransition>
        </div>
     );
}
 
export default Login;