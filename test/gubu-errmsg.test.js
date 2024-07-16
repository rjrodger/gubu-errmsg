"use strict";
/* Copyright (c) 2024 Richard Rodger and other contributors, MIT License */
Object.defineProperty(exports, "__esModule", { value: true });
const gubu_1 = require("gubu");
const gubu_errmsg_1 = require("../gubu-errmsg");
// import { GubuErrMsg as GubuErrMsgX } from '../gubu-errmsg'
// // Handle web (Gubu-Errmsg) versus node ({Gubu-Errmsg}) export.
// let GubuErrMsgModule = require('../gubu-errmsg')
// if (GubuErrMsgModule.GubuErrMsg) {
//   GubuErrMsgModule = GubuErrMsgModule.GubuErrMsg
// }
// const GubuErrMsg: GubuErrMsgX = GubuErrMsgModule
describe('gubu-errmsg', () => {
    test('happy', () => {
        let ge0 = (0, gubu_errmsg_1.GubuErrMsg)({
            why: {
                type: {
                    type: {
                        number: {
                            $: { text: 'Must be a number.' }
                        }
                    }
                },
                required: {
                    $: { text: 'Required.' }
                }
            }
        });
        expect(ge0.print()).toEqual(`type=number, why=type -> {"text":"Must be a number."}
why=required -> {"text":"Required."}`);
        let g0 = (0, gubu_1.Gubu)({ x: Number });
        let err = [];
        g0({ x: 11 }, { err: (err = []) });
        expect(err.length).toEqual(0);
        g0({ x: 'X' }, { err: (err = []) });
        expect(err[0]).toMatchObject({
            path: 'x',
            type: 'number',
            value: 'X',
            why: 'type',
        });
        expect(ge0.find(err[0])).toEqual({
            text: 'Must be a number.'
        });
        g0({}, { err: (err = []) });
        expect(err[0]).toMatchObject({
            path: 'x',
            type: 'number',
            value: undefined,
            why: 'required',
        });
        expect(ge0.find(err[0])).toEqual({
            text: 'Required.'
        });
        g0({ y: 1 }, { err: (err = []) });
        expect(err[0]).toMatchObject({
            path: '',
            type: 'object',
            why: 'closed',
        });
        expect(ge0.find(err[0])).toMatchObject({
            text: 'Validation failed for object "{y:1}" because the property "y" is not allowed.'
        });
    });
});
//# sourceMappingURL=gubu-errmsg.test.js.map