// https://github.com/bluesky-social/social-app/blob/main/src/state/events.ts

import EventEmitter from 'eventemitter3'

type UnlistenFn = () => void

const emitter = new EventEmitter()

// a "soft reset" typically means scrolling to top and loading latest
// but it can depend on the screen
export const emitSoftReset = () => {
  emitter.emit('soft-reset')
}

export const listenSoftReset = (fn: () => void): UnlistenFn => {
  emitter.on('soft-reset', fn)
  return () => emitter.off('soft-reset', fn)
}
