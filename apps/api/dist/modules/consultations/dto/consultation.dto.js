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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewConsultationDto = exports.BookConsultationDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class BookConsultationDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { lawyerId: { required: true, type: () => String }, scheduledAt: { required: true, type: () => String }, type: { required: false, type: () => String }, topic: { required: true, type: () => String, maxLength: 500 }, description: { required: false, type: () => String, maxLength: 2000 }, duration: { required: false, type: () => Number } };
    }
}
exports.BookConsultationDto = BookConsultationDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookConsultationDto.prototype, "lawyerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-04-15T10:00:00Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], BookConsultationDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'video' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookConsultationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], BookConsultationDto.prototype, "topic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], BookConsultationDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 30 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BookConsultationDto.prototype, "duration", void 0);
class ReviewConsultationDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { rating: { required: true, type: () => Number, minimum: 1, maximum: 5 }, review: { required: false, type: () => String, maxLength: 1000 } };
    }
}
exports.ReviewConsultationDto = ReviewConsultationDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], ReviewConsultationDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], ReviewConsultationDto.prototype, "review", void 0);
//# sourceMappingURL=consultation.dto.js.map