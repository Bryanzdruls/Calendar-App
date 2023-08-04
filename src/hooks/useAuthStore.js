import {useDispatch, useSelector} from 'react-redux'
import { calendarApi } from '../api';
import { clearErrorMessage, onChecking, onLogin, onLogout, onLogoutCalendar } from '../store';

export const useAuthStore = () => {
    const { status, user, errorMessage,} = useSelector(state => state.auth);
    const dispatch = useDispatch();
    
    const tokenHandler = (data) => {
        localStorage.setItem('token',data.token);
        localStorage.setItem('token-init-date',new Date().getTime());  
        dispatch( onLogin( {name: data.name, uid: data.uid}) )
    }

    const startLogin = async({ email, password }) => {
        dispatch( onChecking() );
        try {
            
            const {data} = await calendarApi.post('/auth/login',{ email, password });
            tokenHandler(data);

        } catch (error) {
            dispatch( onLogout('credenciales incorrectas'))
            setTimeout(()=>{
                dispatch( clearErrorMessage() )
            }, 10)
        }
        
    }
    const startRegister = async({ name,email, password }) => {
        dispatch( onChecking() );
        try {
            
            const {data} = await calendarApi.post('/auth/new',{ name,email, password });
            tokenHandler(data);
        } catch ({response}) {

            dispatch( onLogout(response.data?.msg || 'Nombre requerido,Revisar Email, Contraseña de minimo 6 caracteres'))
            setTimeout(()=>{
                dispatch( clearErrorMessage() )
            }, 10)
        }
    }
    const checkAuthToken = async() => {
        const token = localStorage.getItem('token');       
        if (!token) return dispatch( onLogout() );

        try {
            const {data} = await calendarApi.get('/auth/renew');
            
            tokenHandler(data);

        } catch (error) {
            console.log('Se borro el token por error',error);
            localStorage.clear();
            dispatch( onLogout() );
        }
    }

    const startLogout = () => {
        localStorage.clear();
        onLogoutCalendar();
        dispatch( onLogout());
    }
    return {
        //propiedades
        errorMessage,
        status,
        user,
        //metodos
        startLogin,
        startRegister,
        checkAuthToken,
        startLogout
    }
}