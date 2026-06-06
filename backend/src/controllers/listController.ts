import { Request, Response } from 'express';
import {
  addFilmToListService,
  createListService,
  deleteListService,
  findListsByUserIdService,
  findPublicListsService,
  getListByIdService,
  updateListService,
} from '../services/listService';
import { z } from 'zod';

export const createListController = async (
  req: Request<
    {},
    {},
    {
      name: string;
      description?: string;
      isPublic: boolean;
    }
  >,
  res: Response,
) => {
  const data = {
    name: req.body.name,
    description: req.body.description,
    isPublic: req.body.isPublic,
    userId: req.user!.id,
  };

  const result = await createListService(data);

  res.status(201).json(result);
};

export const getMyListsController = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const result = await findListsByUserIdService(userId);

  res.json(result);
};

export const getPublicListsController = async (_req: Request, res: Response) => {
  const result = await findPublicListsService();

  res.json(result);
};

export const getListController = async (req: Request, res: Response) => {
  const schema = z.object({ id: z.uuid() });

  const result = schema.safeParse(req.params);

  if (!result.success) {
    res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'List id is invalid',
    });

    return;
  }

  const list = await getListByIdService(result.data.id, req.user?.id);

  res.json(list);
};

export const updateListController = async (req: Request, res: Response) => {
  const schema = z.object({ id: z.uuid() });

  const result = schema.safeParse(req.params);

  if (!result.success) {
    res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'List id is invalid',
    });

    return;
  }

  const updatedList = await updateListService(result.data.id, req.user!.id, req.body);

  res.json(updatedList);
};

export const deleteListController = async (req: Request, res: Response) => {
  const schema = z.object({ id: z.uuid() });

  const result = schema.safeParse(req.params);

  if (!result.success) {
    res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'List id is invalid',
    });

    return;
  }

  await deleteListService(result.data.id, req.user!.id);

  res.status(204).end();
};

export const addFilmToListController = async (req: Request, res: Response) => {
  const schema = z.object({ id: z.uuid() });

  const result = schema.safeParse(req.params);

  if (!result.success) {
    res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'List id is invalid',
    });

    return;
  }

  const listFilm = await addFilmToListService(result.data.id, req.body.tmdbId, req.user!.id);

  res.status(201).json(listFilm);
};
