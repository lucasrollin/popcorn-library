import { Request, Response } from 'express';
import {
  createListService,
  findListsByUserIdService,
  findPublicListsService,
  getListByIdService,
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
