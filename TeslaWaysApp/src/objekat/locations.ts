import { Question } from "./question";

export class Location {
    id: string;
    index: number;
    adress: string;
    lat: number;
    lng: number;
    title: string; // naziv lokacije
    content: string;
    urlToImg: string;
    questions: Question[];
    status: string; // locked, undiscovered, answered
    answered: boolean;
}