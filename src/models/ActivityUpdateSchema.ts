import * as Joi from 'joi';
import { WaitReason } from '@dvsa/cvs-type-definitions/types/v1/enums/waitReason.enum';

export const ActivityUpdateSchema = Joi.object().keys({
  id: Joi.string().required(),
  waitReason: Joi.array().items([Object.values(WaitReason)]).required(),
  notes: Joi.string().allow(null)
});
