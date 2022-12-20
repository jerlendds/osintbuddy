

# https://stackoverflow.com/a/19640336
x_headers = {
  "user_error": lambda is_user_error: {
    'X-OSINTBuddy-UserError': "true"
  }
}