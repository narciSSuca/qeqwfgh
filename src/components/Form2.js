import React, { useEffect, useState } from "react";
import { api } from "../helpers/api";
import { blurHandler } from "../helpers/validations";
import { getCookie, setCookie } from "../helpers/cookie";
import { useNavigate } from "react-router-dom";
import './form.scss';
import '../components/ModalPayment/modalP.scss';

export const Form2 = ({clbFunction,clbObject}) => {

    if (!clbObject['password_test']) {
        clbObject['password_test'] = '';
    }

    let dirty = false;
    let error = 'Пароль не может быть пустым';

 



    ///////////////////////////////////////////////////////////////////
    /////                                                         /////
    /////       Функции для тестового сервера                     /////
    /////                                                         /////
            if (clbObject['password_test'].length > 0) {
                dirty = true;
                error = '';
            } 
    /////                                                         /////
    /////                                                         /////
    /////                                                         /////    
    /////                                                         /////
    ///////////////////////////////////////////////////////////////////


    
    const [password, setPassword] = useState(clbObject['password_test']);
    const [passwordDirty, setPasswordDirty] = useState(dirty);
    const [passwordError, setPasswordError] = useState(error);
    const [arrayUser, setArrayUser] = useState([]);
    const [modalActive, setModalActive] = useState(false);
    const [selectedUserBarcode, setSelectedUserBarcode] = useState(false);

    useEffect(() => {
        console.log(selectedUserBarcode);
    }, [selectedUserBarcode])
    
    let textInput = React.createRef();
    const navigate = useNavigate();

    const passwordHandler = () => {
        setPassword(textInput.current.value);
        const re = /^[^а-яё]+$/iu;
        if (String(textInput.current.value).length === 0){
            setPasswordError("Поле должно быть заполнено");
        } else if (!re.test(String(textInput.current.value).toLocaleLowerCase())) {
            setPasswordError('В пароле не должно быть русских букв')
        } else {
            setPasswordError("");
        }
    }

    function getAuthOrRegistr() {
        async function ChecAuth(){
            let body = {phone: clbObject['phone'], medorgId: getCookie('MEDORGID')}
            body = new URLSearchParams(Object.entries(body)).toString();
            let temp = await api(
                `${getCookie('PROXISERVERLINK')}/api/userprofiles`,
                'POST',
                 body,
                {'Content-Type': 'application/x-www-form-urlencoded'}
            )

            if (temp.length > 0) {
                console.log(temp);
                setArrayUser(temp);
                setModalActive(true);
            } else {
               
            }
        }
        ChecAuth();
    }

    function loginPacient() {
        setCookie('BARCODE', selectedUserBarcode.barcode);
        navigate('/home');
    }

    function getPassword(event) {
        if(passwordDirty && passwordError ==="") {
            setPassword(textInput.current.value);
            setCookie('PASSWORDUSER',password,{});
            let body = {grant_type : 'password',username: clbObject['phone'], password: password}
            body = new URLSearchParams(Object.entries(body)).toString();     
        
            async function GetToken(){
                let temp = await api(
                    `${getCookie('PROXISERVERLINK')}/Token`,
                    'POST',
                     body,
                    {'Content-Type': 'application/x-www-form-urlencoded'}
                )
                if (temp['error_description']) {
                    setPasswordError(temp['error_description']);
                } else {
                    setCookie('token', temp['access_token'],{});
                    //getAuthOrRegistr();
                    clbFunction(clbObject)
                }


            }
            GetToken();
            //password);
        }
    }

    return (
        <div className="container">
            
            <div className={modalActive ? "modal active" : "modal"} >
            <div className="modal__content new-size" onClick={e => e.stopPropagation()}>
                <p>Ваш номер уже зарегестрирован выберете аккаунт пациента или перейдите к регистрации нового аккаунта</p>
                <ul>
                    {arrayUser.map(user=>(
                        <div  className={selectedUserBarcode.id == user.id ? "user-item user-selected" : "user-item"} onClick={e=> setSelectedUserBarcode(user)}>
                            <p><b>{user.first_name} {user.patronymic} {user.surname}.</b></p>
                        </div>
                    ))}
                </ul>
                {selectedUserBarcode ?
                <button onClick={e=> loginPacient()}> Войти как {selectedUserBarcode.first_name} {selectedUserBarcode.patronymic} {selectedUserBarcode.surname}.</button> 
                 : 
                 ""}
                <button className="cancel-button" onClick={e => clbFunction(clbObject)} >Продолжить регистрацию</button>              
            </div>
        </div>
            
            <div className="row">

            <div className="col">
            </div>

            <div className="col-6 form-content">
                
                    <div className="form">

                    <div className="logo">
                            <img src="logoClinik.png"/>
                    </div>

                        <div className="form-group">
                        {(passwordDirty && passwordError) && <div className="alert alert-danger" role="alert"> <p> {passwordError} </p> </div>}
                             <p>Для тестов: {password}</p>
                            <input  value={password} onChange={e =>passwordHandler(e)} onBlur={e => blurHandler(setPasswordDirty)} ref={textInput} required type="password" className="form-control" name="password" autocomplete="new-password" placeholder="Пароль от вашей учётной записи"/>                                                      
                          
                            <button onClick={getPassword} type="button" className=" btn-primary ">Продолжить</button>     
                            
                            <div className="help-text">
                                <a href="/">Политика конфидециальности</a> 
                            </div>

                            <div className="help-text">
                                <a  href={`/#/fogot/password/${clbObject['phone']}`} >Смена пароля</a> 
                            </div> 

                        </div>

                    </div> 

            </div>

            <div className="col">
            </div>

            </div>
       </div>
    )
}