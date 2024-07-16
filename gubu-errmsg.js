"use strict";
/* Copyright (c) 2024 Richard Rodger and other contributors, MIT License */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GubuErrMsg = GubuErrMsg;
const patrun_1 = require("patrun");
const ALLOWED_PROPS = {
    key: 1,
    type: 1,
    value: 1,
    path: 1,
    why: 1,
    check: 1,
};
function GubuErrMsg(msgmap) {
    const self = {
        _router: (0, patrun_1.Patrun)(),
        find(pat) {
            let errdef = self._router.find(pat);
            if (errdef) {
                errdef = { ...errdef };
                errdef.text.replace(/($[\w\d]+)/g, (match) => {
                    let out = pat[match];
                    return null == out ? match : out;
                });
            }
            errdef = errdef || pat;
            return errdef;
        },
        print() {
            return self._router.toString((errdef) => JSON.stringify(errdef, undefined, undefined));
        }
    };
    _walkprop(msgmap, [], self._router);
    function _walkprop(msgmap, path, router) {
        const errdef = msgmap.$;
        if (errdef) {
            if (null == errdef.text) {
                throw new Error('GubuErrMsg: ' +
                    path.reduce((a, n) => (a.push(n[0] + ':' + n[1]), a), []).join(',') +
                    ' - invalid error definition: property `text` is required.');
            }
            const pat = path.reduce((a, pv) => (a[pv[0]] = pv[1], a), {});
            router.add(pat, errdef);
        }
        const props = Object.keys(msgmap).filter(k => '$' !== k);
        for (let p of props) {
            if (ALLOWED_PROPS[p] || p.match(/^[^_]+_[^_]+$/)) {
                _walkval(msgmap[p], path.concat([[p]]), router);
            }
            else {
                throw new Error('GubuErrMsg: ' +
                    path.reduce((a, n) => (a.push(n[0] + ':' + n[1]), a), []).join(',') +
                    ' - invalid property format: "' + p +
                    '" (must match <base>_<name>, or be one of: [' +
                    Object.keys(ALLOWED_PROPS).join(', ') + ']).');
            }
        }
    }
    function _walkval(msgmapval, path, router) {
        const vals = Object.keys(msgmapval);
        for (let v of vals) {
            path[path.length - 1][1] = v;
            _walkprop(msgmapval[v], path, router);
        }
    }
    return self;
}
//# sourceMappingURL=gubu-errmsg.js.map