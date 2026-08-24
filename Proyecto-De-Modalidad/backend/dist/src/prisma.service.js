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
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const adapter_better_sqlite3_1 = require("@prisma/adapter-better-sqlite3");
const node_path_1 = require("node:path");
const node_fs_1 = require("node:fs");
function resolveDbUrl() {
    const raw = process.env.DATABASE_URL ?? 'file:./prisma/educaplay.db';
    const stripped = raw.startsWith('file:') ? raw.slice('file:'.length) : raw;
    const candidates = [];
    if (stripped.startsWith('/') || /^[a-zA-Z]:[\\/]/.test(stripped)) {
        candidates.push(stripped);
    }
    candidates.push((0, node_path_1.resolve)(process.cwd(), stripped));
    candidates.push((0, node_path_1.resolve)(__dirname, '../../prisma/educaplay.db'));
    candidates.push((0, node_path_1.resolve)(__dirname, '../prisma/educaplay.db'));
    for (const c of candidates) {
        if ((0, node_fs_1.existsSync)(c))
            return c;
    }
    for (const c of candidates) {
        if ((0, node_fs_1.existsSync)((0, node_path_1.dirname)(c)))
            return c;
    }
    return candidates[0] || (0, node_path_1.resolve)(process.cwd(), 'prisma/educaplay.db');
}
let PrismaService = class PrismaService extends client_1.PrismaClient {
    constructor() {
        const adapter = new adapter_better_sqlite3_1.PrismaBetterSqlite3({ url: resolveDbUrl() });
        super({ adapter });
    }
    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map