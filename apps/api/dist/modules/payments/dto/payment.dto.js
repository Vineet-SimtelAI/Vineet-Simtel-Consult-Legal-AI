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
exports.CreatePaymentOrderDto = exports.PurchaseCreditsDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class PurchaseCreditsDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { package: { required: true, type: () => String } };
    }
}
exports.PurchaseCreditsDto = PurchaseCreditsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'standard' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PurchaseCreditsDto.prototype, "package", void 0);
class CreatePaymentOrderDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { amount: { required: true, type: () => Number, minimum: 100 }, purpose: { required: true, type: () => String }, purposeId: { required: false, type: () => String }, creditsToAdd: { required: false, type: () => Number }, packageName: { required: false, type: () => String } };
    }
}
exports.CreatePaymentOrderDto = CreatePaymentOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 79900, description: 'Amount in paisa' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100),
    __metadata("design:type", Number)
], CreatePaymentOrderDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'credits' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentOrderDto.prototype, "purpose", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentOrderDto.prototype, "purposeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePaymentOrderDto.prototype, "creditsToAdd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentOrderDto.prototype, "packageName", void 0);
//# sourceMappingURL=payment.dto.js.map