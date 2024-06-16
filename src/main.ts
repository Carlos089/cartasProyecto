// Función genérica para validar elementos del DOM y asegurarse de que son del tipo esperado
const elementoEsValido = <T extends HTMLElement>(
    elemento: Element | null,
    tipo: { new (): T },
    descripcion: string
  ): T => {
    if (elemento instanceof tipo) {
      return elemento;
    } else {
      throw new Error(`Error con el elemento: ${descripcion}`);
    }
  };
  
  let reiniciarButton: HTMLButtonElement;
  let verQuePasaButton: HTMLButtonElement;
  let puntuacionDiv: HTMLDivElement;
  let pedirButton: HTMLButtonElement;
  let cartaImg: HTMLImageElement;
  let mensajeDiv: HTMLDivElement;
  let plantarseButton: HTMLButtonElement;
  
  document.addEventListener("DOMContentLoaded", () => {
    // Validamos y obtenemos referencias a los elementos del DOM dentro de un bloque try-catch
    try {
      reiniciarButton = elementoEsValido(
        document.getElementById("reiniciar"),
        HTMLButtonElement,
        "Boton Reiniciar"
      );
      verQuePasaButton = elementoEsValido(
        document.getElementById("verQuePasa"),
        HTMLButtonElement,
        "Boton Ver Que Pasa"
      );
      puntuacionDiv = elementoEsValido(
        document.getElementById("puntuacion"),
        HTMLDivElement,
        "Div Puntuacion"
      );
      pedirButton = elementoEsValido(
        document.getElementById("pedirCarta"),
        HTMLButtonElement,
        "Boton Pedir Carta"
      );
      cartaImg = elementoEsValido(
        document.getElementById("carta"),
        HTMLImageElement,
        "Imagen Carta"
      );
      mensajeDiv = elementoEsValido(
        document.getElementById("mensaje"),
        HTMLDivElement,
        "Div Mensaje"
      );
      plantarseButton = elementoEsValido(
        document.getElementById("plantarse"),
        HTMLButtonElement,
        "Boton Plantarse"
      );
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'Error desconocido', error);
    }
  
    // Inicializamos la visibilidad de los botones
    initializeButtonVisibility();
  
    pedirButton.addEventListener("click", pedirCarta);
    plantarseButton.addEventListener("click", plantarseClick);
    reiniciarButton.addEventListener("click", reiniciarJuego);
    verQuePasaButton.addEventListener("click", verQuePasa);
  });
  
  // Inicializamos la visibilidad de los botones
  const initializeButtonVisibility = (): void => {
    if (reiniciarButton) reiniciarButton.style.visibility = "hidden";
    if (verQuePasaButton) verQuePasaButton.style.visibility = "hidden";
  };
  
  let puntuacion: number = 0; // Variable para almacenar la puntuación
  
  // Tipo para definir los diferentes estados del juego
  type Estado = "CONSERVADOR" | "CANGUELO" | "CASI" | "ENHORABUENA";
  
  // Función para mostrar la puntuación actualizada en el DOM
  const muestraPuntuacion = (): void => {
    if (puntuacionDiv) {
      puntuacionDiv.innerHTML =
        puntuacion > 7.5
          ? `Puntuacion sobrepasada: ${puntuacion} GAME OVER`
          : puntuacion === 7.5
          ? `¡Enhorabuena! Has alcanzado 7.5`
          : puntuacion.toString();
  
      if (puntuacion > 7.5 || puntuacion === 7.5) deshabilitarBotones();
    }
  };
  
  // Función para deshabilitar los botones al final del juego
  const deshabilitarBotones = (): void => {
    if (pedirButton) pedirButton.disabled = true;
    if (plantarseButton) plantarseButton.disabled = true;
    if (reiniciarButton) reiniciarButton.style.visibility = "visible";
    if (verQuePasaButton) verQuePasaButton.style.visibility = "visible";
  };
  
  // Función para generar un número aleatorio entre 1 y 10
  const dameNumeroAleatorio = (): number => Math.floor(Math.random() * 10) + 1;
  
  // Función para ajustar el número de la carta en caso de que sea una figura (10, 11, 12)
  const dameNumeroCarta = (numeroAleatorio: number): number =>
    numeroAleatorio > 7 ? numeroAleatorio + 2 : numeroAleatorio;
  
  // Función para obtener la URL de la imagen de la carta según su número
  const dameUrlCarta = (numeroCarta: number): string => {
    switch (numeroCarta) {
      case 1:
        return "1_as-copas.jpg";
      case 2:
        return "2_dos-copas.jpg";
      case 3:
        return "3_tres-copas.jpg";
      case 4:
        return "4_cuatro-copas.jpg";
      case 5:
        return "5_cinco-copas.jpg";
      case 6:
        return "6_seis-copas.jpg";
      case 7:
        return "7_siete-copas.jpg";
      case 10:
        return "10_sota-copas.jpg";
      case 11:
        return "11_caballo-copas.jpg";
      case 12:
        return "12_rey-copas.jpg";
      default:
        return "back.jpg";
    }
  };
  
  // Función para pintar la imagen de la carta en el DOM
  const pintarUrlCarta = (urlCarta: string) => {
    if (cartaImg) cartaImg.src = `src/img/${urlCarta}`;
  };
  
  // Función para pintar la imagen de la carta en el contenedor de cartas
  const pintarCartaEnContenedor = (urlCarta: string) => {
      const nuevaCarta = document.createElement("img");
      nuevaCarta.src = `src/img/${urlCarta}`;
      nuevaCarta.className = "carta";
    }

  
  // Función para obtener los puntos de la carta según su número
  const obtenerPuntosCarta = (numeroCarta: number): number =>
    numeroCarta > 7 ? 0.5 : numeroCarta;
  
  // Función para sumar los puntos actuales con los nuevos puntos
  const sumarPuntos = (puntos: number): number => puntuacion + puntos;
  
  // Función para actualizar los puntos y mostrar la puntuación en el DOM
  const actualizarPuntos = (puntosNuevos: number) => {
    puntuacion = puntosNuevos;
    muestraPuntuacion();
  };
  
  // Función para pedir una nueva carta y actualizar los puntos y la imagen de la carta
  const pedirCarta = () => {
    const numeroAleatorio = dameNumeroAleatorio();
    const carta = dameNumeroCarta(numeroAleatorio);
    const urlCarta = dameUrlCarta(carta);
    pintarUrlCarta(urlCarta);
    pintarCartaEnContenedor(urlCarta);
    const puntosCarta = obtenerPuntosCarta(carta);
    const puntosSumados = sumarPuntos(puntosCarta);
    actualizarPuntos(puntosSumados);
  };
  
  // Función para obtener el estado del juego cuando el jugador decide plantarse
  const getEstadoPlantarse = (): Estado => {
    if (puntuacion === 7.5) return "ENHORABUENA";
    if (puntuacion >= 6) return "CASI";
    if (puntuacion === 5) return "CANGUELO";
    return "CONSERVADOR";
  };
  
  // Función para mostrar un mensaje según el estado del juego
  const mensajePlantarse = (estado: Estado): void => {
    if (mensajeDiv) mensajeDiv.textContent = getMensajeEstado(estado);
  };
  
  // Función para obtener el mensaje correspondiente a cada estado del juego
  const getMensajeEstado = (estado: Estado): string => {
    switch (estado) {
      case "CONSERVADOR":
        return `Has sido muy conservador, te has plantado con tan solo ${puntuacion}`;
      case "CANGUELO":
        return `Te ha entrado el canguelo eh?, te has plantado con ${puntuacion}`;
      case "CASI":
        return `Casi casi..., te plantaste con ${puntuacion}`;
      case "ENHORABUENA":
        return `Lo has clavado! Enhorabuena!`;
      default:
        return "";
    }
  };
  
  // Función para manejar el evento de plantarse y mostrar el mensaje adecuado
  const plantarseClick = (): void => {
    deshabilitarBotones();
    const estado: Estado = getEstadoPlantarse();
    mensajePlantarse(estado);
  };
  
  // Función para manejar el evento de ver que pasa
  const verQuePasa = (): void => {
    pedirCarta();
    deshabilitarBotones();
    if (puntuacion > 7.5 && mensajeDiv) {
      mensajeDiv.textContent = `Has sobrepasado los 7.5 puntos con ${puntuacion}. GAME OVER`;
    }
  };
  
  // Función para habilitar los botones al reiniciar el juego
  const habilitarBotones = (): void => {
    if (pedirButton) pedirButton.disabled = false;
    if (plantarseButton) plantarseButton.disabled = false;
    if (reiniciarButton) reiniciarButton.style.visibility = "hidden";
    if (verQuePasaButton) verQuePasaButton.style.visibility = "hidden";
  };
  
  // Función para limpiar el mensaje del DOM
  const limpiarMensaje = (): void => {
    if (mensajeDiv) mensajeDiv.textContent = "";
  };
  
  // Función para reiniciar la imagen de la carta
  const reiniciarCarta = (): void => {
    if (cartaImg) cartaImg.src = "src/img/back.jpg";
    
  };
  
  // Función para reiniciar todo el juego
  const reiniciarJuego = (): void => {
    puntuacion = 0;
    muestraPuntuacion();
    habilitarBotones();
    limpiarMensaje();
    reiniciarCarta();
  };
  