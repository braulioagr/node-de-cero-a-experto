import { Router } from 'express';
import { buscar } from '../controllers/buscar.js';

export const BuscarRouter = Router();


BuscarRouter.get('/:coleccion/:termino', buscar )