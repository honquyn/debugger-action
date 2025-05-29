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
exports.execCmdList = exports.downloadCache = exports.getOsType = exports.getArchivedExtension = exports.getBashExtension = exports.getExecutableExtension = void 0;
const os = __importStar(require("os"));
const toolCache = __importStar(require("@actions/tool-cache"));
const exec = __importStar(require("@actions/exec"));
function getExecutableExtension() {
    if (os.type().match(/^Win/)) {
        return '.exe';
    }
    return '';
}
exports.getExecutableExtension = getExecutableExtension;
function getBashExtension() {
    if (os.type().match(/^Win/)) {
        return '.bat';
    }
    return '.sh';
}
exports.getBashExtension = getBashExtension;
function getArchivedExtension() {
    if (os.type().match(/^Win/)) {
        return '.zip';
    }
    return '.tar.gz';
}
exports.getArchivedExtension = getArchivedExtension;
function getOsType() {
    if (os.type().match(/^Win/)) {
        // Windows_NT
        return 'windows';
    }
    return os.type().toLocaleLowerCase();
}
exports.getOsType = getOsType;
function downloadCache(downloadUrl, name, version, fullName) {
    return __awaiter(this, void 0, void 0, function* () {
        let cachePath = toolCache.find(name, version);
        if (!cachePath) {
            try {
                cachePath = yield toolCache.downloadTool(downloadUrl);
            }
            catch (exception) {
                throw new Error('DownloadFailed');
            }
            yield toolCache.cacheFile(cachePath, fullName, name, version);
        }
        return cachePath;
    });
}
exports.downloadCache = downloadCache;
function execCmdList(cmdList) {
    return __awaiter(this, void 0, void 0, function* () {
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
exports.execCmdList = execCmdList;
