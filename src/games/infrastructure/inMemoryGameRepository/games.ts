import { Game } from "../../domain/gameModel";

export const GAMES: Game[] = [
    {
        name: "God of War Ragnarök",
        stock: 7,
        price: 300000,
        imageUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/4xJ8XB3bi888QTLZYdl7Oi0s.png",
        id: 2,
    },
    {
        name: "God of War",
        stock: 5,
        price: 100000,
        imageUrl: "https://cdn1.epicgames.com/offer/3ddd6a590da64e3686042d108968a6b2/EGS_GodofWar_SantaMonicaStudio_S2_1200x1600-fbdf3cbc2980749091d52751ffabb7b7_1200x1600-fbdf3cbc2980749091d52751ffabb7b7",
        id: 1,
    },
    {
        name: "Horizon Forbidden West",
        stock: 2,
        price: 300000,
        imageUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202107/3100/1dy5w3SNiJnXjP8YvmydCL9X.png",
        id: 3,
    },
];