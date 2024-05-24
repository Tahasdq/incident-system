const puppeteer = require('puppeteer');

module.exports = async (occurrence, report, ReportCreatedBy) => {
    let { av_garison, occurance_Number, ClosedBy, MadeBy, Request, Description, registrationDate, Status, DispatchBy, phone, Applicant, Street, CPF, CEP, Neighbourhood, City, Reference } = occurrence;
    let { formFields, description } = report;

    const occurence_code_to_display = occurance_Number.toString().padStart(4, '0');
    const date = new Date();
    const formattedDate = date.toLocaleDateString();
    const time = date.toLocaleTimeString();

    const sampleData = {
        applicant: [
            { label: "Nome", data: `${Applicant}` },
            { label: "CPF", data: `${Reference}` },
            { label: "Telefone", data: `${phone}` },
            { label: "Rua", data: `${Street}` },
            { label: "Bairro", data: `${Neighbourhood}` },
            { label: "Cidade", data: `${City}` },
            { label: "Código de ocorrência", data: `${occurance_Number}` }
        ],
        garrison: [...av_garison],
        peopleInvolved: [...formFields]
    };

    let htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Report</title>
            <style>
                body {
                    background-color: #f2f2f2;
                    font-family: Arial, sans-serif;
                    margin: 10px;
                    padding: 10px;
                }
                .container {
                    background-color: #fff;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    margin: 20px auto;
                    max-width: 1200px;
                }
                h1,
                h2 {
                    color: #343a40;
                }
                .section {
                    padding: 20px;
                    margin-bottom: 20px;
                    border-radius: 8px;
                    background-color: #f8f9fa;
                    page-break-inside: avoid;
                }
                .border-right {
                    border-right: 1px solid #dee2e6;
                }
                .border-left {
                    border-left: 1px solid #dee2e6;
                }
                hr {
                    border-top: 1px solid #dee2e6;
                }
                ul {
                    list-style-type: none;
                    padding: 0;
                }
                li {
                    margin-bottom: 10px;
                }
                li strong {
                    color: #007bff;
                }
                .horizontal-list {
                    display: flex;
                    flex-wrap: wrap;
                }
                .horizontal-list>div {
                    flex: 0 0 50%;
                    padding: 10px;
                    box-sizing: border-box;
                    border-right: 1px solid #dee2e6;
                    border-bottom: 1px solid #dee2e6;
                    page-break-inside: avoid;
                }
                .horizontal-list>div:nth-child(odd) {
                    border-right: none;
                }
                .horizontal-list>div:nth-child(even) {
                    border-left: 1px solid #dee2e6;
                }
                .horizontal-list hr {
                    border-top: 1px solid #dee2e6;
                    width: 100%;
                    margin: 10px 0;
                }
                .download-button {
                    margin-top: 20px;
                    text-align: center;
                }
                .new-button {
                    margin-top: 5px;
                    text-align: center;
                }
                .margin-t {
                    margin-top: 10px;
                }
                .margin-b {
                    margin-bottom: 20px;
                }
                .do-it {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-weight: 600;
                }
                .down {
                    display: flex;
                    justify-content: space-evenly;
                    font-weight: 600;
                }
                .row {
                    display: flex;
                    flex-wrap: wrap;
                    margin-right: -15px;
                    margin-left: -15px;
                    page-break-inside: avoid;
                }
                .col-md-6 {
                    flex: 0 0 50%;
                    max-width: 50%;
                    padding-right: 15px;
                    padding-left: 15px;
                    box-sizing: border-box;
                }
                .col-md-12 {
                    flex: 0 0 100%;
                    max-width: 100%;
                    padding-right: 15px;
                    padding-left: 15px;
                    box-sizing: border-box;
                }
                .text-center {
                    text-align: center;
                }
                @media print {
                    .container {
                        max-width: none;
                        margin: 0;
                        padding: 0;
                        box-shadow: none;
                        border-radius: 0;
                    }
                    .section,
                    .row,
                    .horizontal-list>div {
                        page-break-inside: avoid;
                    }
                    .horizontal-list>div {
                        page-break-after: avoid;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container margin-t">
                <div class="new down">
                    <p>Relatório Gerado Por: ${ReportCreatedBy}</p>
                    <p>Criado em Data: ${formattedDate}</p>
                    <p>Criado em Hora: ${time}</p>
                </div>
                <h1 class="text-center margin-b">Relatório</h1>
                <hr>
                <div class="row">
                    <div class="col-md-6 occurrence-details section border-right">
                        <h2>Detalhes da Ocorrência</h2>
                        <ul>
                            <li><strong>Telefone:</strong> ${phone}</li>
                            <li><strong>Requerente:</strong> ${Applicant}</li>
                            <li><strong>Rua:</strong> ${Street}</li>
                            <li><strong>CPF:</strong> ${CPF}</li>
                            <li><strong>CEP:</strong> ${CEP}</li>
                            <li><strong>Bairro:</strong> ${Neighbourhood}</li>
                            <li><strong>Cidade:</strong> ${City}</li>
                            <li><strong>Referência:</strong> ${Reference}</li>
                            <li><strong>Descrição:</strong> ${Description}</li>
                            <li><strong>Solicitação:</strong> ${Request}</li>
                        </ul>
                    </div>
                    <div class="col-md-6 garison-details section border-left">
                        <h2>Detalhes do Batalhão</h2>
                        <ul>
                            ${sampleData.garrison.map((garison, index) => `
                                ${index > 0 ? '<hr>' : ''}
                                <li><strong>Nome do Batalhão:</strong> ${garison.garissonName}</li>
                                <li><strong>ID do Batalhão:</strong> ${garison.garissonId}</li>
                                <li><strong>Tempo de Despacho:</strong> ${garison.DispachTime === 'Notarrived' ? 'Não chegou' : new Date(garison.DispachTime).toLocaleTimeString()}</li>
                                <li><strong>Tempo de Chegada:</strong> ${garison.ArrivalTime === 'Notarrived' ? 'Não chegou' : new Date(garison.ArrivalTime).toLocaleTimeString()}</li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-md-12 report-details section">
                        <h2>Detalhes do Relatório</h2>
                        <ul>
                            <li><strong>Descrição:</strong> ${description}</li>
                        </ul>
                        <div class="horizontal-list">
                            ${sampleData.peopleInvolved.map((field, index) => `
                                <div>
                                    <ul>
                                        <li><strong>ID da Ocorrência:</strong> ${field.IdOfOccurence}</li>
                                        <li><strong>Nome:</strong> ${field.name}</li>
                                        <li><strong>CPF:</strong> ${field.cpf}</li>
                                        <li><strong>Telefone:</strong> ${field.phone}</li>
                                        <li><strong>CEP:</strong> ${field.cep}</li>
                                        <li><strong>Rua:</strong> ${field.street}</li>
                                        <li><strong>Bairro:</strong> ${field.Neighborhood}</li>
                                        <li><strong>Cidade:</strong> ${field.City}</li>
                                        <li><strong>Pessoa:</strong> ${field.person}</li>
                                    </ul>
                                </div>
                                ${index % 2 === 1 && index < sampleData.peopleInvolved.length - 1 ? '<hr>' : ''}
                            `).join('')}
                        </div>
                    </div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-md-12 additional-info section">
                        <h2>Informações Adicionais</h2>
                        <ul>
                            <li><strong>Número da Ocorrência:</strong> ${occurance_Number}</li>
                            <li><strong>Código da Ocorrência:</strong> ${occurence_code_to_display}</li>
                            <li><strong>Status:</strong> ${Status}</li>
                            <li><strong>Tempo:</strong> ${occurrence.Time === 'Notarrived' ? 'Não chegou' : new Date(occurrence.Time).toLocaleTimeString()}</li>
                            <li><strong>Data:</strong> ${new Date(occurrence.Time).toLocaleDateString()}</li>
                            <li><strong>Feito Por:</strong> ${MadeBy}</li>
                            <li><strong>Data de Registro:</strong> ${new Date(registrationDate).toLocaleDateString()}</li>
                            <li><strong>Despachado Por:</strong> ${DispatchBy}</li>
                            <li><strong>Fechado Por:</strong> ${ClosedBy}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu',
            '--disable-dev-shm-usage'
        ],
        timeout: 0
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', timeout: 60000 });

    await browser.close();

    return pdfBuffer;
};
