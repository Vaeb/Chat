"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    Mutation: {
        createRole: (parent, args, { models }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const role = yield models.Role.create(args);
                return role.dataValues.id;
            }
            catch (err) {
                console.log(err);
                return -1;
            }
        }),
    },
};
//# sourceMappingURL=role.js.map