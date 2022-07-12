import style from './ActioonsContainer.module.css';
import Filters from './Filters/Filters';
import Orders from './Orders/Orders';
import FavoritesBar from './FavoritesBar/FavoritesBar'
function ActioonsContainer() {
    
  return (
    <div className={style.ActioonsContainer}>
      <Filters/>
      <Orders/>
      <FavoritesBar/>
    </div>
  );
}

export default ActioonsContainer