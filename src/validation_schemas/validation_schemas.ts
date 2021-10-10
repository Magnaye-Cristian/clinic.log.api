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
        role: Joi.valid('student', 'faculty', 'staff', 'admin').required(),
        university: Joi.number().required(),
        password: Joi.string().regex(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')).message(`
        At least one upper case English letter,
        At least one lower case English letter,
        At least one digit,
        At least one special character,
        Minimum eight in length
        `).required(),
        first_name: Joi.string().required().max(30), //added restriction, I don't think names will exceed this length
        last_name: Joi.string().required().max(30),
        middle_name: Joi.string().required().max(30),
        department: Joi.number().required(),
        program: Joi.number().required(),
        school_id: Joi.string().required(), // 123123,123,asd234 different formats so this cannot be a number
        code: Joi.string().required()
    });

    static peopleUpdate = Joi.object({
        first_name: Joi.string(),
        last_name: Joi.string(),
        middle_name: Joi.string(),
        department_id: Joi.number(),
        program_id: Joi.number(),
        password: Joi.string(),
    })

    static deactivate = Joi.object({
        school_id: Joi.string().required()
    })
}

