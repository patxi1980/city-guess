
import React, {useContext} from "react";
import {MapComponent} from "../Map/Map";
import {GameContext} from "./GameContext";


export interface City {
    name: string,
    coords: number[],
}

const kmsToReduceLives: number = 50;

export const GameComponent = () => {

    const gameContext = useContext(GameContext);

    const calculatePoints = (distanceInKm: number) => {
        let livesLost = Math.trunc(distanceInKm / kmsToReduceLives);

        updateGame(livesLost, distanceInKm);
    };

    const updateGame = (livesLost: number, distance: number) => {

        if (gameContext.game.gameOver) {
            if (gameContext.game.haveWon) {
                alert("Game is Over - You Won");
            } else {
                alert("Game is Over - You Lost");
            }

            return;
        }

        gameContext.game.lives = Math.max(0, gameContext.game.lives - livesLost);

        if (gameContext.game.lives > 0) {
            gameContext.game.points++

            if (gameContext.game.cities.length > (gameContext.game.cityPos + 1)) {
                gameContext.game.cityPos++;
            } else {
                gameContext.game.gameOver = true;
                gameContext.game.haveWon = true;
            }

        } else {
            gameContext.game.gameOver = true;
        }

        gameContext.setGame({
            ...gameContext.game,
            points: gameContext.game.points,
            lives: gameContext.game.lives,
            cityPos: gameContext.game.cityPos,
            currentCity: gameContext.game.cities[gameContext.game.cityPos]
        });

        alert("Distance to city: "+distance+"kms"+
            "\nLives lost: "+livesLost+
            "\nPending Lives: "+gameContext.game.lives+
            "\nScore: "+gameContext.game.points
        );
    }


    return (
        <div>
            <div className="gameHeader">
                City: {gameContext.game?.cities[gameContext.game?.cityPos].name}
            </div>
            <MapComponent onChangeScore={calculatePoints}  />
            <div className="gameFooter">
                Points - {gameContext.game?.points} Lives - {gameContext.game?.lives}
            </div>
        </div>
    )
}