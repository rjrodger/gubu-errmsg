/* Copyright (c) 2024 Richard Rodger and other contributors, MIT License */

import type { PatrunRouter } from 'patrun'

import { Patrun } from 'patrun'



type ErrPat = {
  key: string                // Key of failing value.
  type: string               // type of node
  value: any                 // Failing value.
  path: string               // Key path to value.
  why: string                // Error code ("why").
  check: string              // Check function name.
  [prop: `${string}_${string}`]: any // custom prop in format base_name
}


type ErrDef = {
  text: string
}

type MsgMapVal = { [val: string]: MsgMap }
type MsgMap = { [prop: string]: MsgMapVal | ErrDef }



const ALLOWED_PROPS: any = {
  key: 1,
  type: 1,
  value: 1,
  path: 1,
  why: 1,
  check: 1,
}

function GubuErrMsg(msgmap: MsgMap) {
  const self = {
    _router: Patrun(),

    find(pat: any): undefined | ErrDef {
      let errdef = self._router.find(pat)
      if (errdef) {
        errdef = { ...errdef }
        errdef.text.replace(/($[\w\d]+)/g, (match: string) => {
          let out = pat[match]
          return null == out ? match : out
        })
      }
      errdef = errdef || pat
      return errdef
    },


    print() {
      return self._router.toString((errdef: any) => JSON.stringify(errdef, undefined, undefined))
    }
  }

  _walkprop(msgmap, [], self._router)


  function _walkprop(msgmap: MsgMap, path: string[][], router: PatrunRouter) {
    const errdef = msgmap.$
    if (errdef) {
      if (null == errdef.text) {
        throw new Error('GubuErrMsg: ' +
          path.reduce((a, n) => (a.push(n[0] + ':' + n[1]), a), []).join(',') +
          ' - invalid error definition: property `text` is required.')

      }
      const pat = path.reduce((a: any, pv: string[]) => (a[pv[0]] = pv[1], a), {})
      router.add(pat, errdef)
    }

    const props = Object.keys(msgmap).filter(k => '$' !== k)
    for (let p of props) {
      if (ALLOWED_PROPS[p] || p.match(/^[^_]+_[^_]+$/)) {
        _walkval(msgmap[p] as MsgMapVal, path.concat([[p]]), router)
      }
      else {
        throw new Error('GubuErrMsg: ' +
          path.reduce((a, n) => (a.push(n[0] + ':' + n[1]), a), []).join(',') +
          ' - invalid property format: "' + p +
          '" (must match <base>_<name>, or be one of: [' +
          Object.keys(ALLOWED_PROPS).join(', ') + ']).')
      }
    }
  }

  function _walkval(msgmapval: MsgMapVal, path: string[][], router: PatrunRouter) {
    const vals = Object.keys(msgmapval)
    for (let v of vals) {
      path[path.length - 1][1] = v
      _walkprop(msgmapval[v], path, router)
    }
  }

  return self
}



export {
  GubuErrMsg
}
