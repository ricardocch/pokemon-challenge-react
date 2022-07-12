import style from './FavoritesBar.module.css';
import { connect } from 'react-redux';
import { addUser,getUsers,getTotalPokemons,setUser,getFavorites } from '../../../../actions';
import { useEffect, useRef } from 'react';

function FavoritesBar({addUser,Users,createInfo,getUsers,getTotalPokemons,setUser,getFavorites}) {

    let username = useRef('')
    let userSelected = useRef('')
    useEffect(()=>{
        getUsers()
    },[])

    useEffect(()=>{
        if(createInfo && !createInfo.includes("Error")){
            alert("Usuario agregado exitosamente")
            getUsers()
        }
        else if(createInfo && createInfo.includes("Error"))
            alert("Error al agregar usuario")
    },[createInfo])

    function onClick(){
        addUser(username.current.value)
        
    }
    
    function getAllPokemons(){
        getTotalPokemons()
    }

    function onGetFavorites(){
        getFavorites(userSelected.current.value)
    }
    function onSetUser(e){
        setUser(e.target.value)
    }
  return (
    <div className={style.FavoritesContainer}>
        <div className={style.User}>
            <span>Seleccionar Usuario:</span>
            <select onChange={(e) => onSetUser(e)} ref={userSelected}>
                <option value=""></option>
                {Users?.map( usr => <option key={usr} value={usr}>{usr}</option> )}
            </select>
        </div>
        <div>
            <input type="text" name="Usuario" ref={username}/>
            <button onClick={onClick}>Agregar Usuario</button>
        </div>
        <div>
            <button onClick={onGetFavorites}>Ver Favoritos</button>
            <button onClick={getAllPokemons}>Ver Todos</button>
        </div>
    </div>
  );
}

function mapStateToProps(state){
    return {
        Users:state.Users,
        createInfo:state.createInfo
    }
}

export default connect(mapStateToProps,{getTotalPokemons,addUser,getUsers,setUser,getFavorites})(FavoritesBar)