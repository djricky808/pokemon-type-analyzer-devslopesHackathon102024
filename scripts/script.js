import {typeEffectiveness} from "./typeEffectiveness.js";

Object.entries(typeEffectiveness).forEach((type) => {
    const [pokemonType, attackType] = type;
    if (pokemonType === "fire"){
        console.log(attackType);
    }
})

