import { Request, Response } from 'express';
import { createListService } from '../services/listService';

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
