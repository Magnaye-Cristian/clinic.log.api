import Joi from 'joi';


export abstract class ValidationSchemas {
    static accountCreation = Joi.object({
        role: Joi.number().required(),
        // university: Joi.number().required(),
        // password: Joi.string().max(10),
        // department: Joi.number(),
        // program: Joi.number(),
        // schoolId: Joi.number(),
        // validCode: Joi.string()
    });
}

