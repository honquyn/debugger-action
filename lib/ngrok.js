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
exports.ngrok = void 0;
const util = __importStar(require("util"));
const exec = __importStar(require("@actions/exec"));
const core = __importStar(require("@actions/core"));
const toolCache = __importStar(require("@actions/tool-cache"));
const utils_1 = require("./utils");
const yaml_1 = __importDefault(require("yaml"));
const fs_1 = require("fs");
const util_1 = require("util");
const writeFileAsync = util_1.promisify(fs_1.writeFile);
const name = 'ngrok';
const defaultVersion = 'bNyj1mQVY4c';
const fileSufix = '.zip';
const downloadUrlScheme = 'https://bin.equinox.io/c/%s/%s%s';
function getFullName() {
    return util.format('ngrok-v3-stable-%s-amd64', utils_1.getOsType());
}
function writeTunnel(path, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = Object();
        config['version'] = 3;
        config['agent']['authtoken'] = token;
        config['tunnels'] = {
            'tcp-8000': {
                addr: '8000',
                proto: 'tcp'
            }
        };
        const addr_1 = core.getInput('ngrok_addr_1');
        const proto_1 = core.getInput('ngrok_proto_1');
        const addr_2 = core.getInput('ngrok_addr_2');
        const proto_2 = core.getInput('ngrok_proto_2');
        const addr_3 = core.getInput('ngrok_addr_3');
        const proto_3 = core.getInput('ngrok_proto_3');
        if (addr_1 !== '' && proto_1 !== '') {
            const key_1 = util.format('%s-%s', proto_1, addr_1);
            config['tunnels'][key_1] = {
                addr: addr_1,
                proto: proto_1
            };
        }
        if (addr_2 !== '' && proto_2 !== '') {
            const key_2 = util.format('%s-%s', proto_2, addr_2);
            config['tunnels'][key_2] = {
                addr: addr_2,
                proto: proto_2
            };
        }
        if (addr_3 !== '' && proto_3 !== '') {
            const key_3 = util.format('%s-%s', proto_3, addr_3);
            config['tunnels'][key_3] = {
                addr: addr_3,
                proto: proto_3
            };
        }
        yield writeFileAsync(path, yaml_1.default.stringify(config));
        return path;
    });
}
function getExecPath(version) {
    return __awaiter(this, void 0, void 0, function* () {
        const downloadUrl = util.format(downloadUrlScheme, version, getFullName(), fileSufix);
        core.info(`download url => ${downloadUrl}`);
        const localPath = yield utils_1.downloadCache(downloadUrl, name, version, getFullName() + fileSufix);
        core.info(`local path => ${localPath}`);
        const execPath = yield toolCache.extractZip(localPath);
        return execPath;
    });
}
function ngrok(NGROK_TOKEN) {
    return __awaiter(this, void 0, void 0, function* () {
        const version = defaultVersion;
        const execPath = yield getExecPath(version);
        const cfgFile = util.format('%s/ngrok.cfg', execPath);
        core.info(`exec path => ${cfgFile}`);
        writeTunnel(cfgFile, NGROK_TOKEN);
        const cmdList = [
            util.format('chmod +x %s/ngrok', execPath),
            util.format('%s/ngrok  start --all --config  %s --log "stdout"', execPath, cfgFile)
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
exports.ngrok = ngrok;
