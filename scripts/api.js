// const URL = "https://pokeapi.co/api/v2/pokemon";

// function fetchAllPokemon() {
//   let promises = [];
//   for (let i = 1; i < 1025; i++) {
//     let promise = fetch(`${URL}/${i}`);
//     promises.push(promise);
//   }
//   return Promise.all(promises);
// }

// export const getPokemonData = (type1, type2) =>
//   fetchAllPokemon()
//     .then((response) => {
//       return Promise.all(response.map((res) => res.json()));
//     })
//     .then((data) => {
//       getTypeFromPokemon(data, type1, type2);
//     })
//     .catch((error) => {
//       console.log("Pokemon not found", error);
//     });

// function getTypeFromPokemon(pokemon, type1, type2) {
//   let pokemonThatMatchedSelectedTypes = [];
//   let purePokemonType = [];
//   pokemon.forEach((pokemon) => {
//     let firstPokemonType = pokemon.types[0].type.name;
//     let secondPokemonType = pokemon.types[1]?.type.name;

//     if (type2) {
//       if (firstPokemonType === type1 || firstPokemonType === type2) {
//         if (
//           (secondPokemonType && secondPokemonType === type1) ||
//           secondPokemonType === type2
//         ) {
//           pokemonThatMatchedSelectedTypes.push(pokemon);
//         }
//       }
//     } else {
//       if (firstPokemonType === type1) {
//         if (!secondPokemonType) {
//           purePokemonType.push(pokemon);
//         }
//         pokemonThatMatchedSelectedTypes.push(pokemon);
//       } else if (secondPokemonType === type1) {
//         pokemonThatMatchedSelectedTypes.push(pokemon);
//       }
//     }
//   });
//   console.log("--------DUAL TYPES----------");
//   setUpMatchingPokemon(pokemonThatMatchedSelectedTypes);
//   console.log("--------PURE TYPES----------");
//   setUpMatchingPokemon(purePokemonType);
//   pickRandomPokemon(pokemonThatMatchedSelectedTypes);
// }

// getPokemonData("fire","water");

// function setUpMatchingPokemon(matchingPokemon) {
//   matchingPokemon.forEach((pokemon) => {
//     let pokemonName =
//       pokemon.forms[0].name.charAt(0).toUpperCase() +
//       pokemon.forms[0].name.slice(1);
//     console.log(pokemonName);
//   });
// }

// function pickRandomPokemon(matchingPokemon) {
//   let chooseRandomPokemon = Math.floor(Math.random()) * matchingPokemon.length
//   console.log(matchingPokemon[chooseRandomPokemon]);
// }
