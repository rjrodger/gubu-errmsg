type ErrDef = {
    text: string;
};
type MsgMapVal = {
    [val: string]: MsgMap;
};
type MsgMap = {
    [prop: string]: MsgMapVal | ErrDef;
};
declare function GubuErrMsg(msgmap: MsgMap): {
    _router: any;
    find(pat: any): undefined | ErrDef;
    print(): any;
};
export { GubuErrMsg };
