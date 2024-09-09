import { baseLogger } from "./logger";

const logger = baseLogger.child({ service: "retry" }, { level: "debug" })

export async function retry(func: () => Promise<any>, retries = 10, delay = 10000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await new Promise(resolve => setTimeout(resolve, 500)); // Espera antes de tentar novamente
            return await func();
        } catch (error: any) {
            if (error.response.status !== 429) console.log(error)

            if (attempt < retries) {
                logger.warn(`Tentativa ${attempt} de ${retries} falhou. Tentando novamente em ${delay / 1000} segundos.`);
                await new Promise(resolve => setTimeout(resolve, delay)); // Espera antes de tentar novamente
            } else {
                logger.error(`Todas as ${retries} tentativas falharam.`);
                throw error; // Rejeita após todas as tentativas falharem
            }
        }
    }
}