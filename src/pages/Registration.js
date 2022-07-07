import React, {useEffect, useState} from "react";
import { getCookie,deleteCookie, setCookie } from "../helpers/cookie";
import { api } from "../helpers/api";
import { useNavigate } from "react-router-dom";
import { blurHandler } from "../helpers/validations";
import { Registrations } from "../components/Registrations/Registrations";

export const Registration = () => {

    const [phone, setPhone] = useState('');
    const [phoneDirty, setPhoneDirty] = useState(false);
    const [phoneError, setPhoneError] = useState('Номер не может быть пустым');
    let textInput = React.createRef();

    let textInputPassword = React.createRef();
    const [password, setPassword] = useState();
    const [passwordDirty, setPasswordDirty] = useState(false);
    const [passwordError, setPasswordError] = useState("error");
    const [arrayUser, setArrayUser] = useState([]);
    const [modalActive, setModalActive] = useState(false);
    const [selectedUserBarcode, setSelectedUserBarcode] = useState(false);

    let navigate = useNavigate();


    const phoneHandler = () => {
        setPhone(textInput.current.value);
        const re = /^\d{10}$/;
       if (String(textInput.current.value).length === 0){
           setPhoneError('Номер не может быть пустым');
        } else if (!re.test(String(textInput.current.value).toLocaleLowerCase())) {
           setPhoneError("Номер введён не коректно");
       } else {
           setPhoneError("");
        }
    }

    const passwordHandler = () => {
        setPassword(textInputPassword.current.value);
        const re = /^[^а-яё]+$/iu;
        if (String(textInputPassword.current.value).length === 0){
            setPasswordError("Поле должно быть заполнено");
        } else if (!re.test(String(textInputPassword.current.value).toLocaleLowerCase())) {
            setPasswordError('В пароле не должно быть русских букв')
        } else {
            setPasswordError("");
        }
    }

    function getAuthOrRegistr() {
        async function ChecAuth(){
            let body = {phone: phone, medorgId: getCookie('MEDORGID')}
            body = new URLSearchParams(Object.entries(body)).toString();
            let temp = await api(
                `${getCookie('PROXISERVERLINK')}/api/userprofiles`,
                'POST',
                 body,
                {'Content-Type': 'application/x-www-form-urlencoded'}
            )
            console.log(temp);
            if (temp.length > 0) {
                console.log(temp);
                setArrayUser(temp);
                setModalActive(true);
            } else {
               
            }
        }
        ChecAuth();
    }

    async function loginPacient() {
        let body = {medorgId: getCookie('MEDORGID'),barcode: selectedUserBarcode.barcode, phone: phone}
        body = new URLSearchParams(Object.entries(body)).toString();

        let token = getCookie('token');
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+token);
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        let cardPers = await api(
           `${getCookie('PROXISERVERLINK')}/api/Mobile/ClientCardInfo`,
            'POST',
            body,
            myHeaders
        )
        console.log(cardPers);
        setCookie("CARDPERS",JSON.stringify(cardPers),{});        


        setCookie('BARCODE', selectedUserBarcode.barcode);
        let arrayUser = {
            name: selectedUserBarcode.first_name,
            surname: selectedUserBarcode.surname,
            patronymic: selectedUserBarcode.patronymic,
            bornDate:  selectedUserBarcode.birthday
        }
        setCookie('PHONEUSER', phone);
        setCookie('USERDATA', JSON.stringify(arrayUser));
       navigate('/visits');
    }
    function getPasswordO(e) {
        if (phoneDirty && phoneError== "") {
            navigate(`/fogot/password/${phone}`);
        }    else {
            alert("Введите номер телефона!");
        }
    }

    function getPassword(event) {
        if(passwordDirty && passwordError ==="") {
            setPassword(textInputPassword.current.value);
            setCookie('PASSWORDUSER',password,{});
            let body = {grant_type : 'password',username: phone, password: password}
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
                    getAuthOrRegistr();
                    //clbFunction(clbObject)
                }


            }
            GetToken();
            //password);
        }
    }

    return(
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
                    <button onClick={e=> loginPacient()}> Войти как {selectedUserBarcode.first_name} {selectedUserBarcode.patronymic} {selectedUserBarcode.surname}. {selectedUserBarcode.birthday}</button> 
                    : 
                    ""}
                    <button className="cancel-button" onClick={e => setModalActive(false)} > Вернуться </button>  
                                
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

                        {(phoneDirty && phoneError) && <div className="alert alert-danger" role="alert"> <p> {phoneError} </p> </div>}
                        <div className="input-mask">
                            <p>+7</p> 
                            <input value={phone} onChange={e =>phoneHandler(e)} onBlur={e => blurHandler(setPhoneDirty)} type="number" ref={textInput} className="form-control" id="email" placeholder="Введите ваш номер"/>      
                        </div>            
                        
                        {(passwordDirty && passwordError) && <div className="alert alert-danger" role="alert"> <p> {passwordError} </p> </div>}
                        <div className="input-mask">
                            <input  value={password} onChange={e =>passwordHandler(e)} onBlur={e => blurHandler(setPasswordDirty)} ref={textInputPassword} required type="password" className="form-control" name="password" autocomplete="new-password" placeholder="Пароль от вашей учётной записи"/>                                                                  
                        </div>

                            <button  type="button" onClick={getPassword} className=" btn-primary ">Продолжить</button>     
                            
                            <div className="help-text">
                                <p className="link-style" href="/">Политика конфидециальности</p> 
                            </div> 
                            <div className="help-text">
                                <p className="link-style" onClick={e=> navigate('/')} href="/">Нет аккаунта? Зарегестрируйтесь...</p> 
                            </div> 
                            <div className="help-text">
                                <p className="link-style" onClick={e=> getPasswordO(e)} href="/">Забыли пароль?</p> 
                            </div> 

                        </div>

                    </div> 

            </div>

            <div className="col">
            </div>

            </div>
       </div>
    )
};


export default Registration;