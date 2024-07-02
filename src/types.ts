export type Questions = {
    pergunta: string;
    resposta: string;
}

// Tipo genérico que aceita qualquer campo adicional
export type PayloadEvent = {
    perguntas: Questions[];
} & Record<string, string>