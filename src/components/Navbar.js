import React,{Fragment, useEffect} from 'react';
import { NavLink } from 'react-router-dom';
import { getCookie,deleteCookie } from "../helpers/cookie";
import { useNavigate } from "react-router-dom";
import './form.scss';

export const Navbar = () => {
    const navigate = useNavigate(); 
    
    function CookiesDelete() {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
            document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    }

    function logOut() {
        CookiesDelete()
        deleteCookie("BARCODE")
        navigate("/registration");
    }

    useEffect(() => {
        if (getCookie('BARCODE') === undefined) {
            navigate("/");
            }
    })

    return (
        <nav  className="navbar navbar-dark navbar-expand-lg bg-primary">
            <div className="navbar-brand">
                Андромеда
               {/* <img src='logoClinik.png'/> */}
            </div>

            <ul className="navbar-nav">
                <li className="nav-item">
                    <NavLink
                        className="nav-link"
                        to="/home"
                    >
                        Главная
                    </NavLink>
                    
                </li>

                <li className="nav-item">
                    <NavLink
                        className="nav-link"
                        to="/visits"
                    >
                        Мои посещения
                    </NavLink>
                    
                </li>

                <li className="nav-item">
                    <NavLink
                        className="nav-link"
                        to="/loyaltycard"
                    >
                        Карта лояльности
                    </NavLink>
                    
                </li>


                <li className="nav-item">
                    <NavLink
                        className="nav-link"
                        to="/emk/0"
                    >
                        ЭМК
                    </NavLink>
                    
                </li>

                <li className="nav-item">
                    <NavLink
                        className="nav-link"
                        to="/notification"
                    >
                        Уведомления
                    </NavLink>
                    
                </li>

                <li className="nav-item">
                    <NavLink
                        className="nav-link"
                        to="/feedback"
                    >
                        Вопросы по приложению
                    </NavLink>
                    
                </li>

        </ul>
        <ul className="navbar-nav logOut">
            <li className="nav-item">
                <a className="nav-link" onClick={logOut}> Выйти </a>
            </li>
        </ul>
            
        </nav>
        )
}