"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthCanceledOrdersAmount = void 0;
var elysia_1 = require("elysia");
var authentication_1 = require("../authentication");
var drizzle_orm_1 = require("drizzle-orm");
var dayjs_1 = require("dayjs");
var connection_1 = require("@/db/connection");
var schema_1 = require("@/db/schema");
exports.getMonthCanceledOrdersAmount = new elysia_1.default()
    .use(authentication_1.authentication)
    .get('/metrics/month-canceled-orders-amount', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var restaurantId, today, lastMonth, startOfLastMonth, lastMonthWithYear, currentMonthWithYear, ordersPerMonth, currentMonthOrdersAmount, lastMonthOrdersAmount, diffFromLastMonth;
    var _c;
    var getManagedRestaurantId = _b.getManagedRestaurantId;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, getManagedRestaurantId()];
            case 1:
                restaurantId = _d.sent();
                today = (0, dayjs_1.default)();
                lastMonth = today.subtract(1, 'month');
                startOfLastMonth = lastMonth.startOf('month');
                lastMonthWithYear = lastMonth.format('YYYY-MM');
                currentMonthWithYear = today.format('YYYY-MM');
                return [4 /*yield*/, connection_1.db
                        .select({
                        monthWithYear: (0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["TO_CHAR(", ", 'YYYY-MM')"], ["TO_CHAR(", ", 'YYYY-MM')"])), schema_1.orders.createdAt),
                        amount: (0, drizzle_orm_1.count)(schema_1.orders.id),
                    })
                        .from(schema_1.orders)
                        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.orders.restaurantId, restaurantId), (0, drizzle_orm_1.eq)(schema_1.orders.status, 'canceled'), (0, drizzle_orm_1.gte)(schema_1.orders.createdAt, startOfLastMonth.toDate())))
                        .groupBy((0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["TO_CHAR(", ", 'YYYY-MM')"], ["TO_CHAR(", ", 'YYYY-MM')"])), schema_1.orders.createdAt))
                        .having(function (_a) {
                        var amount = _a.amount;
                        return (0, drizzle_orm_1.gte)(amount, 1);
                    })];
            case 2:
                ordersPerMonth = _d.sent();
                currentMonthOrdersAmount = ordersPerMonth.find(function (ordersInMonth) {
                    return ordersInMonth.monthWithYear === currentMonthWithYear;
                });
                lastMonthOrdersAmount = ordersPerMonth.find(function (ordersInMonth) {
                    return ordersInMonth.monthWithYear === lastMonthWithYear;
                });
                diffFromLastMonth = lastMonthOrdersAmount && currentMonthOrdersAmount
                    ? (currentMonthOrdersAmount.amount * 100) /
                        lastMonthOrdersAmount.amount
                    : null;
                return [2 /*return*/, {
                        amount: (_c = currentMonthOrdersAmount === null || currentMonthOrdersAmount === void 0 ? void 0 : currentMonthOrdersAmount.amount) !== null && _c !== void 0 ? _c : 0,
                        diffFromLastMonth: diffFromLastMonth
                            ? Number((diffFromLastMonth - 100).toFixed(2))
                            : 0,
                    }];
        }
    });
}); });
var templateObject_1, templateObject_2;
