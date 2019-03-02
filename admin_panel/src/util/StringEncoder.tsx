export function escapeExclaimsAndSlashes(str: string) {
    const escapedExclaims = str.replace(/!/g, "!!");
    return escapedExclaims.replace(/\//g, "!\\");
}

export function encodeString(str: string) {
    return encodeURIComponent(escapeExclaimsAndSlashes(str));
}