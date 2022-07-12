import style from './Card.module.css';
import {Link} from 'react-router-dom'
import { connect } from 'react-redux';
import { addFavorite } from '../../../../actions';
import { useState } from 'react';
function Card({selectedUser,id,name,img,favorite,addFavorite}) {
  let [isAdded,setIsAdded] = useState(false)
  function onAddFavorite(){
    setIsAdded(true)
    addFavorite({
        name,
        username:selectedUser,
        id,
        img
    })
  }
  return (
    <div className={style.Card}>
      {isAdded || favorite ? <img src="/Star.png" className={style.star} alt="" /> : <button className={style.Favorite} onClick={onAddFavorite}>Add Favorite</button>}
      <img src={img} alt={name} className={style.PokemonImage}/>
      <div className={style.Header}>
        <h3>{name}</h3>
      </div>
      <div className={style.goDetail}>
        <Link to={`/detail/${id}`}>
          <button>See Detail</button>
        </Link>
      </div>
    </div>
  );
}

function mapStatetoProps(state){
  return {
    selectedUser:state.selectedUser
  }
}
export default connect(mapStatetoProps,{addFavorite})(Card);