const { Router } = require('express');
const axios = require('axios');
const {dbConnectCollection} = require('../db.js');
const router = Router();



router.get("/types", function(req,res){
    res.set('Content-Type', 'application/json');
  

    axios.get('https://pokeapi.co/api/v2/type')
    .then( json => { 
        let types  = json.data.results.map( (el,index) =>{
            return {id:index+1, name:el.name}
        })
    
        return res.status(200).send(types)
    })
    .catch( err => {
        console.log(err)
       return res.status(500).send({err})
    });

} )

router.post("/users", async function(req,res){
    try{
        let collection = await dbConnectCollection("Favoritos")
        let user = {
            name:req.body.name,
            favorites:[]
        }

        collection.insertOne(user)
        res.status(200).send({name:user.name,msg:"Usuario insertado con exito"})
    }
    catch(e){
        res.status(500).send({err:'Error al insertar usuario'})
    }

} )

router.get("/users", async function(req,res){
    try{
        let collection = await dbConnectCollection("Favoritos")

        let users = await collection.find().toArray()
        users = users?.map( user => user.name)
        res.status(200).send({users})
    }
    catch(err){
        console.log(err);
        res.status(500).send({err:'Error al obtener usuario'})
    }

} )


router.post("/favorites", async function(req,res){
    try{
        let collection = await dbConnectCollection("Favoritos")
        console.log("user",req.body);
        let users = await collection.findOne({name:req.body.username})
        favoritesPokemon = {
            name: req.body.name,
            id: req.body.id,
            img: req.body.img
        }
        if(users && users.favorites.findIndex( el => el.name === favoritesPokemon.name) < 0){
            console.log("entre");
            users.favorites.push(favoritesPokemon)
            collection.updateOne({name:req.body.username},{$set:{favorites:users.favorites}})
        }
        res.status(200).send({msg:"Favorito agregado"})
    }
    catch(err){
        console.log(err);
        res.status(500).send({err:'Error al agregar favorito'})
    }

} )

router.get("/favorites/:username", async function(req,res){
    try{
        let collection = await dbConnectCollection("Favoritos")

        let users = await collection.findOne({name:req.params.username})
        if(users)
         res.status(200).send(users.favorites)
        else
            res.status(200).send([])
    }
    catch(err){
        console.log(err);
        res.status(500).send({err:'Error al agregar favorito'})
    }

} )

router.get("/pokemons", async function(req,res){
    let collection = await dbConnectCollection("CustomPokemon")

    //si buscamos el pokemon por nombre
    if(req.query.hasOwnProperty('name')){
        try{
            let pokemon = await collection.findOne({name:req.query.name});
            
            if(!pokemon){
                pokemonAPI = await axios.get(`https://pokeapi.co/api/v2/pokemon/${req.query.name}`,{timeout:600000})
                let localArrTypes = pokemonAPI.data.types.map( el => el.type.name)
                pokemon = {
                    id:pokemonAPI.data.id,
                    name:pokemonAPI.data.name,
                    height:pokemonAPI.data.height,
                    weight:pokemonAPI.data.weight,
                    hp:pokemonAPI.data.stats[0].base_stat,
                    attack:pokemonAPI.data.stats[1].base_stat,
                    defense:pokemonAPI.data.stats[2].base_stat,
                    speed:pokemonAPI.data.stats[5].base_stat,
                    created:false,
                    img:pokemonAPI.data.sprites.front_default,
                    types:localArrTypes
                }
            }
            res.status(200).send([pokemon])
        }
        catch(err){
            console.log("cathc",err);
            res.status(404).send(err)
        }
        
    }
    else{

     //Obtener los primeros 40 pokemon y base de datos
        try{
            pokemonDB =  await collection.find().toArray();
            pokemonAPI = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=40')
            
            //hacemos un array de promesas para ejecutarlas todas juntas
            pokemonAPI = pokemonAPI.data.results.map(el =>{
                return axios.get(el.url)
            })
    
            pokemonAPI = await Promise.all(pokemonAPI)
            //mapeamos nuestro json a la salida deseada
            pokemonAPI = pokemonAPI.map(el => {
            
                let localArrTypes = el.data.types.map( el => el.type.name)
                return {
                    id:el.data.id,
                    name:el.data.name,
                    height:el.data.height,
                    weight:el.data.weight,
                    hp:el.data.stats[0].base_stat,
                    attack:el.data.stats[1].base_stat,
                    defense:el.data.stats[2].base_stat,
                    speed:el.data.stats[5].base_stat,
                    created:false,
                    img:el.data.sprites.front_default,
                    types:localArrTypes
                }
            });
            res.status(200).send([...pokemonAPI,...pokemonDB])
        }catch(err){
            console.log(err);
            res.status(404).send(err)
        }
      
    }


})

router.get("/pokemons/:id", async function(req,res){
    let responseJSON = {}
    let collection = await dbConnectCollection("CustomPokemon")
    if(req.params.id.toString().length <= 4){
        responseJSON = await axios.get(`https://pokeapi.co/api/v2/pokemon/${req.params.id}`)
        let localArrTypes = responseJSON.data.types.map( el => el.type.name)
        responseJSON = {
            id:responseJSON.data.id,
            name:responseJSON.data.name,
            height:responseJSON.data.height,
            weight:responseJSON.data.weight,
            hp:responseJSON.data.stats[0].base_stat,
            attack:responseJSON.data.stats[1].base_stat,
            defense:responseJSON.data.stats[2].base_stat,
            speed:responseJSON.data.stats[5].base_stat,
            img:responseJSON.data.sprites.front_default,
            types:localArrTypes
        }
        res.status(200).send([responseJSON])
    }
    else{
        responseJSON = await collection.find({id:req.params.id}).toArray();
        res.status(200).send(responseJSON)
    }

   
})



router.post('/pokemons',async function(req,res){
 
    try{
        let {name,weight,height,hp,type,attack,defense,speed} = req.body
        let pokemon = { 
            name:name.toLowerCase(),
            weight,
            height,
            hp,
            attack,
            defense,
            speed,
            types:type,
            created:true
        }

        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        let id = "";
        for ( var i = 0; i < 20; i++ ) {
          id += characters.charAt(Math.floor(Math.random() * charactersLength));
       }

        let collection = await dbConnectCollection("CustomPokemon")
        pokemon.img = "/Agumon.png"
        pokemon.id = id
        collection.insertOne(pokemon)
     
        res.status(200).send({...pokemon,img:'',succes:'Pokemon Creado con Exito'})
    }
    catch(err){
        res.status(500).send({errMesage:'Fallo en la creación',err})
    }
})

module.exports = router;
