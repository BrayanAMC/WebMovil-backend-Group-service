export class CreateTaskDto {

    name: string;

    description?: string;

    emailCreator: string;

    idResponsible?: number;

    startDate: Date;

    endDate: Date;

    idProject: number;

}
