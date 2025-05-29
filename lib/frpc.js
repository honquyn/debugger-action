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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.frp = void 0;
const util = __importStar(require("util"));
const exec = __importStar(require("@actions/exec"));
const fs_1 = require("fs");
const toolCache = __importStar(require("@actions/tool-cache"));
const util_1 = require("util");
const ini_1 = __importDefault(require("ini"));
const utils_1 = require("./utils");
const writeFileAsync = util_1.promisify(fs_1.writeFile);
const name = 'frpc';
const defaultVersion = '0.34.3';
const fileSufix = utils_1.getArchivedExtension();
const downloadUrlScheme = 'https://github.com/fatedier/frp/releases/download/v%s/%s%s';
function getFullName(version) {
    return util.format('frp_%s_%s_amd64', version, utils_1.getOsType());
}
function getExecPath(version) {
    return __awaiter(this, void 0, void 0, function* () {
        const downloadUrl = util.format(downloadUrlScheme, version, getFullName(version), fileSufix);
        const localPath = yield utils_1.downloadCache(downloadUrl, name, version, getFullName(version) + fileSufix);
        const execPath = yield toolCache.extractTar(localPath);
        return execPath;
    });
}
function writeInit(path, frp_server_addr, frp_server_port, frp_token, ssh_port) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = Object();
        config['common'] = {
            server_addr: frp_server_addr,
            server_port: frp_server_port,
            token: frp_token
        };
        const ssh_port_special = util.format('ssh-%s', ssh_port);
        config[ssh_port_special] = {
            type: 'tcp',
            local_ip: '127.0.0.1',
            local_port: 8000,
            remote_port: ssh_port
        };
        yield writeFileAsync(path, ini_1.default.stringify(config));
        return path;
    });
}
function frp(frp_server_addr, frp_server_port, frp_token, ssh_port) {
    return __awaiter(this, void 0, void 0, function* () {
        const version = defaultVersion;
        const execPath = yield getExecPath(version);
        const initFile = util.format('%s/%s/my.ini', execPath, getFullName(version));
        yield writeInit(initFile, frp_server_addr, frp_server_port, frp_token, ssh_port);
        const cmdList = [
            util.format('%s/%s/%s -c %s', execPath, getFullName(version), name, initFile)
        ];
        return new Promise(resolve => {
            ;
            (function () {
                return __awaiter(this, void 0, void 0, function* () {
                    for (const item of cmdList) {
                        yield exec.exec(item);
                    }
                });
            })();
            setTimeout(() => resolve('exec done!'), 1000);
        });
    });
}
exports.frp = frp;
