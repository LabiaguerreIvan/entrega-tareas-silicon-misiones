// ===== PARTE A: array de valores simples =====
console.log("\n--- PARTE A ---\n");

let categorias = ["Acción", "Arcade", "Shooter", "Survival-Horror", "Multiplayer"];

// 01
console.log("Array completo: ", categorias); 

// 02
console.log("Cantidad de categorías: ", categorias.length); 

// 03
console.log("Primera categoría: ", categorias[0]); 
console.log("Última categoría: ", categorias[categorias.length - 1]); 

// 04
categorias.push("Estrategia"); 
console.log("Array actualizado: ", categorias); 

// 05
let categoriaEliminada = categorias.pop(); 
console.log("Última categoría eliminada: ", categoriaEliminada);


// ===== PARTE B: objeto =====
console.log("\n--- PARTE B ---\n");

// 06
let usuario = {
    nombre: "Ivan",
    edad: 22,
    ciudad: "Posadas",
    temaFavorito: "Tumba la casa - Remix"
}

// 07
console.log( `- Nombre: ${usuario.nombre} \n- Edad: ${usuario.edad} \n- Ciudad: ${usuario.ciudad} \n- Tema favorito: ${usuario.temaFavorito}`);

// 08
usuario.temaFavorito = "Wonderwall - Oasis";
console.log( `Tema favorito: ${usuario.temaFavorito}`);

// 09
usuario.nivelIngles = "B2 - C1";
console.log(`- Nombre: ${usuario.nombre} \n- Edad: ${usuario.edad} \n- Ciudad: ${usuario.ciudad} \n- Tema Favorito: ${usuario.temaFavorito} \n- Nivel de inglés: ${usuario.nivelIngles}`);


// ===== PARTE C: array de objetos =====
console.log("\n--- PARTE C ---\n");


// 10 
let catalogo = [

    {    
        titulo: "The Last of Us",
        categoria: "Aventura",
        puntaje: 10,
        jugado: true
    },

    {    
        titulo: "Resident Evil 4",
        categoria: "Survival-Horror",
        puntaje: 10,
        jugado: true
    },

    {    
        titulo: "Grand Theft Auto: San Andreas",
        categoria: "Aventura, Shooter",
        puntaje: 9,
        jugado: true
    },

    {    
        titulo: "God of War",
        categoria: "Acción",
        puntaje: 9,
        jugado: false
    },

];

// 11
console.log("Título del 1er juego: ", catalogo[0].titulo);
console.log("Puntajedel 3er juego: ", catalogo[2].puntaje);

// 12
let estado = catalogo[1].jugado ? "Jugado" : "Pendiente"
console.log(`- 2do Juego: ${catalogo[1].titulo} \n- Categoría: ${catalogo[1].categoria} \n- Puntaje: ${catalogo[1].puntaje}/10 \n- Jugado: ${estado}`);

// 13
catalogo[3].puntaje = 1;
console.log(`Puntaje actualizado del 4to juego: ${catalogo[3].puntaje} /10`)

//14
catalogo.push({
    titulo: "Resident Evil Requiem",
    categoria: "Acción, Aventura",
    puntaje: 9.3,
    jugado: false
})
console.log("Catálogo actualizado: ",catalogo)


// ===== PARTE D: destructuring =====
console.log("\n--- PARTE D ---\n");

// 15
let {titulo, categoria, puntaje, jugado} = catalogo[0];
console.log(`- Título: ${titulo} \n- Categoría: ${categoria} \n- Puntaje: ${puntaje}/10 \n- Jugado: ${jugado}`);

// 16
let {nombre, ciudad} = usuario;
console.log(`- Nombre: ${nombre} \n- Ciudad: ${ciudad}`);

// 17 
let [primero, segundo] = catalogo;
console.log("- 1er juego:", primero.titulo);
console.log("- 2do juego:", segundo.titulo);


// ===== PARTE E =====
console.log("\n--- PARTE E ---\n");

// 18
let { titulo: gameTitle } = catalogo[4];
console.log("Título del 5to juego: ", gameTitle);

// 19
let { favMusicGenre = "Rock", favMovie = "El Señor de los Anillos"} = usuario;
console.log(`- Género musical favorito: ${favMusicGenre} \n- Película favorita: ${favMovie}`);

// 20
let lastMovie = "La Odisea";
console.log(`- Película favorita: ${favMovie} \n- Última película vista: ${lastMovie}`);

[favMovie, lastMovie] = [lastMovie, favMovie];

console.log(`- Película favorita: ${favMovie} \n- Última película vista: ${lastMovie}`);