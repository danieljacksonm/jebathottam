import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuditService } from '../audit/audit.service';
import { AddStaffDto, UpdateStaffRoleDto } from './dto';
import { TeamService } from './team.service';

type AuthUser = {
  userId: string;
  email: string;
  shopId: string;
  name?: string;
  role?: string;
};

@Controller()
@UseGuards(JwtAuthGuard)
export class TeamController {
  constructor(
    private team: TeamService,
    private audit: AuditService,
  ) {}

  @Get('team')
  list(@Req() req: { user: AuthUser }) {
    return this.team.list(req.user.shopId);
  }

  @Post('team')
  add(@Req() req: { user: AuthUser }, @Body() dto: AddStaffDto) {
    return this.team.add(
      req.user.shopId,
      req.user.userId,
      req.user.name || req.user.email,
      dto,
    );
  }

  @Patch('team/:id')
  updateRole(
    @Req() req: { user: AuthUser },
    @Param('id') id: string,
    @Body() dto: UpdateStaffRoleDto,
  ) {
    return this.team.updateRole(
      req.user.shopId,
      req.user.userId,
      req.user.name || req.user.email,
      id,
      dto,
    );
  }

  @Delete('team/:id')
  remove(@Req() req: { user: AuthUser }, @Param('id') id: string) {
    return this.team.remove(
      req.user.shopId,
      req.user.userId,
      req.user.name || req.user.email,
      id,
    );
  }

  @Get('activity')
  activity(@Req() req: { user: AuthUser }) {
    return this.audit.list(req.user.shopId);
  }
}
