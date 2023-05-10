import * as Joi from 'joi';
import { waitReasons } from './Activity';

export const ActivityUpdateSchema = Joi.object().keys({
  id: Joi.string().required(),
  waitReason: Joi.array().items(...Object.values(waitReasons)).required(),
  notes: Joi.string().allow(null)
});
