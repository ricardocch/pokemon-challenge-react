const initialState = {
  Pokemons:[],
  types:[],
  tmpPokemons:[],
  page:1,
  toShow:[],
  totalPages:0,
  PokemonDetail:{},
  createInfo:null,
  Users:[],
  selectedUser:""
};


function sortAsc(arr,property){
  property = property !== '' ? property.toLowerCase() : 'id'
  
  arr.sort(function (a, b) {
    if (a[property] > b[property]) {
      return 1;
    }
    if (a[property] < b[property]) {
      return -1;
    }
    
    return 0;
  });

  return arr;
}

function sortDesc(arr,property){
  property = property !== '' ? property.toLowerCase() : 'id'
  
  arr.sort(function (a, b) {
    if (a[property] < b[property]) {
      return 1;
    }
    if (a[property] > b[property]) {
      return -1;
    }
    
    return 0;
  });

  return arr;
}

function getShowPages(arr){
      let toShow = []
      arr.forEach((el,idx) => {
        if(idx < 9) toShow.push(el)
      })
      let row = Math.floor((arr.length - 9)/12)
      row = row + 2
      let arrPages = []
      for(let i=1; i <= row;i++){
        arrPages.push(i)
      }

      return [toShow,arrPages]
}


const pokemons = (state = initialState, action) => {
  
  switch(action.type) {
    
    case "getPokemons":
      let tmp1 = getShowPages(action.payload)
      return {...state,
        tmpPokemons:action.payload,
        Pokemons:action.payload,
        toShow:tmp1[0],
        totalPages:tmp1[1],
        Page:1
      };
    
    case "changePage":
      let toShow = []
      let tempMinRow = action.payload - 2 
      let tempMaxRow = action.payload - 1
      let min = action.payload === 1 ? 0 : 9 + (12*tempMinRow )
      let max = action.payload === 1 ? 8 : 8 + (12*tempMaxRow )
   
      state.tmpPokemons.forEach((el,idx) => {
        if(idx >= min && idx <= max) toShow.push(el)
      })
      return {...state,
        toShow:toShow,
        page:action.payload 
      };
    
      case "getTypes":
  
      return {...state,
        types:sortAsc(action.payload,'name')
      };
      case "orderBy":
      let tmpOrder = null

      tmpOrder = action.payload.order === 'ASC' ? sortAsc(state.tmpPokemons,action.payload.value) : sortDesc(state.tmpPokemons,action.payload.value)

      let tmp2 = getShowPages(tmpOrder)
      return {...state,
        tmpPokemons:tmpOrder,
        toShow:tmp2[0],
        totalPages:tmp2[1],
        page:1
      };

      case "filterCreated":

      let tmpFilters =  [...state.Pokemons]
      if(action.payload.created === "N") 
          tmpFilters = tmpFilters.filter( el => el.created === false)
      else if(action.payload.created === "C") 
        tmpFilters = tmpFilters.filter( el => el.created === true) 

      let tmp3 = getShowPages(tmpFilters)
      return {...state,
        tmpPokemons:tmpFilters,
        toShow:tmp3[0],
        totalPages:tmp3[1],
        page:1
      };

      case "getByID":

      return {...state,
        PokemonDetail:action.payload.length > 0 ? action.payload[0] : {},
        page:1
      };

      case "getByName":

      return {...state,
        PokemonDetail:action.payload.length > 0 ? action.payload[0] : {},
        page:1
      };

      case "createPokemon":
        let addPokemonCreated = [...state.Pokemons]
        addPokemonCreated = sortAsc(addPokemonCreated,'id')
        addPokemonCreated.push(action.payload)
        
        let tmp5 = getShowPages(addPokemonCreated)
       return  {
          ...state,
          Pokemons:addPokemonCreated,
          tmpPokemons:addPokemonCreated,
          createInfo:action.payload,
          toShow:tmp5[0],
          totalPages:tmp5[1],
          Page:1
        };

      case "resetStatusCreate":
        return {
          ...state,
          createInfo:null
        };

      case "addUser":
        let users = [...state.Users]
        users.push(action.payload.name)
        return {
          ...state,
          Users:users,
          createInfo:action.payload.name ? action.payload.msg : action.payload.err
        }
        
        case "getUsers":
          return {
            ...state,
            Users:action.payload.users
          }

        case "setUser":

          let  formatJson =  state.Pokemons.map( el =>{
            return {
              ...el,
              favorite: action.payload.arrayFavorites.length && action.payload.arrayFavorites.findIndex( fav => el.name === fav.name ) >= 0 ? true : false
            }
          } )
          let pagesFav = getShowPages(formatJson)
          return {...state,
            tmpPokemons:formatJson,
            selectedUser:action.payload.user,
            toShow:pagesFav[0],
            totalPages:pagesFav[1],
            Pokemons:formatJson,
            Page:1
          };

        
        case "getFavorites":
          let pages = getShowPages(action.payload)
          let pokemons = action.payload?.map( el => el.favorite = true)
          return {...state,
            tmpPokemons:pokemons,
            Pokemons:pokemons,
            toShow:pages[0],
            totalPages:pages[1],
            Page:1
          };
        case "addFavorite":
          return {
            ...state
          }
    default:
      return state
  }
}

export default pokemons;