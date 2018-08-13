const {State, Pair, constant} = require('crocks')
const {get,put, modify} = State
const log = console.log
const {bgMagenta: bgM, bgGreen: bgG} = require('chalk')

let initState = new Array (2).fill()

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

//    addState :: int -> State int int
const addState = x => modify(add(x))


// Note: Standard "State" construction:
log(
	'\nThe standard "State" construction method:\nNote that all State instances wrap a function in the form or "s -> Pair a s"\n\n\t',
	bgM(`State(s => Pair(toUpper(s), s)).runWith('Abigail')`),
	'\n\t',
	bgG(`Result: ${State(s => Pair(toUpper(s), s)).runWith('Abigail')}`)
)

log(
  `\nState is lazy, so no matter how you create the monad, nothing will run until you call "runWith", "execWith" or "evalWith" on it:\n\n\t`,
  bgM(`State(s => Pair((), s))`),
  '\n\t',
  bgG(`Result: ${State(s => Pair(_ => _, s))}`)
)

// Note: Construction helper "get". Used to access the STATE 
// portion of a given State instance.
log(
	'\nUse helper "get" to construct instead:\nGet will place the state into the resultant if no function is supplied.\n\n\t',
	bgM(`get().runWith('Hello!')`),
	'\n\t',
	bgG(`Result: ${get().runWith('Hello!')}`)
)

log(
	'\nIf a functions is supplied, "get" will run that function on the state, then deposit the result into the resultant:\n\n\t',
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
	'\nUse "get" & then put the effect into resultant.\nNote the use of "constant" - it allows a value to masquerade as a function for use in mapping like this.\nPut will CHANGE the state WITHOUT knowing its previous value:\n\n\t',
	bgM(`putResultant = x => put(x).map(constant(x))`),
	'\n\t',
	bgM(`get(toUpper).chain(putResultant).runWith('Gregory')`),
	'\n\t',
	bgG(`Result: ${get(toUpper).chain(putResultant).runWith('Gregory')}`)
)

log(
	'\nUse "modify" to modify the state. Use modify if you need to use the previous value of the state. Note: It HAS to be the same type!\n\n\t',
	bgM(`add = x => y => x + y`),
	'\n\t',
	bgM(`addState = x => modifiy(add(x)`),
	'\n\t',
	bgM(`addState(5).execWith(45)`),
  '\n\t',
  bgG(`Result: ${addState(5).execWith(45)}`),
	'\n\t',
  bgM(`addState(5).runWith(45)`),
  '\n\t',
  bgG(`Result: ${addState(5).runWith(45)}`),
)

log(
  `\n"of" is used to lift a value into the minimum State context. It will take the value and return back a new state instance with the value in the RESULTANT.\n\n\t`,
  '\n\t',
  bgM(`State.of('thirsty).runWith('anything')`),
  '\n\t',
  bgG(`Result: ${State.of('thirsty').runWith('anything')}`)
)

