"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DocumentProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentProcessor = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../core/database/prisma/prisma.service");
const storage_service_1 = require("../../../core/storage/storage.service");
const config_1 = require("@nestjs/config");
const Handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
let DocumentProcessor = DocumentProcessor_1 = class DocumentProcessor {
    constructor(prisma, storageService, configService) {
        this.prisma = prisma;
        this.storageService = storageService;
        this.configService = configService;
        this.logger = new common_1.Logger(DocumentProcessor_1.name);
    }
    async process(jobData) {
        const startTime = Date.now();
        const steps = [];
        try {
            const templateStepStart = Date.now();
            const templateHtml = this.loadTemplate(jobData.type);
            steps.push({ step: 'template_load', status: 'completed', durationMs: Date.now() - templateStepStart });
            if (jobData.aiEnhanced) {
                const aiStepStart = Date.now();
                try {
                    steps.push({ step: 'ai_enhance', status: 'completed', durationMs: Date.now() - aiStepStart });
                }
                catch (error) {
                    steps.push({ step: 'ai_enhance', status: 'failed', durationMs: Date.now() - aiStepStart, error: error.message });
                }
            }
            const renderStepStart = Date.now();
            const compiledTemplate = Handlebars.compile(templateHtml);
            const renderedHtml = compiledTemplate({
                ...jobData.formData,
                title: jobData.title,
                clauses: jobData.clauses?.filter((c) => c.selected) || [],
                generatedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
                documentId: jobData.documentId,
            });
            steps.push({ step: 'html_render', status: 'completed', durationMs: Date.now() - renderStepStart });
            const pdfStepStart = Date.now();
            let pdfBuffer;
            try {
                const puppeteer = require('puppeteer');
                const browser = await puppeteer.launch({
                    headless: true,
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                });
                const page = await browser.newPage();
                await page.setContent(this.wrapHtml(renderedHtml), { waitUntil: 'networkidle0' });
                pdfBuffer = Buffer.from(await page.pdf({
                    format: 'A4',
                    margin: { top: '1cm', bottom: '1cm', left: '1.5cm', right: '1.5cm' },
                    printBackground: true,
                }));
                await browser.close();
            }
            catch (error) {
                this.logger.warn(`Puppeteer not available, creating HTML document: ${error.message}`);
                pdfBuffer = Buffer.from(this.wrapHtml(renderedHtml), 'utf-8');
            }
            steps.push({ step: 'pdf_render', status: 'completed', durationMs: Date.now() - pdfStepStart });
            const uploadStepStart = Date.now();
            const pdfKey = `documents/${jobData.userId}/${jobData.documentId}.pdf`;
            await this.storageService.uploadBuffer(pdfKey, pdfBuffer, 'application/pdf');
            steps.push({ step: 'upload', status: 'completed', durationMs: Date.now() - uploadStepStart });
            await this.prisma.document.update({
                where: { id: jobData.documentId },
                data: {
                    status: 'COMPLETED',
                    pdfUrl: pdfKey,
                    pdfKey,
                    fileSize: pdfBuffer.length,
                },
            });
            const totalDuration = Date.now() - startTime;
            this.logger.log(`Document generated successfully: ${jobData.documentId} (${totalDuration}ms)`);
        }
        catch (error) {
            this.logger.error(`Document generation failed: ${jobData.documentId}`, error);
            await this.prisma.document.update({
                where: { id: jobData.documentId },
                data: { status: 'FAILED' },
            }).catch(() => { });
            const doc = await this.prisma.document.findUnique({
                where: { id: jobData.documentId },
                select: { userId: true, creditsUsed: true },
            });
            if (doc && doc.creditsUsed > 0) {
                const user = await this.prisma.user.findUnique({ where: { id: doc.userId } });
                if (user) {
                    const newBalance = user.creditBalance + doc.creditsUsed;
                    await this.prisma.user.update({
                        where: { id: doc.userId },
                        data: { creditBalance: newBalance },
                    });
                    await this.prisma.creditTransaction.create({
                        data: {
                            userId: doc.userId,
                            amount: doc.creditsUsed,
                            balance: newBalance,
                            type: 'REFUND',
                            referenceId: jobData.documentId,
                            description: 'Refund for failed document generation',
                        },
                    });
                }
            }
            throw error;
        }
    }
    loadTemplate(type) {
        const templatePath = path.join(__dirname, '..', 'templates', `${type}.hbs`);
        try {
            if (fs.existsSync(templatePath)) {
                return fs.readFileSync(templatePath, 'utf-8');
            }
        }
        catch {
        }
        return this.getDefaultTemplate(type);
    }
    getDefaultTemplate(type) {
        return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>{{title}}</title>
  <style>
    body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #0f172a; padding-bottom: 20px; }
    .header h1 { font-size: 18pt; margin: 0; color: #0f172a; text-transform: uppercase; letter-spacing: 2px; }
    .header .subtitle { font-size: 10pt; color: #666; margin-top: 8px; }
    .content { margin-top: 30px; }
    .clause { margin-bottom: 20px; }
    .clause h3 { font-size: 11pt; color: #0f172a; margin-bottom: 8px; }
    .clause p { font-size: 11pt; text-align: justify; }
    .parties { margin: 30px 0; }
    .party { margin-bottom: 15px; }
    .party strong { font-size: 11pt; }
    .footer { margin-top: 50px; border-top: 1px solid #ddd; padding-top: 20px; font-size: 9pt; color: #666; text-align: center; }
    .signature-block { margin-top: 60px; display: flex; justify-content: space-between; }
    .signature { width: 45%; }
    .signature .line { border-top: 1px solid #333; margin-top: 60px; padding-top: 5px; font-size: 10pt; }
    .badge { display: inline-block; background: #14b8a6; color: white; padding: 2px 8px; border-radius: 3px; font-size: 8pt; margin-bottom: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">CONSULTLEGAL</span>
      <h1>{{title}}</h1>
      <div class="subtitle">Generated on {{generatedAt}} | Document ID: {{documentId}}</div>
    </div>

    <div class="content">
      <div class="parties">
        <p><strong>This Agreement</strong> is entered into on {{generatedAt}}</p>
        {{#if partyA}}
        <div class="party">
          <strong>First Party:</strong> {{partyA}}
        </div>
        {{/if}}
        {{#if partyB}}
        <div class="party">
          <strong>Second Party:</strong> {{partyB}}
        </div>
        {{/if}}
        {{#if jurisdiction}}
        <p><strong>Jurisdiction:</strong> {{jurisdiction}}</p>
        {{/if}}
        {{#if duration}}
        <p><strong>Duration:</strong> {{duration}} months</p>
        {{/if}}
      </div>

      {{#if purpose}}
      <div class="clause">
        <h3>1. Purpose</h3>
        <p>{{purpose}}</p>
      </div>
      {{/if}}

      {{#if clauses.length}}
      <div class="clause">
        <h3>Selected Clauses</h3>
        {{#each clauses}}
        <div style="margin-bottom: 12px;">
          <strong>{{this.name}}</strong>
          <p>{{this.text}}</p>
        </div>
        {{/each}}
      </div>
      {{/if}}

      {{#if additionalClauses}}
      <div class="clause">
        <h3>Additional Terms</h3>
        <p>{{additionalClauses}}</p>
      </div>
      {{/if}}

      <div class="clause">
        <h3>General Provisions</h3>
        <p>This Agreement shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the courts in {{jurisdiction}}.</p>
        <p>This Agreement constitutes the entire agreement between the parties and supersedes all prior discussions, negotiations, and agreements.</p>
        <p>No modification of this Agreement shall be valid unless in writing and signed by both parties.</p>
      </div>

      <div class="signature-block">
        <div class="signature">
          <div class="line">First Party</div>
        </div>
        <div class="signature">
          <div class="line">Second Party</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>This document was generated by ConsultLegal — AI-Powered Legal Document Platform.</p>
      <p>This document is for reference purposes only and does not constitute legal advice. Consult a qualified lawyer for specific legal matters.</p>
    </div>
  </div>
</body>
</html>`;
    }
    wrapHtml(content) {
        if (content.startsWith('<!DOCTYPE') || content.startsWith('<html')) {
            return content;
        }
        return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${content}</body></html>`;
    }
};
exports.DocumentProcessor = DocumentProcessor;
exports.DocumentProcessor = DocumentProcessor = DocumentProcessor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService,
        config_1.ConfigService])
], DocumentProcessor);
//# sourceMappingURL=document.processor.js.map