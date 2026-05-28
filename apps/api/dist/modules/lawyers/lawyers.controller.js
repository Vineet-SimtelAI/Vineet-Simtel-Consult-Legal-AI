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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LawyersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const lawyers_service_1 = require("./lawyers.service");
const lawyer_dto_1 = require("./dto/lawyer.dto");
let LawyersController = class LawyersController {
    constructor(lawyersService) {
        this.lawyersService = lawyersService;
    }
    async searchLawyers(filters) {
        return this.lawyersService.searchLawyers(filters);
    }
    async getLawyerProfile(id) {
        return this.lawyersService.getLawyerProfile(id);
    }
    async getAvailableSlots(id, date) {
        return this.lawyersService.getAvailableSlots(id, date);
    }
    async applyAsLawyer(req, dto) {
        return this.lawyersService.applyAsLawyer(req.user.id, dto);
    }
};
exports.LawyersController = LawyersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Search and filter lawyers' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lawyer_dto_1.SearchLawyersDto]),
    __metadata("design:returntype", Promise)
], LawyersController.prototype, "searchLawyers", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get lawyer profile details' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LawyersController.prototype, "getLawyerProfile", null);
__decorate([
    openapi.ApiQuery({ name: "date", required: false }),
    (0, common_1.Get)(':id/slots'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available time slots for a lawyer' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LawyersController.prototype, "getAvailableSlots", null);
__decorate([
    (0, common_1.Post)('apply'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Apply to become a lawyer' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, lawyer_dto_1.ApplyAsLawyerDto]),
    __metadata("design:returntype", Promise)
], LawyersController.prototype, "applyAsLawyer", null);
exports.LawyersController = LawyersController = __decorate([
    (0, swagger_1.ApiTags)('Lawyers'),
    (0, common_1.Controller)('lawyers'),
    __metadata("design:paramtypes", [lawyers_service_1.LawyersService])
], LawyersController);
//# sourceMappingURL=lawyers.controller.js.map