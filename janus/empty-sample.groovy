// global bindings.
def globals = [:]

globals << [hook : [
        onStartUp: { ctx ->
            ctx.logger.info("Starting Gremlin Server.")
        },
        onShutDown: { ctx ->
            ctx.logger.info("Shutting down Gremlin Server.")
        }
] as LifeCycleHook]
