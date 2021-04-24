export default interface IStore<T> {
    init:(data:T) => void
    getData:() => T
}
