import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PayloadEvent } from './types';

export const eventErrorHandler = (event: APIGatewayEvent): APIGatewayProxyResult | null => {
    if (event.httpMethod !== 'POST') return {
        statusCode: 405,
        body: JSON.stringify({
            message: 'Method not allowed',
        }),
    };

    if (!event.headers['doc_id']) return {
        statusCode: 400,
        body: JSON.stringify({
            message: 'doc_id is required',
        }),
    };

    const payload: PayloadEvent = JSON.parse(event.body || '{}');

    if (!payload?.perguntas || !Array.isArray(payload.perguntas)) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'O campo "perguntas" é obrigatório e deve ser um array.',
            }),
        };
    }

    return null
}

export const getQuestionsWithFields = (payload: PayloadEvent): any[] => {
    const { perguntas, ...fields } = payload;

    return perguntas.map(question => ({
        ...fields,
        ...question
    }));
};