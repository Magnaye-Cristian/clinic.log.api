import Joi from 'joi';


export abstract class ValidationSchemas {
    // https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
    // password regex
    // This regex will enforce these rules:
    // At least one upper case English letter, (?=.*?[A-Z])
    // At least one lower case English letter, (?=.*?[a-z])
    // At least one digit, (?=.*?[0-9])
    // At least one special character, (?=.*?[#?!@$%^&*-])
    // Minimum eight in length .{8,} (with the anchors)
    static accountCreation = Joi.object({
        role: Joi.number().required(),
        university: Joi.number().required(),
        password: Joi.string().regex(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')).message(`
        At least one upper case English letter,
        At least one lower case English letter,
        At least one digit,
        At least one special character,
        Minimum eight in length
        `),
        department: Joi.number(),
        program: Joi.number(),
        schoolId: Joi.number(),
        validCode: Joi.string()
    });
}

