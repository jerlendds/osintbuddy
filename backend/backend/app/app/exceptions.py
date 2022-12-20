class WorkerException(Exception):
    def __init__(self, message=None, user_error=False):
        if user_error:
            self.user_error = user_error
        if message:
            self.message = message
