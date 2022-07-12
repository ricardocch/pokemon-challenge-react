import style from './Filters.module.css';
import { connect } from 'react-redux';
import { filterCreated } from '../../../../actions';
import { useEffect, useRef } from 'react';

function Filters({filterCreated}) {

    let selectType = useRef('')
    let selectCreate = useRef('')
    useEffect(()=>{

    },[])
    
    function onChange(){
    
        filterCreated({Type:selectType.current.value,created:selectCreate.current.value})
    }
    
  return (
    <div className={style.Filters} onChange={(e)=> onChange()}>
        <label>Filter by:</label>
        <select ref={selectCreate} onChange={(e)=> onChange()}>
            <option value="">Is Created?</option>
            <option value="N">Not Crated</option>
            <option value="C">Created</option>
        </select>
    </div>
  );
}

function mapStateToProps(state){
    return {
        types:state.types
    }
}

export default connect(mapStateToProps,{filterCreated})(Filters)