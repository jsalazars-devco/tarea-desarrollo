import ErrorWithStatus from '../../shared/domain/errorWithStatus';
import { emailPattern } from '../../utils';
import { GameInOrderRequest } from './gameInOrderRequestModel';
import { Customer } from './customerInterface';
import { GameInOrder } from './gameInOrderModel';

export const checkOrderId = (id: number): void => {
    if (typeof id !== 'number' || Number.isNaN(id) || id < 0) {
        const error = new ErrorWithStatus('Invalid Order ID: Must be a positive number');
        error.status = 403;
        throw error;
    }
};

export const checkCustomer = (customer: Customer): void => {
    if (
        !(Object.keys(customer).length === 4
            && 'firstName' in customer
            && 'lastName' in customer
            && 'email' in customer
            && 'phone' in customer)
    ) {
        const error = new ErrorWithStatus('Invalid customer object');
        error.status = 403;
        throw error;
    }
    if (
        Number.isNaN(customer.phone)
        || typeof customer.phone !== 'number'
        || customer.phone < 0
        || String(customer.phone).length !== 10
    ) {
        const error = new ErrorWithStatus('Invalid customer: Phone must be a 10 digit number');
        error.status = 403;
        throw error;
    }
    if (!emailPattern.test(customer.email)) {
        const error = new ErrorWithStatus('Invalid customer: Incorrect email');
        error.status = 403;
        throw error;
    }
};

export const checkGamesInOrderRequest = (games: GameInOrderRequest[]): void => {
    if (
        !games.every(game =>
            Object.keys(game).length === 2
            && 'id' in game
            && 'quantity' in game
        )
    ) {
        const error = new ErrorWithStatus('Invalid game object');
        error.status = 403;
        throw error;
    }
    if (
        games.some((game, index) => games.findIndex(g => g.id === game.id) !== index)
    ) {
        const error = new ErrorWithStatus('Games list cannot have two or more of the same game ID');
        error.status = 403;
        throw error;
    }
};

export const checkGamesInOrder = (games: GameInOrder[]): void => {
    if (
        !games.every(game =>
            Object.keys(game).length === 3
            && 'id' in game
            && 'quantity' in game
            && 'price' in game
        )
    ) {
        const error = new ErrorWithStatus('Invalid game object');
        error.status = 403;
        throw error;
    }
    if (
        games.some((game, index) => games.findIndex(g => g.id === game.id) !== index)
    ) {
        const error = new ErrorWithStatus('Games list cannot have two or more of the same game ID');
        error.status = 403;
        throw error;
    }
};

export const checkCompleted = (completed: boolean): void => {
    if (typeof completed !== 'boolean') {
        const error = new ErrorWithStatus('Invalid Order completed status: Must be boolean');
        error.status = 403;
        throw error;
    }
};

