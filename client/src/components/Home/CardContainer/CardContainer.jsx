import Card from './Card/Card';
import style from './CardContainer.module.css';

function CardContainer({data}) {

  return (
    <div className={style.CardContainer}>
      { data.map( el => <Card key={el.id} 
                              id={el.id}
                              img={el.img !== '' ? el.img : '/Agumon.png'}
                              name={el.name}
                              favorite={el.favorite}/>)} 
    </div>
  );
}

export default CardContainer