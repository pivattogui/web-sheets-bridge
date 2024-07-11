### **Descrição**
`WebSheetsBridge` é uma função AWS Lambda escrita em TypeScript que atua como um webhook para receber respostas NPS de outro sistema e registrar essas informações em uma planilha do Google Sheets. Cada resposta, juntamente com dados adicionais, é convertida em uma linha na planilha, facilitando a análise e o armazenamento de feedback de clientes.
## **Recursos**

- **Webhook**: Recebe eventos HTTP POST com dados de NPS.
- **Google Sheets Integration**: Insere dados em uma planilha do Google Sheets.
- **TypeScript**: Escrito em TypeScript para garantir tipagem estática e clareza.
- **Flexibilidade**: Suporta campos adicionais aleatórios nos eventos recebidos.
- **Escalável**: Pode ser facilmente escalado e adaptado para diferentes necessidades de integração.

## **Instalação**

### **Pré-requisitos**

- **Node.js** (versão 14.x ou superior)
- **Lambda AWS** configurada.
- **Google Cloud Account** com Google Sheets API ativada
- **Credenciais de OAuth 2.0** para acessar a API do Google Sheets
### **Passos**

1. **Clone o Repositório**
```bash
git clone https://github.com/pivattogui/web-sheets-bridge.git
cd web-sheets-bridge
```
2. **Instale as Dependências**
```bash
npm install
```
3. **Configure as Credenciais do Google**
   - Obtenha o arquivo `credentials.json` do Google Cloud Console e coloque-o na raiz do projeto.
4. **Compile o Projeto**

```bash   
npm run build
```
5. **Deploy da Lambda**
	- Importar o código compilado para a Lambda;


## **Uso**

1. **Configuração do Webhook**
    
    Configure o seu sistema de NPS para enviar eventos HTTP POST para a URL do webhook da sua Lambda.
    
2. **Exemplo de Evento**

    O evento recebido pelo webhook deve ter a estrutura similar com o seguinte objeto:
```json    
{     
  "campo1": "valor1",
  "campo2": "valor2",
  "campo3": "valor3",
  "perguntas": [{
    "pergunta": "Pergunta 1",
    "resposta": "Resposta 1"
  }, {
    "pergunta": "Pergunta 2",
    "resposta": "Resposta 2"
  }, {
    "pergunta": "Pergunta 3",
    "resposta": "Resposta 3"
  }]
}
```
3. **Processamento**
    
    Cada pergunta será inserida como uma linha na planilha do Google Sheets, mantendo os valores aleatórios constantes para cada linha.
