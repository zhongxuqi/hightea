import Events from 'events'
let eventEmitter = new Events.EventEmitter()

function On(eventName, func) {
    eventEmitter.on(eventName, func)
}

function Emit(eventName) {
    eventEmitter.emit(eventName)
}

function RemoveListener(eventName, listener) {
    eventEmitter.removeListener(eventName, listener)
}

export default {
    On: On,
    Emit: Emit,
    RemoveListener: RemoveListener,
}