import {createContext, useState} from "react";
import {City} from "./Game";
import {Map} from 'ol';

export interface GameType {
    cities: City[],
    currentCity: City,
    points: number,
    lives: number,
    cityPos: number,
    gameOver: boolean,
    haveWon: boolean,
    map: Map|null,
}


interface GameContextProviderProps {
    children: React.ReactNode,
    cities: City[],
}

export interface GameContextType {
    game: GameType,
    setGame:  React.Dispatch<React.SetStateAction<GameType>>
}

export const GameContext = createContext<GameContextType>({} as GameContextType);

export const GameContextProvider = ({children, cities}: GameContextProviderProps) => {

    let initialGame = {
        points: 0,
        lives: 10,
        cities: cities,
        currentCity: cities[0],
        cityPos: 0,
        gameOver: false,
        haveWon: false,
        map: null,
    };

    const [game, setGame] = useState<GameType>(initialGame);

    return (
        <GameContext.Provider value={{game, setGame}}>
            {children}
        </GameContext.Provider>
    )

};