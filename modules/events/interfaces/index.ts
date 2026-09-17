interface EventHandler {
    execute(): Promise<void>
} 

export {
    EventHandler
}