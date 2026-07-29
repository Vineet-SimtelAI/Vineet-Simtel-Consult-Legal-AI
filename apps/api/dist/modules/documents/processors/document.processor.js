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
const redis_service_1 = require("../../../core/redis/redis.service");
const Handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const groq_sdk_1 = require("groq-sdk");
const STEP_DEFINITIONS = [
    { name: 'template_load', label: 'Loading Template', weight: 10, estimatedMs: 500 },
    { name: 'ai_enhance', label: 'AI Clause Enhancement', weight: 30, estimatedMs: 8000 },
    { name: 'html_render', label: 'Rendering Document', weight: 20, estimatedMs: 1000 },
    { name: 'pdf_render', label: 'Generating PDF', weight: 25, estimatedMs: 5000 },
    { name: 'upload', label: 'Saving to Storage', weight: 15, estimatedMs: 2000 },
];
let DocumentProcessor = DocumentProcessor_1 = class DocumentProcessor {
    constructor(prisma, storageService, configService, redisService) {
        this.prisma = prisma;
        this.storageService = storageService;
        this.configService = configService;
        this.redisService = redisService;
        this.logger = new common_1.Logger(DocumentProcessor_1.name);
    }
    async saveProgress(progress) {
        try {
            await this.redisService.setJson(`doc:progress:${progress.documentId}`, progress, 3600);
        }
        catch {
        }
    }
    buildInitialProgress(jobData) {
        const steps = STEP_DEFINITIONS.map((s) => ({
            name: s.name,
            label: s.label,
            status: 'pending',
        }));
        if (!jobData.aiEnhanced) {
            const aiStep = steps.find((s) => s.name === 'ai_enhance');
            if (aiStep)
                aiStep.status = 'skipped';
        }
        const estimatedTotalMs = STEP_DEFINITIONS
            .filter((s) => jobData.aiEnhanced || s.name !== 'ai_enhance')
            .reduce((sum, s) => sum + s.estimatedMs, 0);
        return {
            documentId: jobData.documentId,
            status: 'GENERATING',
            percentage: 0,
            currentStep: 'template_load',
            currentStepIndex: 0,
            totalSteps: STEP_DEFINITIONS.length,
            message: 'Starting document generation...',
            steps,
            startedAt: new Date().toISOString(),
            estimatedTotalMs,
            elapsedMs: 0,
        };
    }
    getPercentageAtStep(stepName, includeAI) {
        const steps = STEP_DEFINITIONS.filter((s) => includeAI || s.name !== 'ai_enhance');
        const totalWeight = steps.reduce((sum, s) => sum + s.weight, 0);
        let cumulative = 0;
        for (const s of steps) {
            if (s.name === stepName)
                break;
            cumulative += s.weight;
        }
        return Math.round((cumulative / totalWeight) * 100);
    }
    getPercentageAfterStep(stepName, includeAI) {
        const steps = STEP_DEFINITIONS.filter((s) => includeAI || s.name !== 'ai_enhance');
        const totalWeight = steps.reduce((sum, s) => sum + s.weight, 0);
        let cumulative = 0;
        for (const s of steps) {
            cumulative += s.weight;
            if (s.name === stepName)
                break;
        }
        return Math.round((cumulative / totalWeight) * 100);
    }
    async process(jobData) {
        const startTime = Date.now();
        const includeAI = !!jobData.aiEnhanced;
        const progress = this.buildInitialProgress(jobData);
        await this.saveProgress(progress);
        const updateStep = async (stepName, stepStatus, message, extra) => {
            const elapsed = Date.now() - startTime;
            const step = progress.steps.find((s) => s.name === stepName);
            const stepIdx = STEP_DEFINITIONS.findIndex((s) => s.name === stepName);
            if (step) {
                step.status = stepStatus;
                if (extra?.durationMs !== undefined)
                    step.durationMs = extra.durationMs;
                if (extra?.error)
                    step.error = extra.error;
            }
            if (stepStatus === 'running') {
                progress.percentage = this.getPercentageAtStep(stepName, includeAI);
                progress.currentStep = stepName;
                progress.currentStepIndex = stepIdx;
            }
            else if (stepStatus === 'completed') {
                progress.percentage = this.getPercentageAfterStep(stepName, includeAI);
            }
            progress.message = message;
            progress.elapsedMs = elapsed;
            await this.saveProgress(progress);
        };
        try {
            await updateStep('template_load', 'running', 'Loading legal document template...');
            const tStart = Date.now();
            const templateHtml = this.loadTemplate(jobData.type);
            await updateStep('template_load', 'completed', 'Template loaded successfully.', { durationMs: Date.now() - tStart });
            if (jobData.aiEnhanced) {
                await updateStep('ai_enhance', 'running', 'Generating AI-enhanced clauses via Groq...');
                const aiStart = Date.now();
                try {
                    const groqApiKey = this.configService.get('app.groqApiKey');
                    const groqModel = this.configService.get('app.groqModel') || 'llama-3.3-70b-versatile';
                    if (groqApiKey) {
                        const groq = new groq_sdk_1.default({ apiKey: groqApiKey });
                        const prompt = `You are an expert Indian legal document drafter. Enhance and expand the following legal document data to produce professional, legally precise clause text suitable for a formal Indian legal agreement.

Document Type: ${jobData.type}
Title: ${jobData.title}
Form Data: ${JSON.stringify(jobData.formData, null, 2)}

Return a JSON object with an "enhancedClauses" array (each item: { name: string, text: string }) and an optional "enhancedPurpose" string. Only return valid JSON, no markdown.`;
                        const completion = await groq.chat.completions.create({
                            model: groqModel,
                            messages: [{ role: 'user', content: prompt }],
                            temperature: 0.4,
                            max_tokens: 2048,
                        });
                        let raw = completion.choices[0]?.message?.content || '{}';
                        if (raw.includes('```json')) {
                            raw = raw.split('```json')[1].split('```')[0].trim();
                        }
                        else if (raw.includes('```')) {
                            raw = raw.split('```')[1].split('```')[0].trim();
                        }
                        try {
                            const parsed = JSON.parse(raw);
                            if (parsed.enhancedClauses?.length) {
                                jobData.clauses = parsed.enhancedClauses.map((c) => ({ ...c, selected: true }));
                            }
                            if (parsed.enhancedPurpose) {
                                jobData.formData.purpose = parsed.enhancedPurpose;
                            }
                            this.logger.log(`AI enhancement successful for document: ${jobData.documentId}`);
                            await updateStep('ai_enhance', 'completed', 'AI clauses generated successfully.', { durationMs: Date.now() - aiStart });
                        }
                        catch (parseErr) {
                            this.logger.warn(`Failed to parse Groq JSON response: ${parseErr.message}`);
                            await updateStep('ai_enhance', 'completed', 'AI enhancement completed (partial).', { durationMs: Date.now() - aiStart });
                        }
                    }
                    else {
                        this.logger.warn('GROQ_API_KEY not set — skipping AI enhancement');
                        await updateStep('ai_enhance', 'skipped', 'AI enhancement skipped (no API key).', { durationMs: Date.now() - aiStart });
                    }
                }
                catch (error) {
                    this.logger.warn(`AI enhancement failed (non-fatal): ${error.message}`);
                    await updateStep('ai_enhance', 'failed', `AI enhancement failed: ${error.message}`, {
                        durationMs: Date.now() - aiStart,
                        error: error.message,
                    });
                }
            }
            await updateStep('html_render', 'running', 'Rendering document from template...');
            const renderStart = Date.now();
            const compiledTemplate = Handlebars.compile(templateHtml);
            const renderedHtml = compiledTemplate({
                ...jobData.formData,
                title: jobData.title,
                clauses: jobData.clauses?.filter((c) => c.selected) || [],
                generatedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
                documentId: jobData.documentId,
            });
            await updateStep('html_render', 'completed', 'Document rendered successfully.', { durationMs: Date.now() - renderStart });
            await updateStep('pdf_render', 'running', 'Generating PDF with Puppeteer...');
            const pdfStart = Date.now();
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
                await updateStep('pdf_render', 'completed', 'PDF generated successfully.', { durationMs: Date.now() - pdfStart });
            }
            catch (error) {
                this.logger.warn(`Puppeteer unavailable, falling back to HTML: ${error.message}`);
                pdfBuffer = Buffer.from(this.wrapHtml(renderedHtml), 'utf-8');
                await updateStep('pdf_render', 'completed', 'Document created as HTML (PDF renderer unavailable).', { durationMs: Date.now() - pdfStart });
            }
            await updateStep('upload', 'running', 'Uploading document to secure storage...');
            const uploadStart = Date.now();
            const pdfKey = `documents/${jobData.userId}/${jobData.documentId}.pdf`;
            let uploadedKey = pdfKey;
            try {
                await this.storageService.uploadBuffer(pdfKey, pdfBuffer, 'application/pdf');
                await updateStep('upload', 'completed', 'Document saved to cloud storage.', { durationMs: Date.now() - uploadStart });
            }
            catch (uploadError) {
                this.logger.warn(`MinIO upload failed (using local fallback): ${uploadError.message}`);
                const localDir = path.join(process.cwd(), 'upload', 'documents', jobData.userId);
                fs.mkdirSync(localDir, { recursive: true });
                const localPath = path.join(localDir, `${jobData.documentId}.pdf`);
                fs.writeFileSync(localPath, pdfBuffer);
                uploadedKey = `local:${localPath}`;
                await updateStep('upload', 'completed', 'Document saved locally (cloud storage unavailable).', { durationMs: Date.now() - uploadStart });
            }
            await this.prisma.document.update({
                where: { id: jobData.documentId },
                data: {
                    status: 'COMPLETED',
                    pdfUrl: uploadedKey,
                    pdfKey: uploadedKey,
                    fileSize: pdfBuffer.length,
                    clauses: jobData.clauses || undefined,
                    formData: jobData.formData,
                },
            });
            progress.status = 'COMPLETED';
            progress.percentage = 100;
            progress.message = 'Document generated successfully!';
            progress.elapsedMs = Date.now() - startTime;
            await this.saveProgress(progress);
            const totalDuration = Date.now() - startTime;
            this.logger.log(`✅ Document generated: ${jobData.documentId} (${totalDuration}ms)`);
        }
        catch (error) {
            this.logger.error(`❌ Document generation failed: ${jobData.documentId}`, error);
            progress.status = 'FAILED';
            progress.message = `Generation failed: ${error.message}`;
            progress.elapsedMs = Date.now() - startTime;
            progress.steps.forEach((s) => {
                if (s.status === 'running')
                    s.status = 'failed';
            });
            await this.saveProgress(progress);
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
                    await this.prisma.user.update({ where: { id: doc.userId }, data: { creditBalance: newBalance } });
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
    getDefaultTemplate(_type) {
        return `<!DOCTYPE html>
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
        {{#if partyA}}<div class="party"><strong>First Party:</strong> {{partyA}}</div>{{/if}}
        {{#if partyB}}<div class="party"><strong>Second Party:</strong> {{partyB}}</div>{{/if}}
        {{#if jurisdiction}}<p><strong>Jurisdiction:</strong> {{jurisdiction}}</p>{{/if}}
        {{#if duration}}<p><strong>Duration:</strong> {{duration}} months</p>{{/if}}
      </div>
      {{#if purpose}}
      <div class="clause"><h3>1. Purpose</h3><p>{{purpose}}</p></div>
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
      <div class="clause"><h3>Additional Terms</h3><p>{{additionalClauses}}</p></div>
      {{/if}}
      <div class="clause">
        <h3>General Provisions</h3>
        <p>This Agreement shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in {{jurisdiction}}.</p>
        <p>This Agreement constitutes the entire agreement between the parties and supersedes all prior discussions, negotiations, and agreements.</p>
        <p>No modification of this Agreement shall be valid unless in writing and signed by both parties.</p>
      </div>
      <div class="signature-block">
        <div class="signature"><div class="line">First Party</div></div>
        <div class="signature"><div class="line">Second Party</div></div>
      </div>
    </div>
    <div class="footer">
      <p>This document was generated by ConsultLegal — AI-Powered Legal Document Platform.</p>
      <p>This document is for reference purposes only and does not constitute legal advice.</p>
    </div>
  </div>
</body>
</html>`;
    }
    wrapHtml(content) {
        if (content.startsWith('<!DOCTYPE') || content.startsWith('<html'))
            return content;
        return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${content}</body></html>`;
    }
};
exports.DocumentProcessor = DocumentProcessor;
exports.DocumentProcessor = DocumentProcessor = DocumentProcessor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService,
        config_1.ConfigService,
        redis_service_1.RedisService])
], DocumentProcessor);
//# sourceMappingURL=document.processor.js.map