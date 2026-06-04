import { Request, Response } from 'express';
import { createListService, findListsByUserIdService, findPublicListsService } from '../services/listService';

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
