export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message;
  } else {
    let errorString = "[Could not stringify error]";
    try {
      errorString = JSON.stringify(error);
    } catch (error) {
      // ignore
    }

    return `Unexpected error thrown: ${errorString}`;
  }
}

function isError(error: unknown): error is Error {
  if (error instanceof Error) {
    return true;
  } else if (typeof error === "object" && error !== null) {
    return "message" in error && "name" in error;
  } else {
    return false;
  }
}
