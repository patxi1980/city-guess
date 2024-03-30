
import React, {useEffect, useRef, useState} from "react";
import {MapComponent} from "../Map/Map";


interface GameContextType {
    cities: City[],
    currentCity: City,
    points: number,
    lives: number,
    cityPos: number,
    gameOver: boolean,
    haveWon: boolean,
}

export interface City {
    name: string,
    coords: number[],
}

interface GameComponentProps {
    cities: City[],
}

const kmsToReduceLives: number = 50;

export const GameComponent = ({cities}: GameComponentProps) => {

    let initialGame = {
        points: 0,
        lives: 10,
        cities: cities,
        currentCity: {} as City,
        cityPos: 0,
        gameOver: false,
        haveWon: false,
    }
    const [game, setGame] = useState<GameContextType>(initialGame);
    const mapRef = useRef<any>();

    const calculatePoints = (distanceInKm: number) => {
        let livesLost = Math.trunc(distanceInKm / kmsToReduceLives);

        updateGame(livesLost, distanceInKm);
    };



    const updateCity = () => {
        game.currentCity = cities[game.cityPos];

        if (mapRef.current) {
            mapRef.current.updateCity(game.currentCity);
        }
    }

    const updateGame = (livesLost: number, distance: number) => {

        if (game.gameOver) {
            if (game.haveWon) {
                alert("Game is Over - You Won");
            } else {
                alert("Game is Over - You Lost");
            }

            return;
        }

        game.lives = Math.max(0, game.lives - livesLost);

        if (game.lives > 0) {
            game.points++

            if (cities.length > (game.cityPos + 1)) {
                game.cityPos++;
            } else {
                game.gameOver = true;
                game.haveWon = true;
            }

        } else {
            game.gameOver = true;
        }

        updateCity();

        setGame({
            ...game,
            points: game.points,
            lives: game.lives,
            cityPos: game.cityPos,
            currentCity: cities[game.cityPos]
        });

        alert("Distance to city: "+distance+"kms"+
            "\nLives lost: "+livesLost+
            "\nPending Lives: "+game.lives+
            "\nScore: "+game.points
        );
    }


    useEffect(() => {
        updateCity();
    });

    return (
        <div>
            <div className="gameHeader">
                City: {game.cities[game.cityPos].name}
            </div>
            <MapComponent onChangeScore={calculatePoints} ref={mapRef} />
            <div className="gameFooter">
                Points - {game.points} Lives - {game.lives}
            </div>
        </div>
    )
}