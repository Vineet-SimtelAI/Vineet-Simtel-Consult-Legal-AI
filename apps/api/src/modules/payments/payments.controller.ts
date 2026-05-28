import { Controller, Get, Post, Body, Query, UseGuards, Request, RawBodyRequest, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { PurchaseCreditsDto, CreatePaymentOrderDto } from './dto/payment.dto';

@ApiTags('Credits & Payments')
@Controller()
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  // ─── Credit Packages ───
  @Get('credits/packs')
  @ApiOperation({ summary: 'List available credit packages' })
  async getCreditPacks() {
    return this.paymentsService.getCreditPackages();
  }

  // ─── Credit Balance ───
  @Get('credits/balance')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current credit balance' })
  async getCreditBalance(@Request() req: any) {
    return this.paymentsService.getCreditBalance(req.user.id);
  }

  // ─── Transaction History ───
  @Get('credits/transactions')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get credit transaction history' })
  async getTransactionHistory(
    @Request() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.paymentsService.getTransactionHistory(req.user.id, page, limit);
  }

  // ─── Purchase Credits by Package ───
  @Post('credits/purchase')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Purchase credits by package name' })
  async purchaseCredits(@Request() req: any, @Body() dto: PurchaseCreditsDto) {
    return this.paymentsService.purchaseCredits(req.user.id, dto.package);
  }

  // ─── Create Payment Order ───
  @Post('payments/create-order')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a Razorpay payment order' })
  async createOrder(@Request() req: any, @Body() dto: CreatePaymentOrderDto) {
    return this.paymentsService.createOrder(req.user.id, dto);
  }

  // ─── Verify Payment ───
  @Post('payments/verify')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify payment and add credits' })
  async verifyPayment(
    @Request() req: any,
    @Body() body: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string },
  ) {
    return this.paymentsService.verifyPayment(
      req.user.id,
      body.razorpayOrderId,
      body.razorpayPaymentId,
      body.razorpaySignature,
    );
  }

  // ─── Razorpay Webhook ───
  @Post('payments/webhook')
  @ApiOperation({ summary: 'Razorpay webhook endpoint' })
  async handleWebhook(@Req() req: RawBodyRequest<Request>, @Body() body: any) {
    const signature = (req.headers as any)['x-razorpay-signature'] as string;
    return this.paymentsService.handleWebhook(body, signature);
  }
}
