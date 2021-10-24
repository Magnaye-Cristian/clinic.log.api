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
        role: Joi.valid('student', 'faculty', 'staff', 'admin', 'head admin').required(),
        university: Joi.string().required(),
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
        department: Joi.string().required(),
        program: Joi.string().required(),
        school_id: Joi.string().required(), // 123123,123,asd234 different formats so this cannot be a number
        code: Joi.string().required()
    });

    static peopleUpdate = Joi.object({
        first_name: Joi.string(),
        last_name: Joi.string(),
        middle_name: Joi.string(),
        department: Joi.string(),
        program: Joi.string(),
        password: Joi.string(),
    })

    static deactivate = Joi.object({
        school_id: Joi.string().required()
    })

    static code = Joi.object({
        number_of_codes: Joi.number().required(),
        role: Joi.valid('student', 'faculty', 'staff', 'admin', 'head admin').required()
    })
    static universityName = Joi.object({
        name1: Joi.string().required()
    })

    static programName = Joi.object({
        program: Joi.string().required()
    })
    static role = Joi.object({
        role: Joi.string().required()
    })
    static logsCreate = Joi.object({
        //school id is not required cause a guess does not have a schoolid
        people_id: Joi.number(),
        school_id: Joi.string().empty(''),
        type: Joi.string().valid('university', 'non-university').required(),
        type_spec: Joi.string().valid('guardian', 'parent', 'visitor', 'guest', 'others').empty(''),
        department: Joi.string().empty(''),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        middle_name: Joi.string().required(),
        address: Joi.string().empty(''),
        purpose: Joi.string().valid('bp monitoring', 'check-up', 'consultation', 'emergency case', 'first aid', 'medical', 'medicine', 'others').required(),
        complaint: Joi.string().valid('abdominal pain', 'allergy', 'body malaise', 'chest pain', 'cold', 'dysmenorrhea', 'headache', 'nausea', 'skin rash', 'sprain', 'vomiting', 'wound', 'others').required()
    })
    static logId = Joi.object({
        id: Joi.number().required()
    })
    static logTally = Joi.object({
        month: Joi.number().required(),
        year: Joi.number().required()
    })

    static logUpdate = Joi.object({
        id: Joi.number().required(),
        type: Joi.string().valid('university', 'non-university'),
        type_spec: Joi.string().valid('guardian', 'parent', 'visitor', 'guest', 'others'),
        department: Joi.string().empty(''),
        first_name: Joi.string().empty(''),
        last_name: Joi.string().empty(''),
        middle_name: Joi.string().empty(''),
        address: Joi.string().empty(''),
        purpose: Joi.string().valid('bp monitoring', 'check-up', 'consultation', 'emergency case', 'first aid', 'medical', 'medicine', 'others'),
        complaint: Joi.string().valid('abdominal pain', 'allergy', 'body malaise', 'chest pain', 'cold', 'dysmenorrhea', 'headache', 'nausea', 'skin rash', 'sprain', 'vomiting', 'wound', 'others')
    })
}

