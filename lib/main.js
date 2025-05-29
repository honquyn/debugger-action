"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const frpc_1 = require("./frpc");
const ngrok_1 = require("./ngrok");
const sshd_1 = require("./sshd");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const frp_server_addr = core.getInput('frp_server_addr');
            const frp_server_port = core.getInput('frp_server_port');
            const frp_token = core.getInput('frp_token');
            const ssh_port = core.getInput('ssh_port');
            const ngrok_token = core.getInput('ngrok_token');
            yield sshd_1.sshd();
            if (frp_token !== '') {
                yield frpc_1.frp(frp_server_addr, frp_server_port, frp_token, ssh_port);
            }
            if (ngrok_token !== '') {
                yield ngrok_1.ngrok(ngrok_token);
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
