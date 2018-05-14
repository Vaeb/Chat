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
        createMessage: (parent, args, { models, user }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const role = yield models.Message.create(Object.assign({}, args, { userId: user.id }));
                return role.dataValues.id;
            }
            catch (err) {
                console.log(err);
                return -1;
            }
        }),
    },
};
//# sourceMappingURL=message.js.map