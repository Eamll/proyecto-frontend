import React, { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { PeticionAjax } from '../../helpers/AjaxPetition';
import { GlobalRutaSegura } from '../../helpers/Global';
import { useNavigate } from 'react-router-dom';
import { saveToken } from '../../helpers/auth';


export const LoginComponent = () => {
    const { formulario, cambiado } = useForm({});
    const [loginResult, setLoginResult] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        const login = formulario
        try {
            const { datos } = await PeticionAjax(GlobalRutaSegura.url + 'login', 'POST', login)

            console.log(datos.status);
            if (datos.status === "success") {
                setLoginResult(datos);
                // Store the token in a suitable place, e.g., localStorage
                // localStorage.setItem('token', datos.token);
                saveToken(datos.token);
                // Redirect to a protected route or perform some other action upon successful login
                navigate('/inicio');
            } else {
                setLoginResult({
                    error: true,
                    message: 'Invalid username or password',
                });
            }
        } catch (error) {
            console.log(error)
            setLoginResult({
                error: true,
                message: 'An error occurred during the login process',
            });
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div className='div_flex_centro'>  
                    <div className='alinea_derecha'>
                        <div>
                            <label htmlFor="login">Login:</label>
                        </div>
                        <div>
                            <label htmlFor="password">Password:</label>
                        </div>

                    </div>
                    <div>
                        <div>
                            <input
                                type="text"
                                id="login"
                                name="login"
                                onChange={cambiado}
                            />
                        </div>
                        <div>
                            <input
                            type="password"
                            id="password"
                            name="password"
                            onChange={cambiado}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <button type="submit">Login</button>
                </div>
            </form>
            {loginResult && <div>
                {loginResult.error ? (
                    <p style={{ color: 'red' }}>{loginResult.message}</p>
                ) : (
                    <p style={{ color: 'green' }}>Logged in successfully!</p>
                )}
            </div>
            }
        </div>
    );
};

