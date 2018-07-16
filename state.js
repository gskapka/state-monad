const {State, Pair, constant, propOr, assoc} = require('crocks')
const {get,put,modify} = State
const log = console.log
const {bgMagenta: bgM, bgGreen: bgG} = require('chalk')

//    liftA2 = (a -> b -> c) -> Ap a -> Ap b -> Ap c
const liftA2 = (fn, ap1, ap2) => ap1.map(fn).ap(ap2)

let initState = new Array (2).fill()

//    data :: {}
const data = {tax: 0.084, sub: 4.97}

//    toUpper :: string -> string
const toUpper = x => x.toUpperCase()

// Note: "constant" - helper func to let a value masquerade as a func
// Note: "put" - modifies the STATE portion of the Pair. Cannot know about
// the previous value of the state. Use modify if you need that!
//    putResultant :: string -> State string string
const putResultant = x => put(x).map(constant(x))


//    updatePop :: string -> State string string
const updatePop = x => 
  get().chain(old => put(x).chain(_ => State.of(old)))

//    add :: int -> int -> int
const add = x => y => x + y

//    addToState :: int -> State int int
const addToState = x => modify(add(x))

//    multuply :: int -> int -> int
const multiply = x => y => x * y

//    round = int -> int
const round = x => Math.round(x*100)/100

// Note: propOr gets a prop else reverts to a supplied default.
//    getKey :: string -> State object number
const getKey = key => get(propOr(0, key))

//    addToSub :: int -> State object int
const addToSub = x => getKey('sub').map(add(x))

// Note: And here with have the applicative at last. Used to apply
// the State returned from two different calls to 'getKey' to the 
// multiply function. Below it is the point free version using liftA2.
//    calcTax :: {} -> State {} int
const calcTax = getKey('tax').map(multiply).ap(getKey('sub'))
//const calcTaxLift = liftA2(multiply, getKey('tax'), getKey('sub'))

//    updateKey :: string -> a -> State {} ()
const updateKey = key => value => modify(assoc(key, val))

//    applyTax :: {} -> State {} int
const applyTax = 
	calcTax.chain(addToSub).map(round).chain(updateKey('total'))

log(
`\nThe standard "State" construction method. Note that all State instances 
wrap a function in the form of "s -> Pair a s"\n\n\t`,
bgM(`State(s => Pair(toUpper(s), s)).runWith('Abigail')`),
'\n\t',
bgG(`Result: ${State(s => Pair(toUpper(s), s)).runWith('Abigail')}`)
)

log(
`\nState is lazy, so no matter how you create the monad, nothing will 
run until you call "runWith", "execWith" or "evalWith" on it:\n\n\t`,
bgM(`State(s => Pair((), s))`),
'\n\t',
bgG(`Result: ${State(s => Pair(_ => _, s))}`)
)

log(
`\nUse helper "get" to construct instead:\nGet will place the state 
into the resultant if no function is supplied.\n\n\t`,
bgM(`get().runWith('Hello!')`),
'\n\t',
bgG(`Result: ${get().runWith('Hello!')}`)
)

log(
`\nIf a functions is supplied, "get" will run that function on the 
state, then deposit the result into the resultant. Note that calling 
"runWith" will return the whole PAIR:`,
'\n\n\t',
bgM(`get(toUpper).runWith('Abigail!')`),
'\n\t',
bgG(`Result: ${get(toUpper).runWith('Abigail!')}`)
)

log(
'\nUse "evalWith" to get RESULTANT only:\n\n\t', 
bgM(`get(toUpper).evalWith('Resultant only!')`),
'\n\t',
bgG(`Result: ${get(toUpper).evalWith('Resultant only!')}`)
)

log(
'\nUse "exectWith" to get STATE only:\n\n\t',
bgM(`get(toUpper).execWith('State only!')`),
'\n\t',
bgG(`Result: ${get(toUpper).execWith('State only!')}`)
)

log(
`\nUse "get" & then put the effect into resultant. Note the use of 
"constant" - it allows a value to masquerade as a function for use 
in mapping like this.Put will CHANGE the state WITHOUT knowing its 
previous value:\n\n\t`,
bgM(`putResultant = x => put(x).map(constant(x))`),
'\n\t',
bgM(`get(toUpper).chain(putResultant).runWith('Gregory')`),
'\n\t',
bgG(`Result: ${get(toUpper).chain(putResultant).runWith('Gregory')}`)
)

log(
`\nUse "modify" to modify the state. Use modify if you need to 
use the previous value of the state. It is sort of like the "map" 
instance method common of all monads, EXCEPT that in this case it 
requires an endofunction that matches the type of the state itself.\n\n\t`,
bgM(`add = x => y => x + y`),
'\n\t',
bgM(`addToState = x => modify(add(x)`),
'\n\t',
bgM(`addToState(5).execWith(45)`),
'\n\t',
  bgG(`Result: ${addToState(5).execWith(45)}`),
'\n\t',
bgM(`addState(5).runWith(45)`),
'\n\t',
bgG(`Result: ${addToState(5).runWith(45)}`),
)

log(
`\n"of" is used to lift a value into the minimum State context.
It will take the value and return back a new state instance with
the value in the RESULTANT.\n\n\t`,
'\n\t',
bgM(`State.of('thirsty).runWith('anything')`),
'\n\t',
bgG(`Result: ${State.of('thirsty').runWith('anything')}`)
)

log(
`\n"ap", short for applicative, is used in this monad to apply the 
RESULTANT of a given state instance, to a function wrapped in another 
state instance. Can also be used to apply multiple state instances 
as arguments to a polyadic function (which latter can be done point 
free via liftA2 etc), which .ap's will be computed in parallel.\n\n\t`,
)

