export class CreateTaskDto {

    name: string;

    description: string;

    idCreator: number;

    idResponsible?: number;

    startDate: Date;

    endDate: Date;

}
