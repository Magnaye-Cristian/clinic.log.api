import connection from "../connection";



export abstract class SchoolSQL{
    static async createUniversity(universityName: string){
        const results = (await connection).execute(`
        INSERT INTO Universities
        (name)
        VALUES
        (?)
        `, [universityName] );
        console.log(results);
        return true;
    }

    static async createProgram(programName: string){
        const results = (await connection).execute(`
        INSERT INTO Programs
        (name)
        VALUES
        (?)
        `, [programName] );
        console.log(results);
        return true;
    }
}