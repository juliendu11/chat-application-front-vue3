import io from 'socket.io-client'

const createClient = () => {
  console.log(process.env.VUE_APP_CHAT_SERVER)
  return io(process.env.VUE_APP_CHAT_SERVER)
//   return SocketIO(process.env.VUE_APP_CHAT_SERVER, {
//     autoConnect: false,
//     reconnectionDelay: 5000,
//     transportOptions: {
//       polling: {
//         extraHeaders: {
//           Authorization: 'Bearer ' + 'aa'
//         }
//       }
//     }
//   })
}

export {
  createClient
}
