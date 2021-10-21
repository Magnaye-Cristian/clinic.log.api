export interface Log {
    university_id: number;
    school_id: string | null;
    type: string;
    type_spec: string;
    department: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    purpose: string;
    complaint: string;
    address: string;
    timein: Date | null;
    timeout: Date | null;
}