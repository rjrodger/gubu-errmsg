

const {
  Gubu,
} = require('gubu')

const {
  GubuErrMsg,
} = require('../gubu-errmsg')

function D(x) { console.dir(x,{depth:null}) }

function J(x,s) {
  console.log(null == x ? '' : JSON.stringify(x,null,s).replace(/"/g, ''))
}

let tmp = {}


let ge0 = GubuErrMsg({
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
})

console.log(ge0.print())


let g0 = Gubu({x:Number})
let err = []

g0({x:'X'},{err:(err=[])})
console.log(err)
console.log(ge0.find(err[0]))

g0({},{err:(err=[])})
console.log(err)
console.log(ge0.find(err[0]))
