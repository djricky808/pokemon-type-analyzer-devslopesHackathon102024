import {typeEffectiveness} from "./typeEffectiveness.js";

Object.entries(typeEffectiveness).forEach((type) => {
    console.log(type[1].fire);
})

